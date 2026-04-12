import { relations } from "drizzle-orm/relations";
import { brandLookup, yarnProducts, weightLookup, fiberLookup, yarnStash, patterns, finishedProjects } from "./schema";

export const yarnProductsRelations = relations(yarnProducts, ({one, many}) => ({
	brandLookup: one(brandLookup, {
		fields: [yarnProducts.brandId],
		references: [brandLookup.brandId]
	}),
	weightLookup: one(weightLookup, {
		fields: [yarnProducts.weightId],
		references: [weightLookup.weightId]
	}),
	fiberLookup: one(fiberLookup, {
		fields: [yarnProducts.fiberId],
		references: [fiberLookup.fiberId]
	}),
	yarnStashes: many(yarnStash),
}));

export const brandLookupRelations = relations(brandLookup, ({many}) => ({
	yarnProducts: many(yarnProducts),
}));

export const weightLookupRelations = relations(weightLookup, ({many}) => ({
	yarnProducts: many(yarnProducts),
	patterns: many(patterns),
}));

export const fiberLookupRelations = relations(fiberLookup, ({many}) => ({
	yarnProducts: many(yarnProducts),
}));

export const yarnStashRelations = relations(yarnStash, ({one, many}) => ({
	yarnProduct: one(yarnProducts, {
		fields: [yarnStash.productId],
		references: [yarnProducts.productId]
	}),
	finishedProjects: many(finishedProjects),
}));

export const patternsRelations = relations(patterns, ({one, many}) => ({
	weightLookup: one(weightLookup, {
		fields: [patterns.recommendedWeightId],
		references: [weightLookup.weightId]
	}),
	finishedProjects: many(finishedProjects),
}));

export const finishedProjectsRelations = relations(finishedProjects, ({one}) => ({
	yarnStash: one(yarnStash, {
		fields: [finishedProjects.yarnId],
		references: [yarnStash.yarnId]
	}),
	pattern: one(patterns, {
		fields: [finishedProjects.patternId],
		references: [patterns.patternId]
	}),
}));