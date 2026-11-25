import { supabaseAdmin } from "@/lib/supabase";
import type { PanelRole } from "./types";

export type PanelUser = {
  id: string;
  name: string;
  email: string;
  role: PanelRole;
  is_active: boolean;
  password_hash: string | null;
};

export async function findUserByEmail(email: string): Promise<PanelUser | null> {
  const { data, error } = await supabaseAdmin
    .from("panel_users")
    .select("id, name, email, role, is_active, password_hash")
    .eq("email", email.trim().toLowerCase())
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data as PanelUser;
}

export async function getAllUsers(): Promise<PanelUser[]> {
  const { data, error } = await supabaseAdmin
    .from("panel_users")
    .select("id, name, email, role, is_active, password_hash")
    .order("name");

  if (error) return [];
  return (data || []) as PanelUser[];
}
