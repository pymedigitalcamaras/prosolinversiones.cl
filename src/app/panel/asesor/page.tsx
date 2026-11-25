import type { Metadata } from "next";
import { CircleDollarSign, ContactRound, ShieldCheck, Users, Wallet } from "lucide-react";
import { requirePanelRole } from "@/lib/auth/access";
import { supabaseAdmin } from "@/lib/supabase";

export const metadata: Metadata = { title: "Panel de asesor", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

interface AdvisorClient {
  id: string;
  building_name: string | null;
  status: string;
}

interface AdvisorCommission {
  id: string;
  amount: number | null;
  percentage: number | null;
  status: string;
  created_at: string | null;
}

async function getAdvisorData(advisorId: string) {
  const [clientsRes, commissionsRes] = await Promise.all([
    supabaseAdmin.from("advisor_clients").select("*").eq("advisor_id", advisorId),
    supabaseAdmin.from("advisor_commissions").select("*").eq("advisor_id", advisorId),
  ]);
  return {
    clients: (clientsRes.data || []) as AdvisorClient[],
    commissions: (commissionsRes.data || []) as AdvisorCommission[],
  };
}

export default async function AdvisorPanel() {
  const session = await requirePanelRole("asesor");
  const advisorId = session.id || "demo";
  const { clients, commissions } = await getAdvisorData(advisorId);

  const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingCommissions = commissions.filter((c) => c.status === "pendiente").reduce((sum, c) => sum + (c.amount || 0), 0);

  return (
    <>
      <header className="panel-page-header">
        <span className="eyebrow">Panel COLABORADORES / ASESORES</span>
        <h1>Solo sus clientes y comisiones legítimas.</h1>
        <p>Sesión de {session.name}. Conectado a Supabase.</p>
      </header>

      <section className="panel-stats-grid" aria-label="Estadísticas">
        <div className="panel-stat-card">
          <Users size={24} />
          <strong>{clients.length}</strong>
          <span>Clientes</span>
        </div>
        <div className="panel-stat-card">
          <Wallet size={24} />
          <strong>${totalCommissions.toLocaleString("es-CL")}</strong>
          <span>Comisiones totales</span>
        </div>
        <div className="panel-stat-card">
          <CircleDollarSign size={24} />
          <strong>${pendingCommissions.toLocaleString("es-CL")}</strong>
          <span>Pendientes de pago</span>
        </div>
      </section>

      <section className="panel-data-section">
        <h2><ContactRound size={20} /> Sus clientes</h2>
        {clients.length === 0 ? (
          <p className="panel-empty">No tiene clientes asignados todavía.</p>
        ) : (
          <table className="panel-table">
            <thead>
              <tr><th>Edificio</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>{c.building_name || "—"}</td>
                  <td><span className={`panel-badge panel-badge--${c.status}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel-data-section">
        <h2><CircleDollarSign size={20} /> Comisiones</h2>
        {commissions.length === 0 ? (
          <p className="panel-empty">No tiene comisiones registradas.</p>
        ) : (
          <table className="panel-table">
            <thead>
              <tr><th>Monto</th><th>Porcentaje</th><th>Estado</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c.id}>
                  <td>${c.amount?.toLocaleString("es-CL") || "—"}</td>
                  <td>{c.percentage ? `${c.percentage}%` : "—"}</td>
                  <td><span className={`panel-badge panel-badge--${c.status}`}>{c.status}</span></td>
                  <td>{c.created_at ? new Date(c.created_at).toLocaleDateString("es-CL") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="panel-notice">
        <ShieldCheck size={18} />
        <span>Las comisiones son legítimas y corresponden únicamente a sus clientes. NUNCA se pagan comisiones a administradores: es ilícito según la normativa vigente.</span>
      </section>
    </>
  );
}
