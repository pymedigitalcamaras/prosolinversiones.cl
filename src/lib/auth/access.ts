import { redirect } from "next/navigation";
import { getPanelSession } from "./session";
import type { PanelRole } from "./types";

export async function requirePanelRole(role: PanelRole) {
  const session = await getPanelSession();
  if (!session) redirect("/acceso");
  if (session.role !== role) {
    // Empresa puede acceder a todo
    if (session.role === "empresa") return session;
    redirect("/acceso");
  }
  return session;
}

export async function requireAnyPanelRole() {
  const session = await getPanelSession();
  if (!session) redirect("/acceso");
  return session;
}
