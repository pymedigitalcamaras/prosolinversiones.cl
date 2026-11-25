"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await response.json()) as { redirectTo?: string; message?: string };
      if (!response.ok || !data.redirectTo) {
        setError(data.message ?? "Correo o clave incorrectos.");
        return;
      }
      window.location.assign(data.redirectTo);
    } catch {
      setError("No fue posible contactar el servicio. Intente nuevamente.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="access-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="login-email">Correo electronico</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="su@correo.cl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          maxLength={254}
        />
      </div>
      <div className="field" style={{ position: "relative" }}>
        <label htmlFor="login-password">Clave de acceso</label>
        <input
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Su clave"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          maxLength={200}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "12px",
            top: "38px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#666",
            padding: "4px",
          }}
          title={showPassword ? "Ocultar clave" : "Mostrar clave"}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="access-error" role="alert">
          {error}
        </p>
      )}
      <button className="button access-submit" type="submit" disabled={pending}>
        {pending ? "Verificando…" : "Entrar al panel"}
      </button>
      <p className="access-help">
        No tiene cuenta? <a href="/registro">Solicite acceso aqui</a>. Si olvido su clave, contacte al administrador.
      </p>
    </form>
  );
}
