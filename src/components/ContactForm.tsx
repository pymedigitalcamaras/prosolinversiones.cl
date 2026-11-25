"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle, LoaderCircle, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { site, whatsappUrl } from "@/lib/site";

type Errors = Record<string, string>;
type Result = { message: string; errors?: Errors; success?: boolean } | null;

export function ContactForm({ mode = "contacto", initialProfile = "administrador", origin = "/contacto" }: { mode?: "contacto" | "arsop"; initialProfile?: string; origin?: string }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sent) return;
    setPending(true); setResult(null); setErrors({});
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/contacto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) {
        setErrors(data.errors ?? {});
        setResult({ message: data.message ?? "No fue posible procesar la solicitud." });
      } else {
        setResult({ message: data.message ?? "Solicitud recibida correctamente.", success: true });
        setSent(true);
      }
    } catch {
      setResult({ message: "No hay conexión con el servicio. Intente por WhatsApp o correo." });
    } finally { setPending(false); }
  }

  const errorFor = (name: string) => errors[name] ? <span className="field-error" id={`${name}-error`}><AlertCircle size={14} />{errors[name]}</span> : null;
  const describedBy = (name: string) => errors[name] ? `${name}-error` : undefined;

  return (
    <form className="contact-form" onSubmit={submit} noValidate>
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="origin" value={origin} />
      <input type="hidden" name="consentVersion" value="f2-demo-2026-10" />
      <div className="honeypot" aria-hidden="true"><label>No complete este campo<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {result && (
        <div className={`form-result ${result.success ? "form-result--success" : ""}`} role="alert">
          {result.success ? <CheckCircle size={21} /> : <AlertCircle size={21} />}
          <div><strong>{result.success ? "Solicitud enviada" : "Solicitud no enviada"}</strong><p>{result.message}</p></div>
        </div>
      )}
      <div className="form-grid">
        <div className="field"><label htmlFor={`${mode}-name`}>Nombre y apellido <span>*</span></label><input id={`${mode}-name`} name="name" autoComplete="name" maxLength={100} aria-invalid={!!errors.name} aria-describedby={describedBy("name")} required disabled={sent} />{errorFor("name")}</div>
        <div className="field"><label htmlFor={`${mode}-email`}>Correo electrónico <span>*</span></label><input id={`${mode}-email`} name="email" type="email" autoComplete="email" maxLength={160} aria-invalid={!!errors.email} aria-describedby={describedBy("email")} required disabled={sent} />{errorFor("email")}</div>
        {mode === "contacto" ? <>
          <div className="field"><label htmlFor="phone">Teléfono <span>*</span></label><input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+56 9 …" maxLength={24} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} required disabled={sent} />{errorFor("phone")}</div>
          <div className="field"><label htmlFor="profile">Su perfil <span>*</span></label><select id="profile" name="profile" defaultValue={initialProfile} disabled={sent}><option value="administrador">Administrador de edificio</option><option value="comite">Presidente o integrante de comité</option><option value="asesor">Asesor en copropiedad</option><option value="otro">Otro perfil</option></select></div>
          <div className="field field-full"><label htmlFor="building">Edificio o comunidad <span className="optional">(opcional)</span></label><input id="building" name="building" maxLength={140} placeholder="No incluya direcciones ni datos personales de terceros" disabled={sent} /></div>
          <div className="field field-full"><label htmlFor="message">¿Qué necesita evaluar? <span>*</span></label><textarea id="message" name="message" rows={5} maxLength={1600} aria-invalid={!!errors.message} aria-describedby={describedBy("message")} placeholder="Cuéntenos brevemente sobre el sistema actual y su necesidad." required disabled={sent} />{errorFor("message")}</div>
        </> : <>
          <div className="field"><label htmlFor="right">Derecho que desea ejercer <span>*</span></label><select id="right" name="right" disabled={sent}><option value="acceso">Acceso</option><option value="rectificacion">Rectificación</option><option value="supresion">Supresión</option><option value="oposicion">Oposición</option><option value="portabilidad">Portabilidad</option></select></div>
          <div className="field field-full"><label htmlFor="arsop-message">Detalle de su solicitud <span>*</span></label><textarea id="arsop-message" name="message" rows={6} maxLength={1600} aria-invalid={!!errors.message} aria-describedby={describedBy("message")} required disabled={sent} />{errorFor("message")}</div>
        </>}
      </div>
      <div className="consent-field">
        <label><input type="checkbox" name="consent" value="accepted" required aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} disabled={sent} /><span>{mode === "contacto" ? "Acepto que Prosol Inversiones SpA utilice los datos entregados para responder esta solicitud y realizar seguimiento comercial, según el " : "Acepto el uso de mis datos para gestionar y responder esta solicitud de derechos, según el "}<Link href="/privacidad">aviso de privacidad</Link>. <b>*</b></span></label>
        {errorFor("consent")}
      </div>
      <div className="form-actions">
        <button className="button" type="submit" disabled={pending || sent}>{pending ? <LoaderCircle className="spin" size={18} /> : sent ? <CheckCircle size={18} /> : <ArrowRight size={18} />}{pending ? "Enviando…" : sent ? "Enviado correctamente" : mode === "contacto" ? "Enviar solicitud" : "Enviar solicitud ARSOP"}</button>
        {sent && <p style={{ color: "var(--success)", fontSize: "0.9rem", marginTop: "0.5rem" }}>Su solicitud fue guardada en nuestro sistema. Nos contactaremos dentro de 24 horas hábiles.</p>}
      </div>
      <div className="form-alternative"><span>¿Prefiere contacto directo?</span><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={17} />{site.phoneDisplay}</a></div>
    </form>
  );
}
