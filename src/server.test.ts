import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp, databaseErrorCode } from "./server.js";

let app: FastifyInstance | undefined;
afterEach(async () => { await app?.close(); app = undefined; });

describe("application routes", () => {
  it("finds a PostgreSQL code nested inside a Drizzle error", () => {
    expect(databaseErrorCode({ cause: { code: "23503" } })).toBe("23503");
  });

  it("serves the health check without a database query", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "GET", url: "/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: "ok" });
  });

  it("does not expose mutation routes for immutable lookup tables", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "POST", url: "/api/lookups/weights", payload: { name: "New weight" } });
    expect(response.statusCode).toBe(404);
  });

  it("does not expose brand update or delete routes", async () => {
    app = await buildApp();
    const response = await app.inject({ method: "PATCH", url: "/api/brands/1", payload: { name: "Changed" } });
    expect(response.statusCode).toBe(404);
  });
});
