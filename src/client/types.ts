export type RecordRow = Record<string, unknown>;
export type OptionType = "brands" | "weights" | "fibers" | "products" | "stash" | "patterns";
export type Field = { key: string; label: string; type?: "number" | "url" | "textarea"; options?: OptionType; required?: boolean };
export type PageConfig = { title: string; singularTitle: string; endpoint: string; id: string; emptyMessage: string; columns: Field[]; fields: Field[]; productBrandFlow?: boolean };
