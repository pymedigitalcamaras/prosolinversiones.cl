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
          <span><Clock3 size={14} aria-hidden="true" /> {site.hours}</span>
          <a href={`mailto:${site.email}`}><Mail size={14} aria-hidden="true" /> {site.email}</a>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="brand" aria-label="Prosol Inversiones, inicio">
            <Image src="/images/logo-prosol.png" alt="Prosol Inversiones" width={190} height={61} priority />
          </Link>
          <nav className="desktop-nav" aria-label="Navegación principal">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={pathname.startsWith(item.href) ? "active" : ""}>{item.label}</Link>
            ))}
          </nav>
          <a className="button button-small header-cta" href={whatsappUrl()} target="_blank" rel="noreferrer">
            <MessageCircle size={17} aria-hidden="true" /> WhatsApp
          </a>
          <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Cerrar menú" : "Abrir menú"} onClick={() => setOpen(!open)}>
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
        <div id="mobile-menu" className={`mobile-menu ${open ? "open" : ""}`}>
          <nav className="container" aria-label="Navegación móvil">
            {navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
            <a className="button" href={whatsappUrl()} target="_blank" rel="noreferrer">Conversar por WhatsApp</a>
          </nav>
        </div>
      </header>
    </>
  );
}
