import { describe, expect, it } from "vitest";
import { patternsConfig, productsConfig, projectsConfig, stashConfig } from "./configs.js";

describe("page table configurations", () => {
  it("defines filters only for displayed Yarn Products columns", () => {
    expect(productsConfig.columns.map((column) => column.key)).toEqual(["productId", "name", "brand", "weight", "fiber"]);
  });

  it("uses resource-specific empty-state messages", () => {
    expect(stashConfig.emptyMessage).toBe("No yarn stash data present.");
    expect(patternsConfig.emptyMessage).toBe("No patterns present.");
    expect(projectsConfig.emptyMessage).toBe("No finished projects present.");
  });
});
