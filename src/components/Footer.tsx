import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle } from "lucide-react";
import { site, whatsappUrl } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="footer-logo"><Image src="/images/logo-prosol.png" alt="Prosol Inversiones" width={184} height={59} /></div>
          <p>Ingeniería y equipamiento para agua caliente y eficiencia energética en edificios.</p>
          <div className="nae-mark"><span>Equipamiento</span><Image src="/images/logo-nae-final.png" alt="NAE" width={82} height={32} /></div>
        </div>
        <div>
          <h2>Explorar</h2>
          <ul className="footer-links">
            <li><Link href="/catalogo">Catálogo técnico</Link></li>
            <li><Link href="/experiencia">Experiencia</Link></li>
            <li><Link href="/nosotros">Por qué Prosol</Link></li>
            <li><Link href="/centro-tecnico">Centro técnico</Link></li>
            <li><Link href="/contacto?perfil=asesor">Canal de asesores</Link></li>
          </ul>
        </div>
        <div>
          <h2>Contacto</h2>
          <ul className="footer-contact">
            <li><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle size={17} />{site.phoneDisplay}<ArrowUpRight size={14} /></a></li>
            <li><a href={`mailto:${site.email}`}><Mail size={17} />{site.email}</a></li>
            <li><span><Clock3 size={17} />{site.hours}<small>{site.responseTime}</small></span></li>
            <li><span><MapPin size={17} />{site.coverage}</span></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.legalName}</span>
        <nav aria-label="Enlaces legales">
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/derechos-arsop">Derechos ARSOP</Link>
          <Link href="/acceso">Acceso equipo</Link>
        </nav>
        <span className="demo-label">Versión local F3-A · formularios públicos sin persistencia</span>
      </div>
    </footer>
  );
}
