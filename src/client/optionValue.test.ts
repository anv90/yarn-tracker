import { describe, expect, it } from "vitest";
import { optionValue } from "./optionValue.js";

describe("optionValue", () => {
  it("uses yarnId rather than productId for a stash option", () => {
    expect(optionValue({ yarnId: 7, productId: 50 }, "stash")).toBe("7");
  });

  it("uses the ID required by each other foreign-key selector", () => {
    expect(optionValue({ productId: 50 }, "products")).toBe("50");
    expect(optionValue({ patternId: 3, recommendedWeightId: 4 }, "patterns")).toBe("3");
    expect(optionValue({ id: 2 }, "brands")).toBe("2");
  });
});
