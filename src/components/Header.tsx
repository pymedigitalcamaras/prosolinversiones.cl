"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock3, Mail, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navigation, site, whatsappUrl } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <span><Clock3 size={13} aria-hidden="true" /> {site.hours}</span>
          <div className="utility-right">
            <a href={`mailto:${site.email}`}><Mail size={13} aria-hidden="true" /> {site.email}</a>
            <span className="utility-divider" aria-hidden="true">·</span>
            <span className="utility-badge">Distribuidor Oficial NAE</span>
          </div>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="Prosol Inversiones, inicio">
            <Image src="/images/logo-prosol.png" alt="Prosol Inversiones" width={180} height={58} priority />
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)) ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <a className="button button-small header-cta" href={whatsappUrl()} target="_blank" rel="noreferrer">
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
          </div>
          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`}>
          <nav className="container" aria-label="Navegación móvil">
            {navigation.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={pathname === item.href ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
            <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" /> Conversar por WhatsApp
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
