import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { yarnStash } from "../../drizzle/schema.js";
import { db } from "../db/index.js";
import { notFound, stashQuery } from "./shared.js";

const stashBody = { type: "object", additionalProperties: false, properties: { productId: { type: "integer", minimum: 1 }, color: { type: "string", minLength: 1, maxLength: 255 }, yards: { type: "integer", minimum: 0 } } } as const;
type StashBody = { productId?: number; color?: string; yards?: number };
const byId = async (id: number) => (await stashQuery()).find((row) => row.yarnId === id);
export const stashRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/yarn-stash", async () => stashQuery());
  fastify.post("/yarn-stash", { schema: { body: { ...stashBody, required: ["productId", "color", "yards"] } } }, async (request, reply) => { const [created] = await db.insert(yarnStash).values(request.body as Required<StashBody>).returning(); reply.code(201); return byId(created!.yarnId); });
  fastify.patch("/yarn-stash/:yarnId", { schema: { params: { type: "object", required: ["yarnId"], properties: { yarnId: { type: "integer", minimum: 1 } } }, body: stashBody } }, async (request, reply) => { const { yarnId } = request.params as { yarnId: number }; const body = request.body as StashBody; if (!Object.keys(body).length) return reply.code(422).send({ message: "Validation failed" }); const [updated] = await db.update(yarnStash).set(body).where(eq(yarnStash.yarnId, yarnId)).returning(); return updated ? byId(updated.yarnId) : reply.code(404).send(notFound); });
  fastify.delete("/yarn-stash/:yarnId", { schema: { params: { type: "object", required: ["yarnId"], properties: { yarnId: { type: "integer", minimum: 1 } } } } }, async (request, reply) => { const { yarnId } = request.params as { yarnId: number }; const removed = await db.delete(yarnStash).where(eq(yarnStash.yarnId, yarnId)).returning(); return removed.length ? reply.code(204).send() : reply.code(404).send(notFound); });
};
