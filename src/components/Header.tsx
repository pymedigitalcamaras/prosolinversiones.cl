"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, User, Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const pathname = usePathname();
  const phoneNumber = "+56 9 9011 7784";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <header className="nae-navbar">
        <div className="container nae-navbar-inner">
          {/* Logo & Main Nav */}
          <div className="nae-nav-left">
            <Link href="/" className="brand" aria-label="Prosol Inversiones, inicio">
              <Image src="/images/logo-prosol.png" alt="Prosol Inversiones" width={160} height={52} priority />
            </Link>

            <nav className="nae-desktop-menu" aria-label="Navegación principal">
              <Link href="/catalogo" className={pathname.startsWith("/catalogo") ? "active" : ""}>Catálogo Bombas</Link>
              <Link href="/experiencia" className={pathname.startsWith("/experiencia") ? "active" : ""}>Ventajas & Experiencia</Link>
              <Link href="/centro-tecnico" className={pathname.startsWith("/centro-tecnico") ? "active" : ""}>Centro Técnico</Link>
              <Link href="/nosotros" className={pathname.startsWith("/nosotros") ? "active" : ""}>Nosotros</Link>
              <Link href="/contacto" className={pathname.startsWith("/contacto") ? "active" : ""}>Contacto</Link>
            </nav>
          </div>

          {/* Right Header Controls (Exact NAE replica) */}
          <div className="nae-nav-right">
            {/* Green Online Dot */}
            <div className="nae-online-pill">
              <span className="nae-ping-dot">
                <span className="nae-ping-animate"></span>
                <span className="nae-ping-static"></span>
              </span>
              <span>Estamos en línea</span>
            </div>

            {/* Printed Phone (Non-clickable pill) */}
            <div className="nae-phone-pill" title="Teléfono de contacto">
              {phoneNumber}
            </div>

            {/* Language Selector */}
            <div className="nae-lang-wrap">
              <button 
                type="button" 
                className="nae-lang-btn" 
                onClick={() => setLangOpen(!langOpen)}
                aria-expanded={langOpen}
                aria-label="Seleccionar idioma"
              >
                <Globe size={14} />
                <span>ES</span>
                <ChevronDown size={12} />
              </button>
              {langOpen && (
                <div className="nae-lang-dropdown">
                  <div className="nae-lang-active">Español</div>
                  <div className="nae-lang-disabled">English <span className="nae-soon-badge">Pronto</span></div>
                  <div className="nae-lang-disabled">Português <span className="nae-soon-badge">Pronto</span></div>
                </div>
              )}
            </div>

            {/* Ingresar */}
            <Link href="/acceso" className="nae-login-link">
              <User size={15} />
              <span>Ingresar</span>
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="nae-mobile-actions">
            <span className="nae-phone-pill-mobile">{phoneNumber}</span>
            <Link href="/acceso" className="nae-login-btn-mobile" title="Ingresar">
              <User size={16} />
            </Link>
            <button 
              className="menu-toggle" 
              type="button" 
              aria-expanded={open} 
              aria-controls="mobile-menu" 
              aria-label={open ? "Cerrar menú" : "Abrir menú"} 
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div id="mobile-menu" className="nae-mobile-dropdown">
            <nav className="container">
              <Link href="/catalogo">Catálogo Bombas de Calor</Link>
              <Link href="/experiencia">Ventajas & Experiencia</Link>
              <Link href="/centro-tecnico">Centro Técnico</Link>
              <Link href="/nosotros">Nosotros</Link>
              <Link href="/contacto">Formulario de Contacto</Link>
              <div className="nae-mobile-phone-section">
                <span>Celular de contacto directo:</span>
                <strong>{phoneNumber}</strong>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
