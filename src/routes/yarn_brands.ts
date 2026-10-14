import type { FastifyPluginAsync } from "fastify";
import { asc, eq } from "drizzle-orm";
import { brandLookup, fiberLookup, weightLookup } from "../../drizzle/schema.js";
import { db } from "../db/index.js";

export const brandsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/lookups/brands", async () => db.select({ id: brandLookup.brandId, name: brandLookup.name }).from(brandLookup).orderBy(asc(brandLookup.name)));
  fastify.get("/lookups/weights", async () => db.select({ id: weightLookup.weightId, name: weightLookup.name }).from(weightLookup).orderBy(asc(weightLookup.name)));
  fastify.get("/lookups/fibers", async () => db.select({ id: fiberLookup.fiberId, name: fiberLookup.name }).from(fiberLookup).orderBy(asc(fiberLookup.name)));
  fastify.post("/brands", { schema: { body: { type: "object", required: ["name"], additionalProperties: false, properties: { name: { type: "string", minLength: 1, maxLength: 255 } } } } }, async (request, reply) => {
    const name = (request.body as { name: string }).name.trim(); const existing = await db.select().from(brandLookup).where(eq(brandLookup.name, name)).limit(1);
    if (existing.length) return reply.code(409).send({ message: "A brand with that name already exists" });
    const [created] = await db.insert(brandLookup).values({ name }).returning(); reply.code(201); return { id: created!.brandId, name: created!.name };
  });
};
