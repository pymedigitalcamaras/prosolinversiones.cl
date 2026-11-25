import { redirect } from "next/navigation";
import { getPanelSession } from "@/lib/auth/session";
import { panelHome } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

export default async function PanelIndex() {
  const session = await getPanelSession();
  if (!session) redirect("/acceso");
  redirect(panelHome(session.role));
}
