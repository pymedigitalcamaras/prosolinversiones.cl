import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export function WhatsAppFloat() {
  return <a className="whatsapp-float" href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Conversar con Prosol por WhatsApp"><MessageCircle size={25} aria-hidden="true" /><span>WhatsApp</span></a>;
}
