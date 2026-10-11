# EwwPOS

Point of Sale (POS) and inventory management system. `ewwpos` is a monorepo
built with [Bun](https://bun.com) workspaces and [Turborepo](https://turborepo.dev),
composed of a NestJS API, a Next.js web app, and a shared types package.

Repository: <https://github.com/ewwhenry/EwwPOS>

## Project structure

```
ewwpos/
├── apps/
│   ├── server/          # NestJS API (inventory, catalog, ...)
│   └── web/             # Next.js + React frontend
├── packages/
│   └── types/           # Shared Zod schemas & TypeScript types (@repo/types)
├── package.json         # Workspace root
├── turbo.json           # Turborepo pipeline
└── tsconfig.json        # Base TypeScript config
```

## Tech stack

| Layer          | Technology                                              |
| -------------- | ------------------------------------------------------- |
| Runtime / PM   | Bun                                                     |
| Monorepo       | Turborepo + Bun workspaces                              |
| API            | NestJS 12, Express, RxJS                                |
| Web            | Next.js 16, React 19, Tailwind CSS 4                    |
| Validation     | Zod 4                                                   |
| Language       | TypeScript                                              |
| Testing        | Vitest (+ Supertest for e2e)                            |
| Linting/Format | Oxlint, Prettier                                        |

## Prerequisites

- [Bun](https://bun.com) `>= 1.2`

## Getting started

Install all workspace dependencies from the repository root:

```bash
bun install
```

### Development

Run every workspace in watch mode via Turborepo:

```bash
bun run dev
```

Or start an individual app:

```bash
# API (NestJS) — http://localhost:3001
bun --filter server run start:dev

# Web (Next.js) — http://localhost:3000
bun --filter web run dev
```

### Build, test & lint

```bash
bun run build          # build all workspaces (Turbo)
bun run test           # run unit tests
bun run lint           # lint all workspaces
bun run check-types    # type-check all workspaces
```

Per-workspace scripts also exist (see each `package.json`), for example
`bun --filter server run test:e2e` or `bun --filter server run test:cov`.

## API — Inventory

Base URL: `http://localhost:3001`. Products are currently stored **in memory**
(a database is not wired up yet), so data is reset on every restart.

### List all products

```http
GET /inventory/all
```

### Create a product

```http
POST /inventory/new
Content-Type: application/json
```

```json
{
  "sku": "SKU-001",
  "barcode": "1234567890123",
  "name": "Whole milk 1L",
  "description": "Pasteurized whole milk",
  "measurement_unit": "l",
  "cost_price": 1.2,
  "price": 1.8,
  "wholesale_price": 1.5,
  "tax_rate": 0.16,
  "tax_id": null,
  "min_stock": 10,
  "is_stock_tracked": true,
  "is_weighable": false,
  "category_id": "dairy"
}
```

The request body is validated with
[`createProductBodySchema`](packages/types/src/index.ts). Invalid payloads
return `400 Bad Request` with a per-field `errors` map.

> **Note on input handling.** Because the API also accepts `form-urlencoded`
> bodies from the browser, the schema coerces and normalizes values: numbers
> are converted with `z.coerce.number()`, empty strings become `null`, and
> booleans are parsed as the literal string `"true"` (never via
> `Boolean("false")`, which would wrongly yield `true`).

## Shared types

`@repo/types` centralizes product validation so the API and the web app stay in
sync.

```ts
import {
  createProductBodySchema,
  productSchema,
  type Product,
  type CreateProductBody,
} from "@repo/types";
```

- `MeasurementUnits` — catalog of supported units (`kg`, `g`, `l`, `pc`, ...).
- `productSchema` / `Product` — the persisted product shape.
- `createProductBodySchema` / `CreateProductBody` — the input shape used by the
  `POST /inventory/new` endpoint.

## Roadmap

- [ ] Persist products in a real database (replace in-memory storage).
- [ ] Build the web UI (product catalog, sales, checkout).
- [ ] Authentication and user/role management.
- [ ] Sales, cash register and reporting modules.

## Author

**Enrique Mercado Gutierrez** ([ewwhenry](https://github.com/ewwhenry)) — [github.com/ewwhenry/EwwPOS](https://github.com/ewwhenry/EwwPOS)

## License

[MIT](./LICENSE)
