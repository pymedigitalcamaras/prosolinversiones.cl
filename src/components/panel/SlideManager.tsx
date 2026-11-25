"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";

type Slide = {
  id: string;
  image: string;
  alt: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
  action: string;
  sort_order: number;
};

export function SlideManager({ initialSlides }: { initialSlides: Slide[] }) {
  const [slides, setSlides] = useState(initialSlides);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState({
    image: "", alt: "", eyebrow: "", title: "", text: "", href: "", action: "", sort_order: 0
  });

  async function fetchSlides() {
    const r = await fetch("/api/slides");
    if (r.ok) {
      const data = await r.json() as { slides: Slide[] };
      setSlides(data.slides);
    }
  }

  async function save() {
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      const r = await fetch("/api/slides", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setForm({ image: "", alt: "", eyebrow: "", title: "", text: "", href: "", action: "", sort_order: 0 });
        setEditing(null);
        await fetchSlides();
      } else {
        alert("No fue posible guardar el slide.");
      }
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminar este slide?")) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/slides?id=${id}`, { method: "DELETE" });
      if (r.ok) await fetchSlides();
      else alert("No fue posible eliminar.");
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(s: Slide) {
    setEditing(s);
    setForm({
      image: s.image, alt: s.alt, eyebrow: s.eyebrow,
      title: s.title, text: s.text, href: s.href,
      action: s.action, sort_order: s.sort_order,
    });
  }

  return (
    <div>
      <div className="panel-form-card">
        <h4><ImageIcon size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{editing ? "Editar slide" : "Nuevo slide"}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input placeholder="Imagen (ruta) *" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
          <input placeholder="Orden" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <input placeholder="Eyebrow (subtitulo)" value={form.eyebrow} onChange={e => setForm({ ...form, eyebrow: e.target.value })} style={{ gridColumn: "1 / -1" }} />
          <input placeholder="Titulo *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ gridColumn: "1 / -1" }} />
          <textarea placeholder="Texto *" value={form.text} onChange={e => setForm({ ...form, text: e.target.value })} rows={2} style={{ gridColumn: "1 / -1" }} />
          <input placeholder="Link (href) *" value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} />
          <input placeholder="Texto del boton *" value={form.action} onChange={e => setForm({ ...form, action: e.target.value })} />
          <input placeholder="Texto alt (accesibilidad)" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })} style={{ gridColumn: "1 / -1" }} />
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button className="button button-sm" onClick={save} disabled={loading || !form.image || !form.title || !form.text || !form.href || !form.action}>
            <Plus size={14} style={{ marginRight: 4 }} />{loading ? "Guardando..." : (editing ? "Actualizar" : "Agregar")}
          </button>
          {editing && (
            <button className="button button-sm button-outline" onClick={() => { setEditing(null); setForm({ image: "", alt: "", eyebrow: "", title: "", text: "", href: "", action: "", sort_order: 0 }); }}>Cancelar</button>
          )}
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="panel-empty">No hay slides registrados.</div>
      ) : (
        <table className="panel-table">
          <thead>
            <tr><th style={{ width: 60 }}>Orden</th><th>Titulo</th><th>Eyebrow</th><th style={{ width: 100 }}>Acciones</th></tr>
          </thead>
          <tbody>
            {slides.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.sort_order}</td>
                <td>{s.title}</td>
                <td style={{ fontSize: "0.8rem" }}>{s.eyebrow}</td>
                <td>
                  <button className="button button-sm button-outline" onClick={() => startEdit(s)} disabled={loading}><Pencil size={13} /></button>
                  <button className="button button-sm" style={{ marginLeft: "6px", background: "#c0392b" }} onClick={() => remove(s.id)} disabled={loading}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
