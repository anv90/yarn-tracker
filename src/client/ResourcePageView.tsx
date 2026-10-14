import { ResourceEditor } from "./ResourceEditor.js";
import { DataTable } from "./DataTable.js";
import type { PageConfig } from "./types.js";
import { useResourcePage } from "./useResourcePage.js";

export const ResourcePageView = ({ config }: { config: PageConfig }) => {
  const page = useResourcePage(config); const add = () => { page.setAdding(true); page.setEditing(null); }; const close = () => { page.setAdding(false); page.setEditing(null); };
  return <section><header><h1>{config.title}</h1><button onClick={add}>Add {config.singularTitle}</button></header>{page.error && <p className="error" role="alert">{page.error}</p>}{(page.adding || page.editing) && <ResourceEditor config={config} current={page.editing} done={() => { close(); void page.load(); }} cancel={close} />}{page.loading ? <p>Loading data…</p> : page.rows.length === 0 ? <div className="empty-state"><p>{config.emptyMessage}</p><button onClick={add}>Add {config.singularTitle}</button></div> : page.visible.length === 0 ? <div className="empty-state"><p>No matching data.</p><button onClick={() => page.setFilters({})}>Clear filters</button><button onClick={add}>Add {config.singularTitle}</button></div> : <><DataTable config={config} rows={page.visible} filters={page.filters} setFilters={page.setFilters} onEdit={(row) => { page.setEditing(row); page.setAdding(false); }} onDelete={(row) => void page.remove(row)} /><button className="clear" onClick={() => page.setFilters({})}>Clear filters</button></>}</section>;
};
