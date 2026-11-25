"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";

type Building = {
  id: string;
  name: string;
  location: string;
  system: string;
  summary: string;
  image: string;
};

export function BuildingManager({ initialBuildings }: { initialBuildings: Building[] }) {
  const [buildings, setBuildings] = useState(initialBuildings);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Building | null>(null);
  const [form, setForm] = useState({ name: "", location: "", system: "", summary: "", image: "/images/instalaciones/azotea.webp" });

  async function fetchBuildings() {
    const r = await fetch("/api/buildings");
    if (r.ok) {
      const data = await r.json() as { buildings: Building[] };
      setBuildings(data.buildings);
    }
  }

  async function save() {
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      const r = await fetch("/api/buildings", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setForm({ name: "", location: "", system: "", summary: "", image: "/images/instalaciones/azotea.webp" });
        setEditing(null);
        await fetchBuildings();
      } else {
        alert("No fue posible guardar el edificio.");
      }
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminar este edificio?")) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/buildings?id=${id}`, { method: "DELETE" });
      if (r.ok) await fetchBuildings();
      else alert("No fue posible eliminar.");
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(b: Building) {
    setEditing(b);
    setForm({ name: b.name, location: b.location, system: b.system, summary: b.summary, image: b.image });
  }

  return (
    <div>
      <div className="panel-form-card">
        <h4><Building2 size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{editing ? "Editar edificio" : "Nuevo edificio"}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input placeholder="Nombre del edificio *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Ubicacion *" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <input placeholder="Sistema instalado *" value={form.system} onChange={e => setForm({ ...form, system: e.target.value })} style={{ gridColumn: "1 / -1" }} />
          <textarea placeholder="Resumen del proyecto *" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} rows={3} style={{ gridColumn: "1 / -1" }} />
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button className="button button-sm" onClick={save} disabled={loading || !form.name || !form.location || !form.system || !form.summary}>
            <Plus size={14} style={{ marginRight: 4 }} />{loading ? "Guardando..." : (editing ? "Actualizar" : "Agregar")}
          </button>
          {editing && (
            <button className="button button-sm button-outline" onClick={() => { setEditing(null); setForm({ name: "", location: "", system: "", summary: "", image: "/images/instalaciones/azotea.webp" }); }}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      {buildings.length === 0 ? (
        <div className="panel-empty">No hay edificios registrados.</div>
      ) : (
        <table className="panel-table">
          <thead>
            <tr><th>Nombre</th><th>Ubicacion</th><th>Sistema</th><th style={{ width: 140 }}>Acciones</th></tr>
          </thead>
          <tbody>
            {buildings.map((b) => (
              <tr key={b.id}>
                <td style={{ fontWeight: 600 }}>{b.name}</td>
                <td>{b.location}</td>
                <td style={{ fontSize: "0.8rem", maxWidth: "260px" }}>{b.system}</td>
                <td>
                  <button className="button button-sm button-outline" onClick={() => startEdit(b)} disabled={loading}><Pencil size={13} /></button>
                  <button className="button button-sm" style={{ marginLeft: "6px", background: "#c0392b" }} onClick={() => remove(b.id)} disabled={loading}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
