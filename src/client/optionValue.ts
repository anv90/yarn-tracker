import type { OptionType, RecordRow } from "./types.js";

const keyByOptionType = { brands: "id", weights: "id", fibers: "id", products: "productId", stash: "yarnId", patterns: "patternId" } as const;

export const optionValue = (option: RecordRow, optionType: OptionType): string => {
  const value = option[keyByOptionType[optionType]];
  if (value === undefined || value === null) throw new Error(`Option is missing ${keyByOptionType[optionType]}`);
  return String(value);
};
