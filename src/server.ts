import "dotenv/config";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fastifyStatic from "@fastify/static";
import Fastify, { type FastifyInstance } from "fastify";
import { brandsRoutes } from "./routes/yarn_brands.js";
import { finishedProjectsRoutes } from "./routes/finished_projects.js";
import { patternsRoutes } from "./routes/patterns.js";
import { yarnProductsRoutes } from "./routes/yarn_products.js";
import { stashRoutes } from "./routes/yarn_stash.js";

export const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: true });
  app.setErrorHandler((error, _request, reply) => {
    const code = (error as { code?: string }).code;
    if (code === "23503") return reply.code(409).send({ message: "This record is still referenced by another record" });
    if (code === "23505") return reply.code(409).send({ message: "A record with those values already exists" });
    if ((error as { validation?: unknown }).validation) return reply.code(422).send({ message: "Validation failed", errors: (error as { validation: unknown }).validation });
    app.log.error(error); return reply.code(500).send({ message: "Unexpected server error" });
  });
  app.get("/health", async () => ({ status: "ok", timestamp: new Date().toISOString() }));
  await app.register(brandsRoutes, { prefix: "/api" });
  await app.register(yarnProductsRoutes, { prefix: "/api" });
  await app.register(stashRoutes, { prefix: "/api" });
  await app.register(patternsRoutes, { prefix: "/api" });
  await app.register(finishedProjectsRoutes, { prefix: "/api" });
  const directory = path.resolve(process.cwd(), "client-dist");
  if (existsSync(directory)) {
    await app.register(fastifyStatic, { root: directory, prefix: "/", wildcard: false });
    app.get("/*", (_request, reply) => reply.sendFile("index.html"));
  }
  return app;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = await buildApp();
  await app.listen({ port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" });
}
