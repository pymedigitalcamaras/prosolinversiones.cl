"use client";

import { FormEvent, useState } from "react";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("asesor");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess(false);
    setToken("");
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, role, message }),
      });
      const data = (await response.json()) as { message?: string; token?: string };
      if (!response.ok) {
        setError(data.message ?? "No fue posible enviar la solicitud.");
        return;
      }
      setSuccess(true);
      if (data.token) setToken(data.token);
    } catch {
      setError("No fue posible contactar el servicio. Intente nuevamente.");
    } finally {
      setPending(false);
    }
  }

  if (success) {
    return (
      <div className="form-result form-result--success" role="alert" style={{ display: "block" }}>
        <strong>Solicitud enviada correctamente</strong>
        <p style={{ marginTop: "0.5rem" }}>
          Su solicitud fue registrada. Un administrador la evaluara y le contactara
          por correo cuando su cuenta sea activada.
        </p>
        {token && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#fff", borderRadius: "6px", border: "1px dashed #999" }}>
            <p style={{ fontSize: "0.85rem", color: "#555", marginBottom: "0.5rem" }}>
              Guarde este codigo de verificacion. Se lo pediran para confirmar su identidad:
            </p>
            <code style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#1a2a3a", wordBreak: "break-all" }}>
              {token}
            </code>
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="access-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="reg-name">Nombre completo <span>*</span></label>
        <input
          id="reg-name"
          name="name"
          type="text"
          placeholder="Juan Perez"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
        />
      </div>
      <div className="field">
        <label htmlFor="reg-email">Correo electronico <span>*</span></label>
        <input
          id="reg-email"
          name="email"
          type="email"
          placeholder="juan@correo.cl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
        />
      </div>
      <div className="field">
        <label htmlFor="reg-phone">Telefono</label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          placeholder="+56 9 ..."
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          maxLength={24}
        />
      </div>
      <div className="field">
        <label htmlFor="reg-role">Perfil solicitado <span>*</span></label>
        <select id="reg-role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="asesor">Asesor en copropiedad</option>
          <option value="administrador">Administrador de edificio</option>
          <option value="empresa">Equipo Prosol</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="reg-message">Mensaje o referencia</label>
        <textarea
          id="reg-message"
          name="message"
          rows={3}
          placeholder="Indique que edificio asesora o su relacion con Prosol"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
        />
      </div>
      {error && <p className="access-error" role="alert">{error}</p>}
      <button className="button access-submit" type="submit" disabled={pending}>
        {pending ? "Enviando…" : "Solicitar acceso"}
      </button>
    </form>
  );
}
