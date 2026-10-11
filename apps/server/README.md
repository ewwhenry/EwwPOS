# EwwPOS — Server

Backend API for [EwwPOS](../..), the Point of Sale and inventory management
system. Built with [NestJS](https://nestjs.com) 12 and validated with
[Zod](https://zod.dev).

## Overview

The server exposes a REST API consumed by the web app. It is part of a Bun +
Turborepo monorepo and shares its schemas and types with the rest of the
workspace through the [`@repo/types`](../../packages/types) package.

- **Runtime:** Node.js (via NestJS), TypeScript
- **Port:** `3001` (override with the `PORT` env var)
- **Validation:** Zod 4 (`@repo/types`)
- **Storage:** in memory — data is reset on every restart (see [Roadmap](#roadmap))

## Getting started

Run these from the repository root unless noted otherwise.

```bash
bun install
```

### Development

```bash
# watch mode
bun --filter server run start:dev

# normal start
bun --filter server run start

# debug mode (--debug --watch)
bun --filter server run start:debug
```

The API is then available at <http://localhost:3001>.

### Production

```bash
bun --filter server run build
bun --filter server run start:prod   # runs node dist/main
```

## API

Base URL: `http://localhost:3001`

| Method | Path              | Description            |
| ------ | ----------------- | ---------------------- |
| `GET`  | `/`               | Health/greeting check  |
| `GET`  | `/inventory/all`  | List all products      |
| `POST` | `/inventory/new`  | Create a product       |

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

On success the server returns the created product. The payload is validated
with [`createProductBodySchema`](../../packages/types/src/index.ts); invalid
requests return `400 Bad Request` with a per-field `errors` map:

```json
{
  "status_code": 400,
  "message": "Bad Request.",
  "errors": {
    "sku": ["El SKU es obligatorio"]
  }
}
```

> **Input handling.** The schema also accepts `form-urlencoded` bodies, so it
> coerces numbers with `z.coerce.number()`, maps empty strings to `null`, and
> parses booleans as the literal string `"true"` (never through
> `Boolean("false")`, which would incorrectly evaluate to `true`).

## Project structure

```
apps/server/
├── src/
│   ├── inventory/
│   │   ├── inventory.controller.ts   # HTTP endpoints
│   │   ├── inventory.service.ts      # Business logic (in-memory store)
│   │   └── inventory.module.ts       # Inventory module
│   ├── app.controller.ts             # Root controller
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts                       # Bootstrap (listens on :3001)
├── test/                             # e2e tests
├── nest-cli.json
└── vitest.config*.ts
```

## Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `start`              | Start the server                         |
| `start:dev`          | Start in watch mode                      |
| `start:debug`        | Start in debug + watch mode              |
| `start:prod`         | Run the compiled build (`node dist/main`)|
| `build`              | Compile with the Nest CLI                |
| `format`             | Format with Prettier                     |
| `lint`               | Lint with Oxlint (type-aware)            |
| `test`               | Run unit tests (Vitest)                  |
| `test:watch`         | Run tests in watch mode                  |
| `test:cov`           | Run tests with coverage                  |
| `test:e2e`           | Run end-to-end tests                     |

Run any script with `bun --filter server run <script>`.

## Roadmap

- [ ] Replace the in-memory store with a real database.
- [ ] Add authentication and roles.
- [ ] Add categories, sales and reporting modules.
