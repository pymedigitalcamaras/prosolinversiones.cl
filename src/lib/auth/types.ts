export type PanelRole = "empresa" | "administrador" | "asesor";

export type PanelSession = {
  id: string;
  name: string;
  email: string;
  role: PanelRole;
  expiresAt: number;
};

export const panelHome = (role: PanelRole) => {
  if (role === "empresa") return "/panel/empresa";
  if (role === "administrador") return "/panel/administrador";
  return "/panel/asesor";
};

export const roleLabel = (role: PanelRole) => {
  if (role === "empresa") return "EMPRESA · triage de prueba";
  if (role === "administrador") return "ADMINISTRADOR · perfil de prueba";
  return "ASESOR · perfil de prueba";
};
