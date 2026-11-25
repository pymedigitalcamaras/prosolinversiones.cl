"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, MessageSquare } from "lucide-react";

type Testimonial = {
  id: string;
  quote: string;
  role: string;
};

export function TestimonialManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [items, setItems] = useState(initialTestimonials);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ quote: "", role: "Administrador" });

  async function fetchItems() {
    const r = await fetch("/api/testimonials");
    if (r.ok) {
      const data = await r.json() as { testimonials: Testimonial[] };
      setItems(data.testimonials);
    }
  }

  async function save() {
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      const r = await fetch("/api/testimonials", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setForm({ quote: "", role: "Administrador" });
        setEditing(null);
        await fetchItems();
      } else {
        alert("No fue posible guardar el testimonio.");
      }
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminar este testimonio?")) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
      if (r.ok) await fetchItems();
      else alert("No fue posible eliminar.");
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(t: Testimonial) {
    setEditing(t);
    setForm({ quote: t.quote, role: t.role });
  }

  const roles = ["Administrador", "Presidente del Comite", "Asesor en Copropiedad", "Mayordomo", "Conserje"];

  return (
    <div>
      <div className="panel-form-card">
        <h4><MessageSquare size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{editing ? "Editar testimonio" : "Nuevo testimonio"}</h4>
        <div style={{ display: "grid", gap: "12px" }}>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <textarea placeholder="Texto del testimonio *" value={form.quote} onChange={e => setForm({ ...form, quote: e.target.value })} rows={4} />
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button className="button button-sm" onClick={save} disabled={loading || !form.quote}>
            <Plus size={14} style={{ marginRight: 4 }} />{loading ? "Guardando..." : (editing ? "Actualizar" : "Agregar")}
          </button>
          {editing && (
            <button className="button button-sm button-outline" onClick={() => { setEditing(null); setForm({ quote: "", role: "Administrador" }); }}>Cancelar</button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="panel-empty">No hay testimonios registrados.</div>
      ) : (
        <table className="panel-table">
          <thead>
            <tr><th>Rol</th><th>Testimonio</th><th style={{ width: 100 }}>Acciones</th></tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td style={{ whiteSpace: "nowrap", fontWeight: 500 }}>{t.role}</td>
                <td style={{ fontSize: "0.82rem", maxWidth: "500px" }}>{t.quote.slice(0, 140)}{t.quote.length > 140 ? "..." : ""}</td>
                <td>
                  <button className="button button-sm button-outline" onClick={() => startEdit(t)} disabled={loading}><Pencil size={13} /></button>
                  <button className="button button-sm" style={{ marginLeft: "6px", background: "#c0392b" }} onClick={() => remove(t.id)} disabled={loading}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
