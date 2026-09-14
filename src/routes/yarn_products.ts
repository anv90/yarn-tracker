import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { yarnProducts } from "../../drizzle/schema.js";
import { db } from "../db/index.js";
import { notFound, productsQuery } from "./shared.js";

const productBody = { type: "object", additionalProperties: false, properties: { name: { type: "string", minLength: 1, maxLength: 255 }, brandId: { type: "integer", minimum: 1 }, weightId: { type: "integer", minimum: 1 }, fiberId: { type: "integer", minimum: 1 } } } as const;
type ProductBody = { name?: string; brandId?: number; weightId?: number; fiberId?: number };
const byId = async (id: number) => (await productsQuery()).find((row) => row.productId === id);

export const yarnProductsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/yarn-products", async () => productsQuery());
  fastify.post("/yarn-products", { schema: { body: { ...productBody, required: ["name", "brandId", "weightId", "fiberId"] } } }, async (request, reply) => {
    const [created] = await db.insert(yarnProducts).values(request.body as Required<ProductBody>).returning(); reply.code(201); return byId(created!.productId);
  });
  fastify.patch("/yarn-products/:productId", { schema: { params: { type: "object", required: ["productId"], properties: { productId: { type: "integer", minimum: 1 } } }, body: productBody } }, async (request, reply) => {
    const { productId } = request.params as { productId: number }; const body = request.body as ProductBody;
    if (!Object.keys(body).length) return reply.code(422).send({ message: "Validation failed" });
    const [updated] = await db.update(yarnProducts).set(body).where(eq(yarnProducts.productId, productId)).returning(); return updated ? byId(updated.productId) : reply.code(404).send(notFound);
  });
  fastify.delete("/yarn-products/:productId", { schema: { params: { type: "object", required: ["productId"], properties: { productId: { type: "integer", minimum: 1 } } } } }, async (request, reply) => {
    const { productId } = request.params as { productId: number }; const removed = await db.delete(yarnProducts).where(eq(yarnProducts.productId, productId)).returning(); return removed.length ? reply.code(204).send() : reply.code(404).send(notFound);
  });
};
