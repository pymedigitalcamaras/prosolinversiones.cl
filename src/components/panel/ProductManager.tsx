"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";

type Product = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  model: string;
  category: string;
  description: string;
  application: string;
  image: string;
  is_active: boolean;
  sort_order: number;
};

const categories = [
  { id: "acs-horizontal", name: "ACS horizontal" },
  { id: "acs-vertical", name: "ACS vertical" },
  { id: "piscina", name: "Piscinas" },
  { id: "climatizacion", name: "All-in-one" },
  { id: "acumulacion", name: "Acumulacion" },
];

export function ProductManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({
    slug: "", name: "", short_name: "", model: "", category: "acs-horizontal",
    description: "", application: "", image: "", sort_order: 0,
  });

  async function fetchProducts() {
    const r = await fetch("/api/products");
    if (r.ok) {
      const data = await r.json() as { products: Product[] };
      setProducts(data.products);
    }
  }

  async function save() {
    setLoading(true);
    try {
      const method = editing ? "PUT" : "POST";
      const body = editing ? { ...form, id: editing.id } : form;
      const r = await fetch("/api/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (r.ok) {
        setForm({ slug: "", name: "", short_name: "", model: "", category: "acs-horizontal", description: "", application: "", image: "", sort_order: 0 });
        setEditing(null);
        await fetchProducts();
      } else {
        alert("No fue posible guardar el producto.");
      }
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Eliminar este producto?")) return;
    setLoading(true);
    try {
      const r = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (r.ok) await fetchProducts();
      else alert("No fue posible eliminar.");
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(false);
    }
  }

  function startEdit(p: Product) {
    setEditing(p);
    setForm({
      slug: p.slug, name: p.name, short_name: p.short_name, model: p.model,
      category: p.category, description: p.description, application: p.application,
      image: p.image, sort_order: p.sort_order,
    });
  }

  return (
    <div>
      <div className="panel-form-card">
        <h4><Package size={16} style={{ marginRight: 8, verticalAlign: "middle" }} />{editing ? "Editar producto" : "Nuevo producto"}</h4>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <input placeholder="Slug (URL) *" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          <input placeholder="Nombre *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Nombre corto" value={form.short_name} onChange={e => setForm({ ...form, short_name: e.target.value })} />
          <input placeholder="Modelo *" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Orden" type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })} />
          <input placeholder="Imagen (ruta) *" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} style={{ gridColumn: "1 / -1" }} />
          <textarea placeholder="Descripcion *" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ gridColumn: "1 / -1" }} />
          <textarea placeholder="Aplicacion" value={form.application} onChange={e => setForm({ ...form, application: e.target.value })} rows={2} style={{ gridColumn: "1 / -1" }} />
        </div>
        <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
          <button className="button button-sm" onClick={save} disabled={loading || !form.slug || !form.name || !form.model || !form.image || !form.description}>
            <Plus size={14} style={{ marginRight: 4 }} />{loading ? "Guardando..." : (editing ? "Actualizar" : "Agregar")}
          </button>
          {editing && (
            <button className="button button-sm button-outline" onClick={() => { setEditing(null); setForm({ slug: "", name: "", short_name: "", model: "", category: "acs-horizontal", description: "", application: "", image: "", sort_order: 0 }); }}>Cancelar</button>
          )}
        </div>
      </div>

      {products.length === 0 ? (
        <div className="panel-empty">No hay productos registrados.</div>
      ) : (
        <table className="panel-table">
          <thead>
            <tr><th style={{ width: 60 }}>Orden</th><th>Nombre</th><th>Modelo</th><th>Categoria</th><th style={{ width: 100 }}>Acciones</th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.sort_order}</td>
                <td>{p.name}</td>
                <td>{p.model}</td>
                <td>{categories.find(c => c.id === p.category)?.name || p.category}</td>
                <td>
                  <button className="button button-sm button-outline" onClick={() => startEdit(p)} disabled={loading}><Pencil size={13} /></button>
                  <button className="button button-sm" style={{ marginLeft: "6px", background: "#c0392b" }} onClick={() => remove(p.id)} disabled={loading}><Trash2 size={13} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
