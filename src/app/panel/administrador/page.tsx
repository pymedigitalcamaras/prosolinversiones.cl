import type { Metadata } from "next";
import { Building2, FolderKanban, NotebookPen } from "lucide-react";
import { requirePanelRole } from "@/lib/auth/access";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = { title: "Panel de administrador", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function getBuildings() {
  const { data } = await supabaseAdmin.from("buildings").select("*").order("created_at", { ascending: false });
  return data || [];
}

async function getProjects() {
  const { data } = await supabaseAdmin.from("projects").select("*").order("created_at", { ascending: false }).limit(5);
  return data || [];
}

async function getLogEntries() {
  const { data } = await supabaseAdmin.from("log_entries").select("*").order("date", { ascending: false }).limit(5);
  return data || [];
}

export default async function AdministratorPanel() {
  const session = await requirePanelRole("administrador");
  const buildings = await getBuildings();
  const projects = await getProjects();
  const logs = await getLogEntries();

  return (
    <>
      <header className="panel-page-header">
        <span className="eyebrow">Panel ADMINISTRADORES</span>
        <h1>Antecedentes de sus edificios autorizados.</h1>
        <p>Sesión de {session.name}. Conectado a Supabase.</p>
      </header>

      {/* Buildings */}
      <section className="panel-data-section">
        <h2><Building2 size={20} /> Edificios ({buildings.length})</h2>
        {buildings.length === 0 ? (
          <p className="panel-empty">No hay edificios registrados.</p>
        ) : (
          <table className="panel-table">
            <thead>
              <tr><th>Nombre</th><th>Dirección</th><th>Unidades</th><th>Administrador</th><th>Sistema</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {buildings.map((b) => (
                <tr key={b.id}>
                  <td>{b.display_name}</td>
                  <td>{b.address || "—"}</td>
                  <td>{b.units || "—"}</td>
                  <td>{b.admin_name || "—"}</td>
                  <td>{b.system_type || "—"}</td>
                  <td><span className={`panel-badge panel-badge--${b.status}`}>{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Projects */}
      <section className="panel-data-section">
        <h2><FolderKanban size={20} /> Últimos proyectos</h2>
        {projects.length === 0 ? (
          <p className="panel-empty">No hay proyectos registrados.</p>
        ) : (
          <table className="panel-table">
            <thead>
              <tr><th>Título</th><th>Estado</th><th>Presupuesto</th><th>Inicio</th></tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td><span className={`panel-badge panel-badge--${p.status}`}>{p.status}</span></td>
                  <td>{p.estimated_budget ? `$${p.estimated_budget.toLocaleString("es-CL")}` : "—"}</td>
                  <td>{p.start_at ? new Date(p.start_at).toLocaleDateString("es-CL") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Log Entries */}
      <section className="panel-data-section">
        <h2><NotebookPen size={20} /> Últimas bitácoras</h2>
        {logs.length === 0 ? (
          <p className="panel-empty">No hay entradas de bitácora.</p>
        ) : (
          <table className="panel-table">
            <thead>
              <tr><th>Fecha</th><th>Tipo</th><th>Descripción</th><th>Técnico</th></tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.date || "—"}</td>
                  <td>{l.entry_type || "—"}</td>
                  <td>{l.description}</td>
                  <td>{l.technician_name || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}
