import { z } from "zod";

export const MeasurementUnits = {
	Kilogram: "kg",
	Gram: "g",
	Pound: "lb",
	Liter: "l",
	Milliliter: "ml",
	Gallon: "gal",
	Piece: "pc",
	Box: "bx",
	Package: "pk",
	Set: "set",
	Dozen: "doz",
	Meter: "m",
	Centimeter: "cm",
	Inch: "in",
	Foot: "ft",
} as const;

export const productSchema = z.object({
	sku: z.string().min(1, "El SKU es obligatorio"),
	barcode: z.string().min(1, "El código de barras es obligatorio"),
	name: z.string().min(1, "El nombre del producto es obligatorio"),
	description: z.string().nullable(),
	measurement_unit: z.enum(MeasurementUnits),

	cost_price: z.number().min(0, "El costo no puede ser negativo"),
	price: z.number().min(0, "El precio no puede ser negativo"),
	wholesale_price: z
		.number()
		.min(0, "El precio de mayoreo no puede ser negativo")
		.nullable(),

	tax_rate: z
		.number()
		.min(0)
		.max(1, "El impuesto debe ser un porcentaje (ej. 0.16)"),
	tax_id: z.string().nullable(),

	stock: z.number().min(0, "El stock no puede ser negativo"),
	min_stock: z.number().min(0, "El stock mínimo no puede ser negativo"),
	is_stock_tracked: z.boolean(),

	is_weighable: z.boolean(),
	category_id: z.string().min(1, "La categoría es obligatoria"),
	is_active: z.boolean(),

	created_at: z.date(),
	updated_at: z.date(),
});

export const createProductBodySchema = z.object({
	sku: z.string().min(1, "El SKU es obligatorio"),
	barcode: z.string().min(1, "El código de barras es obligatorio"),
	name: z.string().min(1, "El nombre del producto es obligatorio"),

	// TRAMPA 1: Form-urlencoded envía los campos vacíos como "".
	// Lo transformamos a null para que coincida con tu base de datos.
	description: z
		.string()
		.transform((val) => (val === "" ? null : val))
		.nullable(),

	measurement_unit: z.enum(MeasurementUnits),

	// SOLUCIÓN PARA NÚMEROS: z.coerce.number()
	// Convierte el string "15" al número 15 automáticamente.
	cost_price: z.coerce.number().min(0, "El costo no puede ser negativo"),
	price: z.coerce.number().min(0, "El precio no puede ser negativo"),

	// TRAMPA 2: Si el precio de mayoreo viene vacío (""), z.coerce.number()
	// lo convertirá en 0. Usamos preprocess para forzarlo a null si viene vacío.
	wholesale_price: z.preprocess(
		(val) => (val === "" || val === undefined ? null : Number(val)),
		z.number().min(0).nullable(),
	),

	tax_rate: z.coerce.number().min(0).max(1),
	tax_id: z
		.string()
		.transform((val) => (val === "" ? null : val))
		.nullable(),

	min_stock: z.coerce.number().min(0),

	// TRAMPA 3: En JavaScript, Boolean("false") devuelve TRUE.
	// z.coerce.boolean() cometerá este error.
	// La forma segura es comparar si el string es exactamente "true".
	is_stock_tracked: z.preprocess((val) => val === "true", z.boolean()),
	is_weighable: z.preprocess((val) => val === "true", z.boolean()),

	category_id: z.string().min(1),
});

export type Product = z.infer<typeof productSchema>;

export type CreateProductBody = z.infer<typeof createProductBodySchema>;
