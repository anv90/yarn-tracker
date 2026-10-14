import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { patterns } from "../../drizzle/schema.js";
import { db } from "../db/index.js";
import { notFound, patternsQuery } from "./shared.js";

const bodySchema = { type: "object", additionalProperties: false, properties: { name: { type: "string", minLength: 1, maxLength: 255 }, link: { type: "string", format: "uri", maxLength: 2048 }, recommendedWeightId: { type: "integer", minimum: 1 }, yardage: { type: "string", pattern: "^[0-9]+(\\.[0-9]+)?$" } } } as const;
type PatternBody = { name?: string; link?: string; recommendedWeightId?: number; yardage?: string };
const byId = async (id: number) => (await patternsQuery()).find((row) => row.patternId === id);
export const patternsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/patterns", async () => patternsQuery());
  fastify.post("/patterns", { schema: { body: { ...bodySchema, required: ["name", "link", "recommendedWeightId", "yardage"] } } }, async (request, reply) => { const [created] = await db.insert(patterns).values(request.body as Required<PatternBody>).returning(); reply.code(201); return byId(created!.patternId); });
  fastify.patch("/patterns/:patternId", { schema: { params: { type: "object", required: ["patternId"], properties: { patternId: { type: "integer", minimum: 1 } } }, body: bodySchema } }, async (request, reply) => { const { patternId } = request.params as { patternId: number }; const body = request.body as PatternBody; if (!Object.keys(body).length) return reply.code(422).send({ message: "Validation failed" }); const [updated] = await db.update(patterns).set(body).where(eq(patterns.patternId, patternId)).returning(); return updated ? byId(updated.patternId) : reply.code(404).send(notFound); });
  fastify.delete("/patterns/:patternId", { schema: { params: { type: "object", required: ["patternId"], properties: { patternId: { type: "integer", minimum: 1 } } } } }, async (request, reply) => { const { patternId } = request.params as { patternId: number }; const removed = await db.delete(patterns).where(eq(patterns.patternId, patternId)).returning(); return removed.length ? reply.code(204).send() : reply.code(404).send(notFound); });
};
