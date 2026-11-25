"use client";

import { useState } from "react";
import { UserPlus, Users, AlertTriangle } from "lucide-react";

type Contact = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  profile: string | null;
  status: string;
  responsible_id: string | null;
};

type Seller = {
  id: string;
  name: string;
};

export function ContactAssigner({ initialContacts, sellers }: { initialContacts: Contact[]; sellers: Seller[] }) {
  const [contacts, setContacts] = useState(initialContacts);
  const [loading, setLoading] = useState<string | null>(null);

  async function assign(contactId: string, sellerId: string) {
    if (!sellerId) return;
    setLoading(contactId);
    try {
      const response = await fetch("/api/crm/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: contactId, responsible_id: sellerId, status: "en_gestion" }),
      });
      if (response.ok) {
        setContacts(contacts.map((c) => (c.id === contactId ? { ...c, responsible_id: sellerId, status: "en_gestion" } : c)));
      }
    } catch {
      alert("No fue posible asignar el contacto.");
    } finally {
      setLoading(null);
    }
  }

  const unassigned = contacts.filter((c) => !c.responsible_id);
  const assigned = contacts.filter((c) => c.responsible_id);

  return (
    <div>
      {unassigned.length > 0 && (
        <div style={{ background: "#fff3e0", border: "1px solid #ffb74d", borderRadius: "10px", padding: "0.8rem 1.2rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertTriangle size={18} color="#e65100" />
          <span style={{ color: "#e65100", fontWeight: 600, fontSize: "0.9rem" }}>{unassigned.length} contacto{unassigned.length > 1 ? "s" : ""} sin asignar</span>
        </div>
      )}

      <h3 style={{ marginTop: "1rem", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        <UserPlus size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />Sin asignar ({unassigned.length})
      </h3>
      {unassigned.length === 0 ? (
        <div className="panel-empty">Todos los contactos estan asignados.</div>
      ) : (
        <table className="panel-table">
          <thead>
            <tr><th>Nombre</th><th>Correo</th><th>Perfil</th><th style={{ width: 200 }}>Asignar a</th></tr>
          </thead>
          <tbody>
            {unassigned.map((c) => (
              <tr key={c.id}>
                <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                <td>{c.email || "—"}</td>
                <td>{c.profile || "—"}</td>
                <td>
                  <select value="" onChange={(e) => assign(c.id, e.target.value)} disabled={loading === c.id} style={{ fontSize: "0.8rem", padding: "0.4rem 0.6rem", borderRadius: "6px", border: "1px solid #d1d5db", width: "100%" }}>
                    <option value="">Seleccione vendedor…</option>
                    {sellers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3 style={{ marginTop: "2rem", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        <Users size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />Asignados ({assigned.length})
      </h3>
      {assigned.length === 0 ? (
        <div className="panel-empty">No hay contactos asignados.</div>
      ) : (
        <table className="panel-table">
          <thead>
            <tr><th>Nombre</th><th>Correo</th><th>Perfil</th><th>Estado</th><th>Asignado a</th></tr>
          </thead>
          <tbody>
            {assigned.map((c) => {
              const seller = sellers.find((s) => s.id === c.responsible_id);
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.full_name}</td>
                  <td>{c.email || "—"}</td>
                  <td>{c.profile || "—"}</td>
                  <td><span className={`panel-badge panel-badge--${c.status}`}>{c.status}</span></td>
                  <td style={{ fontWeight: 500 }}>{seller?.name || c.responsible_id}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
