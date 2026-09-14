export const matchesFilters = (row: Record<string, unknown>, filters: Record<string, string>): boolean => Object.entries(filters).every(([key, filter]) => {
  if (!filter) return true;
  return String(row[key] ?? "").toLocaleLowerCase().includes(filter.toLocaleLowerCase());
});
