"use client";

import Link from "next/link";
import { Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";

type Preferences = { necessary: true; analytics: boolean; marketing: boolean; version: string; savedAt: string };
const STORAGE_KEY = "prosol-f2-cookie-preferences";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try { setVisible(!window.localStorage.getItem(STORAGE_KEY)); }
    catch { setVisible(true); }
  }, []);

  function save(analyticsValue: boolean, marketingValue: boolean) {
    const preferences: Preferences = { necessary: true, analytics: analyticsValue, marketing: marketingValue, version: "f2-demo-2026-10", savedAt: new Date().toISOString() };
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch { /* La navegación sigue disponible aunque el navegador bloquee almacenamiento. */ }
    setVisible(false); setCustomizing(false);
  }

  if (!visible) return null;

  return (
    <aside className="cookie-banner" aria-label="Preferencias de cookies">
      <div className="cookie-main">
        <div className="cookie-icon"><Settings2 size={22} aria-hidden="true" /></div>
        <div><strong>Usted decide qué cookies permitir</strong><p>En esta versión local no se instalan cookies analíticas ni de marketing. Guardamos sus preferencias solo en este navegador. <Link href="/cookies">Más información</Link>.</p></div>
      </div>
      {customizing && <div className="cookie-options">
        <label><input type="checkbox" checked disabled /><span><strong>Necesarias</strong><small>Siempre activas para funciones esenciales.</small></span></label>
        <label><input type="checkbox" checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} /><span><strong>Analíticas</strong><small>Sin herramientas conectadas en F2.</small></span></label>
        <label><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /><span><strong>Marketing</strong><small>Sin herramientas conectadas en F2.</small></span></label>
      </div>}
      <div className="cookie-actions">
        <button className="button button-ghost" onClick={() => save(false, false)}>Solo necesarias</button>
        {customizing ? <button className="button" onClick={() => save(analytics, marketing)}>Guardar preferencias</button> : <button className="button button-outline-dark" onClick={() => setCustomizing(true)}>Configurar</button>}
        <button className="button" onClick={() => save(true, true)}>Aceptar todas</button>
      </div>
      {customizing && <button className="cookie-close" onClick={() => setCustomizing(false)} aria-label="Cerrar configuración"><X size={18} /></button>}
    </aside>
  );
}
