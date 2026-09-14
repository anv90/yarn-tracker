import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "../db/index.js";
import { brandLookup, fiberLookup, finishedProjects, patterns, weightLookup, yarnProducts, yarnStash } from "../../drizzle/schema.js";

export const productsQuery = () => db.select({ productId: yarnProducts.productId, name: yarnProducts.name, brandId: yarnProducts.brandId, weightId: yarnProducts.weightId, fiberId: yarnProducts.fiberId, brand: brandLookup.name, weight: weightLookup.name, fiber: fiberLookup.name }).from(yarnProducts).innerJoin(brandLookup, eq(yarnProducts.brandId, brandLookup.brandId)).innerJoin(weightLookup, eq(yarnProducts.weightId, weightLookup.weightId)).innerJoin(fiberLookup, eq(yarnProducts.fiberId, fiberLookup.fiberId));

export const stashQuery = () => db.select({ yarnId: yarnStash.yarnId, productId: yarnStash.productId, color: yarnStash.color, yards: yarnStash.yards, product: yarnProducts.name, brand: brandLookup.name, weight: weightLookup.name, fiber: fiberLookup.name }).from(yarnStash).innerJoin(yarnProducts, eq(yarnStash.productId, yarnProducts.productId)).innerJoin(brandLookup, eq(yarnProducts.brandId, brandLookup.brandId)).innerJoin(weightLookup, eq(yarnProducts.weightId, weightLookup.weightId)).innerJoin(fiberLookup, eq(yarnProducts.fiberId, fiberLookup.fiberId));

export const patternsQuery = () => db.select({ patternId: patterns.patternId, name: patterns.name, link: patterns.link, recommendedWeightId: patterns.recommendedWeightId, recommendedWeight: weightLookup.name, yardage: patterns.yardage }).from(patterns).innerJoin(weightLookup, eq(patterns.recommendedWeightId, weightLookup.weightId));

const patternWeights = alias(weightLookup, "pattern_weights");
export const finishedProjectsQuery = () => db.select({ finishedProjectId: finishedProjects.finishedProjectId, yarnId: finishedProjects.yarnId, patternId: finishedProjects.patternId, notes: finishedProjects.notes, stashColor: yarnStash.color, stashYards: yarnStash.yards, product: yarnProducts.name, brand: brandLookup.name, productWeight: weightLookup.name, fiber: fiberLookup.name, pattern: patterns.name, patternLink: patterns.link, patternYardage: patterns.yardage, patternWeight: patternWeights.name }).from(finishedProjects).innerJoin(yarnStash, eq(finishedProjects.yarnId, yarnStash.yarnId)).innerJoin(yarnProducts, eq(yarnStash.productId, yarnProducts.productId)).innerJoin(brandLookup, eq(yarnProducts.brandId, brandLookup.brandId)).innerJoin(weightLookup, eq(yarnProducts.weightId, weightLookup.weightId)).innerJoin(fiberLookup, eq(yarnProducts.fiberId, fiberLookup.fiberId)).innerJoin(patterns, eq(finishedProjects.patternId, patterns.patternId)).innerJoin(patternWeights, eq(patterns.recommendedWeightId, patternWeights.weightId));

export const notFound = { message: "Not found" };
export const dependencyError = (message: string) => ({ message });
