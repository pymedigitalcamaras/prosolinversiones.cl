import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <section className="not-found"><div className="container"><span>ERROR 404</span><h1>Esta página no existe.</h1><p>La dirección puede haber cambiado o el enlace no es correcto. Puede volver al inicio o revisar el catálogo técnico.</p><Link className="button" href="/"><ArrowLeft size={18} />Volver al inicio</Link></div></section>;
}
