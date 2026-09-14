import { eq } from "drizzle-orm";
import type { FastifyPluginAsync } from "fastify";
import { finishedProjects } from "../../drizzle/schema.js";
import { db } from "../db/index.js";
import { finishedProjectsQuery, notFound } from "./shared.js";

const bodySchema = { type: "object", additionalProperties: false, properties: { yarnId: { type: "integer", minimum: 1 }, patternId: { type: "integer", minimum: 1 }, notes: { type: ["string", "null"] } } } as const;
type ProjectBody = { yarnId?: number; patternId?: number; notes?: string | null };
const byId = async (id: number) => (await finishedProjectsQuery()).find((row) => row.finishedProjectId === id);
export const finishedProjectsRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get("/finished-projects", async () => finishedProjectsQuery());
  fastify.post("/finished-projects", { schema: { body: { ...bodySchema, required: ["yarnId", "patternId"] } } }, async (request, reply) => { const [created] = await db.insert(finishedProjects).values(request.body as Required<ProjectBody>).returning(); reply.code(201); return byId(created!.finishedProjectId); });
  fastify.patch("/finished-projects/:finishedProjectId", { schema: { params: { type: "object", required: ["finishedProjectId"], properties: { finishedProjectId: { type: "integer", minimum: 1 } } }, body: bodySchema } }, async (request, reply) => { const { finishedProjectId } = request.params as { finishedProjectId: number }; const body = request.body as ProjectBody; if (!Object.keys(body).length) return reply.code(422).send({ message: "Validation failed" }); const [updated] = await db.update(finishedProjects).set(body).where(eq(finishedProjects.finishedProjectId, finishedProjectId)).returning(); return updated ? byId(updated.finishedProjectId) : reply.code(404).send(notFound); });
  fastify.delete("/finished-projects/:finishedProjectId", { schema: { params: { type: "object", required: ["finishedProjectId"], properties: { finishedProjectId: { type: "integer", minimum: 1 } } } } }, async (request, reply) => { const { finishedProjectId } = request.params as { finishedProjectId: number }; const removed = await db.delete(finishedProjects).where(eq(finishedProjects.finishedProjectId, finishedProjectId)).returning(); return removed.length ? reply.code(204).send() : reply.code(404).send(notFound); });
};
