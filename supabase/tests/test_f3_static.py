#!/usr/bin/env python3
"""Comprobaciones estáticas F3-A. No conectan ni aplican SQL a una base."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[2]
SCHEMA = (ROOT / "supabase/migrations/202610260001_f3_schema.sql").read_text()
RLS = (ROOT / "supabase/migrations/202610260002_f3_rls.sql").read_text()
ALL_SQL = SCHEMA + "\n" + RLS

EXPECTED_TABLES = {
    "profiles", "role_assignments", "contacts", "contact_consents",
    "contact_assignments", "contact_activities", "notification_outbox",
    "buildings", "building_memberships", "advisor_clients", "projects",
    "project_memberships", "budgets", "building_logs", "commissions",
    "commission_status_history", "content_items", "content_revisions",
    "arsop_requests", "arsop_events", "cookie_consents", "audit_events",
}

created = set(re.findall(r"create table public\.([a-z_]+)", SCHEMA))
enabled = set(re.findall(r"alter table public\.([a-z_]+) enable row level security", RLS))
policies = re.findall(
    r"create policy ([a-z_]+) on public\.([a-z_]+) for ([a-z]+) to ([a-z]+)",
    RLS,
)

checks = []
def check(name, condition):
    checks.append((name, bool(condition)))

check("Las 22 tablas previstas están definidas", created == EXPECTED_TABLES)
check("RLS está habilitada en las 22 tablas", enabled == EXPECTED_TABLES)
check("No existe RLS deshabilitada", "disable row level security" not in RLS.lower())
check("No hay datos semilla ni datos reales", "insert into" not in ALL_SQL.lower())
check("No hay operaciones destructivas", not re.search(r"\b(drop|truncate)\b", ALL_SQL, re.I))
check("No hay políticas anónimas en tablas privadas", all(
    table == "content_items" for _, table, _, role in policies if role == "anon"
))
check("El contenido público exige publicado y no demo",
      "status = 'publicado' and is_demo = false" in RLS)
check("Los administradores se aíslan por membresía de edificio",
      "public.is_building_member(building_id)" in RLS)
check("Los asesores se aíslan por contacto autorizado",
      "public.is_advisor_contact(contact_id)" in RLS)
check("Triage tiene acceso global de contactos",
      "create policy contacts_select" in RLS and "public.can_access_contact(id)" in RLS)
check("Outbox no tiene acceso de cliente",
      not any(table == "notification_outbox" for _, table, _, _ in policies))
check("Cookies no tienen acceso de cliente",
      not any(table == "cookie_consents" for _, table, _, _ in policies))
check("ARSOP exige rol responsable",
      all("arsop_manager" in RLS for _ in [0]) and "create policy arsop_requests_select" in RLS)
check("No existe política de inserción de comisiones para asesores",
      "create policy commissions_insert_asesor" not in RLS)
check("La creación y modificación de comisiones exige triage",
      "create policy commissions_insert_triage" in RLS
      and "create policy commissions_update_triage" in RLS)
check("Trigger impide comisiones a administradores",
      "create trigger commissions_no_administradores before insert or update" in SCHEMA
      and "Prosol no paga comisiones a administradores" in SCHEMA)
check("Trigger impide convertir en administrador a quien tiene comisiones",
      "create trigger role_assignments_no_admin_con_comisiones before insert or update" in SCHEMA)
check("Toda comisión exige rol de asesor",
      "La comisión requiere un usuario con rol de asesor" in SCHEMA)
check("Consentimiento guarda versión y hash sin IP",
      "policy_text_hash" in SCHEMA and "policy_version" in SCHEMA
      and not re.search(r"\b(ip_address|ip)\b", SCHEMA, re.I))
check("La retención no se ejecuta automáticamente",
      not re.search(r"delete from public\.contacts", ALL_SQL, re.I))
check("Las funciones de autorización fijan search_path vacío",
      all("set search_path = ''" in block for block in re.findall(
          r"create or replace function public\.(?:has_any_role|is_triage|is_building_member|is_project_member|is_advisor_contact|is_assigned_contact|can_access_contact).*?;\$\$;",
          SCHEMA, re.S)))
check("No hay credenciales ni URLs de Supabase",
      not re.search(r"service_role|eyJ[a-zA-Z0-9_-]{20,}|https://[a-z0-9]+\.supabase\.co", ALL_SQL))

failed = [name for name, ok in checks if not ok]
for name, ok in checks:
    print(f"{'OK' if ok else 'FALLO'} · {name}")
print(f"\nResultado: {len(checks) - len(failed)}/{len(checks)} comprobaciones estáticas aprobadas.")
print("Límite: estas pruebas no sustituyen la ejecución de SQL ni las pruebas RLS en PostgreSQL/Supabase.")
if failed:
    raise SystemExit(1)
