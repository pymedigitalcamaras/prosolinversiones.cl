"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, LayoutDashboard, Building2, MessageSquare, ChevronRight } from "lucide-react";

type PanelSession = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export function PanelShell({ children, session }: { children: React.ReactNode; session?: PanelSession }) {
  const pathname = usePathname();

  async function handleLogout() {
    try {
      const r = await fetch("/api/auth/logout", { method: "POST" });
      if (r.ok) {
        const data = await r.json() as { redirectTo?: string };
        window.location.href = data.redirectTo || "/acceso";
      } else {
        window.location.href = "/acceso";
      }
    } catch {
      window.location.href = "/acceso";
    }
  }

  const navItems = [
    { href: "/panel/empresa", label: "Empresa", icon: LayoutDashboard },
    { href: "/panel/administrador", label: "Administrador", icon: Building2 },
    { href: "/panel/asesor", label: "Asesor", icon: MessageSquare },
  ];

  return (
    <div className="panel-shell">
      <aside className="panel-sidebar" aria-label="Navegacion del panel">
        <div className="panel-brand">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img src="/images/logo-prosol.png" alt="Prosol" style={{ height: 32 }} />
            <span style={{ color: "var(--white)", fontWeight: 700, fontSize: "0.95rem" }}>Panel</span>
          </Link>
        </div>

        <nav className="panel-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 500,
                  color: isActive ? "var(--orange)" : "#a8b4c7",
                  background: isActive ? "rgba(255,165,0,.12)" : "transparent",
                  transition: "all .15s",
                }}
              >
                <Icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} style={{ marginLeft: "auto" }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button className="panel-logout" onClick={handleLogout}>
            <LogOut size={14} /> Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="panel-workspace">
        {children}
      </main>
    </div>
  );
}
