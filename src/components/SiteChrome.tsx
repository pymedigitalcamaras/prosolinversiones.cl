"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieBanner } from "@/components/CookieBanner";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const privateArea = pathname === "/acceso" || pathname.startsWith("/panel");

  if (privateArea) return <main id="contenido">{children}</main>;
  return (
    <>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <CookieBanner />
    </>
  );
}
