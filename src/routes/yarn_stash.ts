import { type FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";
import { yarnProducts, yarnStash } from "../../drizzle/schema.js";
import { db } from "../db/index.js";

export const stashRoutes: FastifyPluginAsync = async (fastify) => {
  // GET -> joined on product_id
  fastify.get("/stash", async () => {
    return db
      .select({
        yarnId: yarnStash.yarnId,
        productId: yarnStash.productId,
        color: yarnStash.color,
        yards: yarnStash.yards,
        product: {
          productId: yarnProducts.productId,
          brandId: yarnProducts.brandId,
          name: yarnProducts.name,
          weightId: yarnProducts.weightId,
          fiberId: yarnProducts.fiberId,
        },
      })
      .from(yarnStash)
      .innerJoin(yarnProducts, eq(yarnStash.productId, yarnProducts.productId));
  });

  fastify.post(
    "/stash",
    {
      schema: {
        body: {
          type: "object",
          required: ["productId", "color", "yards"],
          additionalProperties: false,
          properties: {
            productId: { type: "integer", minimum: 1 },
            color: { type: "string", minLength: 1, maxLength: 255 },
            yards: { type: "integer", minimum: 0 },
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body as { productId: number; color: string; yards: number };

      const [created] = await db
        .insert(yarnStash)
        .values(body)
        .returning();

      reply.code(201);
      return created;
    }
  );

  // PATCH (you didn't constrain it to yards-only in this final spec; keeping it limited to yards+color+productId)
  fastify.patch(
    "/stash/:yarnId",
    {
      schema: {
        params: {
          type: "object",
          required: ["yarnId"],
          properties: { yarnId: { type: "integer", minimum: 1 } },
        },
        body: {
          type: "object",
          additionalProperties: false,
          properties: {
            productId: { type: "integer", minimum: 1 },
            color: { type: "string", minLength: 1, maxLength: 255 },
            yards: { type: "integer", minimum: 0 },
          },
        },
      },
    },
    async (request, reply) => {
      const { yarnId } = request.params as { yarnId: number };
      const body = request.body as { productId?: number; color?: string; yards?: number };

      const [updated] = await db
        .update(yarnStash)
        .set(body)
        .where(eq(yarnStash.yarnId, yarnId))
        .returning();

      if (!updated) return reply.code(404).send({ message: "Not found" });
      return updated;
    }
  );

  fastify.delete(
    "/stash/:yarnId",
    {
      schema: {
        params: {
          type: "object",
          required: ["yarnId"],
          properties: { yarnId: { type: "integer", minimum: 1 } },
        },
      },
    },
    async (request, reply) => {
      const { yarnId } = request.params as { yarnId: number };

      const deleted = await db
        .delete(yarnStash)
        .where(eq(yarnStash.yarnId, yarnId))
        .returning();

      if (deleted.length === 0) return reply.code(404).send({ message: "Not found" });
      return deleted[0];
    }
  );
};