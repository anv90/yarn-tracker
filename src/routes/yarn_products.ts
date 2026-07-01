import { type FastifyPluginAsync } from "fastify";
import { eq } from "drizzle-orm";
import { brandLookup, yarnProducts } from "../../drizzle/schema.js";
import { db } from "../db/index.js"

export const yarnProductsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET -> yarn_products joined on FK for brand, includes brand lookup columns
  fastify.get("/yarn-products", async () => {
    return db
      .select({
        productId: yarnProducts.productId,
        brandId: yarnProducts.brandId,
        name: yarnProducts.name,
        weightId: yarnProducts.weightId,
        fiberId: yarnProducts.fiberId,
        brand: {
          brandId: brandLookup.brandId,
          name: brandLookup.name,
        },
      })
      .from(yarnProducts)
      .innerJoin(brandLookup, eq(yarnProducts.brandId, brandLookup.brandId));
  });

  fastify.post(
    "/yarn-products",
    {
      schema: {
        body: {
          type: "object",
          required: ["brandId", "name", "weightId", "fiberId"],
          additionalProperties: false,
          properties: {
            brandId: { type: "integer", minimum: 1 },
            name: { type: "string", minLength: 1, maxLength: 255 },
            weightId: { type: "integer", minimum: 1 },
            fiberId: { type: "integer", minimum: 1 },
          },
        },
      },
    },
    async (request, reply) => {
      const body = request.body as {
        brandId: number;
        name: string;
        weightId: number;
        fiberId: number;
      };

      const [created] = await db
        .insert(yarnProducts)
        .values(body)
        .returning();

      reply.code(201);
      return created;
    }
  );
};