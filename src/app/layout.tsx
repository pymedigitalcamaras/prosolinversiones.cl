import type { Metadata, Viewport } from "next";
import { SiteChrome } from "@/components/SiteChrome";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Bombas de Calor Termodinámicas NAE | ACS Edificios | Prosol Chile", template: "%s | Prosol Inversiones" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: "/" },
  keywords: ["bomba de calor", "bomba de calor termodinámica", "bomba de calor 3ra generación", "bomba de calor ACS", "bomba de calor edificio", "bomba de calor copropiedad", "bomba de calor NAE", "agua caliente sanitaria", "eficiencia energética edificios", "estanques inoxidables"],
  openGraph: { type: "website", locale: "es_CL", siteName: site.name, title: "Bombas de Calor Termodinámicas NAE | Prosol Inversiones", description: site.description, images: [{ url: "/images/slider/slider-5.webp", width: 2200, height: 933, alt: "Bombas de calor NAE instaladas en edificio" }] },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#1F2A44" };

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${site.url}/#organizacion`,
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/images/logo-prosol.png`,
  description: site.description,
  email: site.email,
  areaServed: { "@type": "Country", name: "Chile" },
  contactPoint: { "@type": "ContactPoint", contactType: "Ventas", telephone: site.phoneDisplay, email: site.email, availableLanguage: "Spanish", areaServed: "CL" },
  sameAs: [],
  knowsAbout: ["Bombas de calor termodinámicas", "Agua caliente sanitaria ACS", "Eficiencia energética en edificios", "Copropiedades y comunidades"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL">
      <body>
        <SiteChrome>{children}</SiteChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
