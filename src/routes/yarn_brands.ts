import { type FastifyPluginAsync } from "fastify";
import { brandLookup } from "../../drizzle/schema.js";
import { db } from "../db/index.js";

export const brandsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET -> fetches all columns from lookup
  fastify.get("/brands", async () => {
    return db.select().from(brandLookup);
  });

  // POST -> add brand
  fastify.post(
    "/brands",
    {
      schema: {
        body: {
          type: "object",
          required: ["name"],
          additionalProperties: false,
          properties: {
            name: { type: "string", minLength: 1, maxLength: 255 },
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body as { name: string };

      const [created] = await db
        .insert(brandLookup)
        .values({ name: body.name })
        .returning();

      reply.code(201);
      return created;
    }
  );
};