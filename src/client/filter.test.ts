import { describe, expect, it } from "vitest";
import { matchesFilters } from "./filter.js";

describe("matchesFilters", () => {
  const row = { yarnId: 12, color: "Rose", product: "Soft Merino", yards: 150 };
  it("matches text without regard to case", () => expect(matchesFilters(row, { color: "ros", product: "MER" })).toBe(true));
  it("combines populated filters", () => expect(matchesFilters(row, { color: "rose", yards: "999" })).toBe(false));
  it("accepts blank filters", () => expect(matchesFilters(row, { color: "" })).toBe(true));
});
