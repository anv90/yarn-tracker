import { defineConfig } from "drizzle-kit";

export default defineConfig({
  // In 0.31+, 'dialect' is mandatory at the top level
  dialect: "postgresql", 
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    // Ensure you use 'url' for a connection string
    url: process.env.DATABASE_URL!, 
  },
  // This is a helpful new feature to see what's happening
  verbose: true,
  strict: true,
});
