"use client";

import { useState } from "react";
import { Pencil, Trash2, CheckCircle, XCircle, UserCog } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  phone: string | null;
  notes: string | null;
  verification_token: string | null;
};

export function UserManager({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordFor, setShowPasswordFor] = useState<string | null>(null);
  const [approvedPassword, setApprovedPassword] = useState<string | null>(null);

  async function toggleActive(userId: string, current: boolean) {
    setLoading(userId);
    try {
      const response = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, is_active: !current }),
      });
      if (response.ok) {
        const data = await response.json() as { user?: { password?: string } };
        setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: !current } : u)));
        if (!current && data.user?.password) {
          setApprovedPassword(data.user.password);
        }
      }
    } catch {
      alert("No fue posible actualizar el usuario.");
    } finally {
      setLoading(null);
    }
  }

  async function changePassword(userId: string) {
    if (!newPassword || newPassword.length < 4) {
      alert("La clave debe tener al menos 4 caracteres.");
      return;
    }
    setLoading(userId);
    try {
      const response = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, password: newPassword }),
      });
      if (response.ok) {
        alert("Clave actualizada correctamente.");
        setNewPassword("");
        setShowPasswordFor(null);
      } else {
        alert("No fue posible actualizar la clave.");
      }
    } catch {
      alert("Error de conexion.");
    } finally {
      setLoading(null);
    }
  }

  async function changeRole(userId: string, newRole: string) {
    setLoading(userId);
    try {
      const response = await fetch("/api/usuarios", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      if (response.ok) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
      }
    } catch {
      alert("No fue posible cambiar el rol.");
    } finally {
      setLoading(null);
    }
  }

  const pendingUsers = users.filter((u) => !u.is_active);
  const activeUsers = users.filter((u) => u.is_active);

  const roleLabels: Record<string, string> = {
    empresa: "Equipo Prosol",
    administrador: "Administrador de edificio",
    asesor: "Asesor en copropiedad",
  };

  return (
    <div>
      {approvedPassword && (
        <div style={{ background: "#e8f5e9", border: "1px solid #4caf50", borderRadius: "10px", padding: "1.2rem", marginBottom: "1.5rem" }}>
          <strong style={{ color: "#2e7d32" }}><CheckCircle size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />Usuario activado correctamente</strong>
          <p style={{ marginTop: "0.5rem", color: "#1b5e20" }}>La clave temporal generada para este usuario es:</p>
          <code style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1a2a3a", display: "block", marginTop: "0.5rem", padding: "0.6rem", background: "#fff", borderRadius: "6px", letterSpacing: "0.1em" }}>
            {approvedPassword}
          </code>
          <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#555" }}>Comuniquela al usuario por WhatsApp o correo. El usuario puede cambiarla despues.</p>
          <button className="button button-sm" onClick={() => setApprovedPassword(null)} style={{ marginTop: "0.6rem" }}>Cerrar</button>
        </div>
      )}

      {pendingUsers.length > 0 && (
        <>
          <h3 style={{ marginTop: "1.5rem", color: "#92311f", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            <XCircle size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />Solicitudes pendientes ({pendingUsers.length})
          </h3>
          <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "0.8rem" }}>
            Revise los datos y active las cuentas aprobadas. Se generara una clave temporal automaticamente.
          </p>
          <table className="panel-table">
            <thead>
              <tr><th>Nombre</th><th>Correo</th><th>Perfil</th><th>Telefono</th><th>Notas</th><th>Accion</th></tr>
            </thead>
            <tbody>
              {pendingUsers.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{roleLabels[u.role] || u.role}</td>
                  <td>{u.phone || "—"}</td>
                  <td>{u.notes || "—"}</td>
                  <td>
                    <button className="button button-sm" onClick={() => toggleActive(u.id, u.is_active)} disabled={loading === u.id}>
                      {loading === u.id ? "..." : "Aprobar y activar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3 style={{ marginTop: "2rem", fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        <UserCog size={16} style={{ marginRight: 6, verticalAlign: "middle" }} />Usuarios activos ({activeUsers.length})
      </h3>
      <table className="panel-table">
        <thead>
          <tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {activeUsers.map((u) => (
            <tr key={u.id}>
              <td style={{ fontWeight: 500 }}>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} disabled={loading === u.id || u.email === "pymedigitalcamaras@gmail.com"} style={{ fontSize: "0.8rem", padding: "0.25rem 0.5rem", borderRadius: "6px", border: "1px solid #d1d5db" }}>
                  <option value="empresa">Equipo Prosol</option>
                  <option value="administrador">Administrador de edificio</option>
                  <option value="asesor">Asesor en copropiedad</option>
                </select>
              </td>
              <td><span className="panel-badge panel-badge--activo">Activo</span></td>
              <td>
                {showPasswordFor === u.id ? (
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <input type="text" placeholder="Nueva clave" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{ fontSize: "0.75rem", padding: "0.3rem 0.5rem", width: "110px", borderRadius: "6px", border: "1px solid #d1d5db" }} />
                    <button className="button button-sm" onClick={() => changePassword(u.id)} disabled={loading === u.id}>Guardar</button>
                    <button className="button button-sm button-outline" onClick={() => { setShowPasswordFor(null); setNewPassword(""); }}>Cancelar</button>
                  </div>
                ) : (
                  <>
                    <button className="button button-sm button-outline" onClick={() => setShowPasswordFor(u.id)} disabled={loading === u.id}><Pencil size={12} /></button>
                    {u.email !== "pymedigitalcamaras@gmail.com" && (
                      <button className="button button-sm" style={{ marginLeft: "6px", background: "#c0392b" }} onClick={() => { if (confirm(`Desactivar a ${u.name}?`)) toggleActive(u.id, u.is_active); }} disabled={loading === u.id}><Trash2 size={12} /></button>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
