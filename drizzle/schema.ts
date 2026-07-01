import { pgTable, index, foreignKey, bigint, varchar, integer, numeric, unique, text } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const yarnProducts = pgTable("yarn_products", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	productId: bigint("product_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "yarn_products_product_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
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
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.weightId],
			foreignColumns: [weightLookup.weightId],
			name: "fk_yarn_products_weight"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.fiberId],
			foreignColumns: [fiberLookup.fiberId],
			name: "fk_yarn_products_fiber"
		}).onDelete("restrict"),
]);

export const yarnStash = pgTable("yarn_stash", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	yarnId: bigint("yarn_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "yarn_stash_yarn_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
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
		}).onDelete("restrict"),
]);

export const patterns = pgTable("patterns", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	patternId: bigint("pattern_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "patterns_pattern_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
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
		}).onDelete("restrict"),
]);

export const fiberLookup = pgTable("fiber_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fiberId: bigint("fiber_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "fiber_lookup_fiber_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("fiber_lookup_name_key").on(table.name),
]);

export const finishedProjects = pgTable("finished_projects", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	finishedProjectId: bigint("finished_project_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "finished_projects_finished_project_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
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
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.patternId],
			foreignColumns: [patterns.patternId],
			name: "fk_finished_projects_pattern"
		}).onDelete("restrict"),
]);

export const weightLookup = pgTable("weight_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	weightId: bigint("weight_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "weight_lookup_weight_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("weight_lookup_name_key").on(table.name),
]);

export const brandLookup = pgTable("brand_lookup", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	brandId: bigint("brand_id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity({ name: "brand_lookup_brand_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("brand_lookup_name_key").on(table.name),
]);
