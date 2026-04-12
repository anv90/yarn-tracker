import { pgTable, bigint, varchar, index, foreignKey, integer, numeric, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const brandLookup = pgTable("brand_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	brandId: bigint("brand_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const yarnProducts = pgTable("yarn_products", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	brandId: bigint("brand_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	weightId: bigint("weight_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fiberId: bigint("fiber_id", { mode: "number" }).notNull(),
}, (table) => [
	index("ix_yarn_products_brand_id").using("btree", table.brandId.asc().nullsLast().op("int8_ops")),
	index("ix_yarn_products_fiber_id").using("btree", table.fiberId.asc().nullsLast().op("int8_ops")),
	index("ix_yarn_products_weight_id").using("btree", table.weightId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.brandId],
			foreignColumns: [brandLookup.brandId],
			name: "fk_yarn_products_brand"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.weightId],
			foreignColumns: [weightLookup.weightId],
			name: "fk_yarn_products_weight"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.fiberId],
			foreignColumns: [fiberLookup.fiberId],
			name: "fk_yarn_products_fiber"
		}).onDelete("cascade"),
]);

export const weightLookup = pgTable("weight_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	weightId: bigint("weight_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const fiberLookup = pgTable("fiber_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fiberId: bigint("fiber_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const yarnStash = pgTable("yarn_stash", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	yarnId: bigint("yarn_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).notNull(),
	color: varchar({ length: 255 }).notNull(),
	yards: integer().notNull(),
}, (table) => [
	index("ix_yarn_stash_product_id").using("btree", table.productId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [yarnProducts.productId],
			name: "fk_yarn_stash_product"
		}).onDelete("cascade"),
]);

export const patterns = pgTable("patterns", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	patternId: bigint("pattern_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	link: varchar({ length: 2048 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	recommendedWeightId: bigint("recommended_weight_id", { mode: "number" }).notNull(),
	yardage: numeric().notNull(),
}, (table) => [
	index("ix_patterns_recommended_weight_id").using("btree", table.recommendedWeightId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.recommendedWeightId],
			foreignColumns: [weightLookup.weightId],
			name: "fk_patterns_recommended_weight"
		}).onDelete("cascade"),
]);

export const finishedProjects = pgTable("finished_projects", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	finishedProjectId: bigint("finished_project_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	yarnId: bigint("yarn_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	patternId: bigint("pattern_id", { mode: "number" }).notNull(),
	notes: text(),
}, (table) => [
	index("ix_finished_projects_pattern_id").using("btree", table.patternId.asc().nullsLast().op("int8_ops")),
	index("ix_finished_projects_yarn_id").using("btree", table.yarnId.asc().nullsLast().op("int8_ops")),
	foreignKey({
			columns: [table.yarnId],
			foreignColumns: [yarnStash.yarnId],
			name: "fk_finished_projects_yarn"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.patternId],
			foreignColumns: [patterns.patternId],
			name: "fk_finished_projects_pattern"
		}).onDelete("cascade"),
]);
