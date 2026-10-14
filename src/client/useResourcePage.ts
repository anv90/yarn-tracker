import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api.js";
import { matchesFilters } from "./filter.js";
import type { PageConfig, RecordRow } from "./types.js";

export const useResourcePage = (config: PageConfig) => {
  const [rows, setRows] = useState<RecordRow[]>([]); const [editing, setEditing] = useState<RecordRow | null>(null); const [adding, setAdding] = useState(false); const [error, setError] = useState(""); const [filters, setFilters] = useState<Record<string, string>>({}); const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { const results = await api<RecordRow[]>(config.endpoint); setRows(results); }, [config.endpoint]);
  useEffect(() => { let active = true; setRows([]); setError(""); setLoading(true); void api<RecordRow[]>(config.endpoint).then((results) => { if (active) setRows(results); }).catch((cause: Error) => { if (active) setError(cause.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, [config.endpoint]);
  const remove = async (row: RecordRow) => { if (!window.confirm("Delete this record?")) return; try { await api(`${config.endpoint}/${row[config.id]}`, { method: "DELETE" }); await load(); } catch (cause) { setError((cause as Error).message); } };
  return { rows, visible: useMemo(() => rows.filter((row) => matchesFilters(row, filters)), [rows, filters]), editing, setEditing, adding, setAdding, error, filters, setFilters, remove, load, loading };
};
