-- F3-A · RLS y privilegios para un proyecto Supabase NUEVO de Prosol.
-- ARCHIVO NO APLICADO. Requiere 202610260001_f3_schema.sql.
-- Las políticas deben probarse en PostgreSQL/Supabase antes de cualquier uso real.

begin;

revoke all on table public.profiles, public.role_assignments, public.contacts,
  public.contact_consents, public.contact_assignments, public.contact_activities,
  public.notification_outbox, public.buildings, public.building_memberships,
  public.advisor_clients, public.projects, public.project_memberships,
  public.budgets, public.building_logs, public.commissions,
  public.commission_status_history, public.content_items, public.content_revisions,
  public.arsop_requests, public.arsop_events, public.cookie_consents,
  public.audit_events from anon, authenticated;

grant select on table public.content_items to anon;
grant select, update on table public.profiles to authenticated;
grant select, insert, delete on table public.role_assignments to authenticated;
grant select, insert, update on table public.contacts to authenticated;
grant select on table public.contact_consents to authenticated;
grant select, insert on table public.contact_assignments to authenticated;
grant select, insert on table public.contact_activities to authenticated;
grant select, insert, update on table public.buildings to authenticated;
grant select, insert, delete on table public.building_memberships to authenticated;
grant select, insert, delete on table public.advisor_clients to authenticated;
grant select, insert, update on table public.projects to authenticated;
grant select, insert, delete on table public.project_memberships to authenticated;
grant select, insert on table public.budgets to authenticated;
grant select, insert on table public.building_logs to authenticated;
grant select, insert, update on table public.commissions to authenticated;
grant select, insert on table public.commission_status_history to authenticated;
grant select, insert, update on table public.content_items to authenticated;
grant select, insert on table public.content_revisions to authenticated;
grant select, insert, update on table public.arsop_requests to authenticated;
grant select, insert on table public.arsop_events to authenticated;
grant select on table public.audit_events to authenticated;

alter table public.profiles enable row level security;
alter table public.role_assignments enable row level security;
alter table public.contacts enable row level security;
alter table public.contact_consents enable row level security;
alter table public.contact_assignments enable row level security;
alter table public.contact_activities enable row level security;
alter table public.notification_outbox enable row level security;
alter table public.buildings enable row level security;
alter table public.building_memberships enable row level security;
alter table public.advisor_clients enable row level security;
alter table public.projects enable row level security;
alter table public.project_memberships enable row level security;
alter table public.budgets enable row level security;
alter table public.building_logs enable row level security;
alter table public.commissions enable row level security;
alter table public.commission_status_history enable row level security;
alter table public.content_items enable row level security;
alter table public.content_revisions enable row level security;
alter table public.arsop_requests enable row level security;
alter table public.arsop_events enable row level security;
alter table public.cookie_consents enable row level security;
alter table public.audit_events enable row level security;

-- Identidad y roles: cada usuario ve su perfil; solo triage administra roles.
create policy profiles_select on public.profiles for select to authenticated
using (id = (select auth.uid()) or public.is_triage());
create policy profiles_update_self on public.profiles for update to authenticated
using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy roles_select on public.role_assignments for select to authenticated
using (user_id = (select auth.uid()) or public.is_triage());
create policy roles_insert_triage on public.role_assignments for insert to authenticated
with check (public.is_triage());
create policy roles_delete_triage on public.role_assignments for delete to authenticated
using (public.is_triage());

-- CRM: triage ve todo; ventas y asesores solo sus contactos autorizados.
create policy contacts_select on public.contacts for select to authenticated
using (public.can_access_contact(id));
create policy contacts_insert_triage on public.contacts for insert to authenticated
with check (public.is_triage());
create policy contacts_update on public.contacts for update to authenticated
using (public.is_triage() or public.is_assigned_contact(id))
with check (public.is_triage() or public.is_assigned_contact(id));
create policy contact_consents_select on public.contact_consents for select to authenticated
using (public.is_triage() or public.has_any_role(array['arsop_manager']::public.app_role[]));
create policy contact_assignments_select on public.contact_assignments for select to authenticated
using (public.is_triage() or assigned_by = (select auth.uid()) or assigned_to = (select auth.uid()));
create policy contact_assignments_insert_triage on public.contact_assignments for insert to authenticated
with check (public.is_triage() and assigned_by = (select auth.uid()));
create policy contact_activities_select on public.contact_activities for select to authenticated
using (public.can_access_contact(contact_id));
create policy contact_activities_insert on public.contact_activities for insert to authenticated
with check (
  author_id = (select auth.uid())
  and public.can_access_contact(contact_id)
  and (
    public.is_triage()
    or public.is_assigned_contact(contact_id)
    or (public.is_advisor_contact(contact_id) and activity_type in ('nota', 'whatsapp'))
  )
);

-- Outbox: solo servidor mediante una credencial de servicio nunca expuesta.
-- No se crean políticas para anon ni authenticated.

-- Edificios y proyectos: membresía obligatoria, nunca acceso por ID solamente.
create policy buildings_select on public.buildings for select to authenticated
using (public.is_triage() or public.is_building_member(id));
create policy buildings_insert_triage on public.buildings for insert to authenticated
with check (public.is_triage());
create policy buildings_update_triage on public.buildings for update to authenticated
using (public.is_triage()) with check (public.is_triage());
create policy building_memberships_select on public.building_memberships for select to authenticated
using (public.is_triage() or (user_id = (select auth.uid()) and public.is_building_member(building_id)));
create policy building_memberships_insert_triage on public.building_memberships for insert to authenticated
with check (public.is_triage());
create policy building_memberships_delete_triage on public.building_memberships for delete to authenticated
using (public.is_triage());
create policy advisor_clients_select on public.advisor_clients for select to authenticated
using (public.is_triage() or (advisor_id = (select auth.uid()) and public.has_any_role(array['asesor']::public.app_role[])));
create policy advisor_clients_insert_triage on public.advisor_clients for insert to authenticated
with check (public.is_triage());
create policy advisor_clients_delete_triage on public.advisor_clients for delete to authenticated
using (public.is_triage());
create policy projects_select on public.projects for select to authenticated
using (public.is_triage() or public.is_building_member(building_id) or public.is_project_member(id));
create policy projects_insert_triage on public.projects for insert to authenticated
with check (public.is_triage());
create policy projects_update_triage on public.projects for update to authenticated
using (public.is_triage()) with check (public.is_triage());
create policy project_memberships_select on public.project_memberships for select to authenticated
using (public.is_triage() or (user_id = (select auth.uid()) and public.is_project_member(project_id)));
create policy project_memberships_insert_triage on public.project_memberships for insert to authenticated
with check (public.is_triage());
create policy project_memberships_delete_triage on public.project_memberships for delete to authenticated
using (public.is_triage());
create policy budgets_select on public.budgets for select to authenticated
using (public.is_triage() or exists (
  select 1 from public.projects p where p.id = project_id
  and (public.is_building_member(p.building_id) or public.is_project_member(p.id))
));
create policy budgets_insert_triage on public.budgets for insert to authenticated
with check (public.is_triage());
create policy building_logs_select on public.building_logs for select to authenticated
using (
  public.is_triage()
  or public.is_building_member(building_id)
  or (project_id is not null and public.is_project_member(project_id))
);
create policy building_logs_insert_triage on public.building_logs for insert to authenticated
with check (public.is_triage());

-- Comisiones: asesor solo lee las propias; nunca puede crearlas ni aprobarlas.
create policy commissions_select on public.commissions for select to authenticated
using (
  public.is_triage()
  or (advisor_id = (select auth.uid()) and public.has_any_role(array['asesor']::public.app_role[]))
);
create policy commissions_insert_triage on public.commissions for insert to authenticated
with check (public.is_triage());
create policy commissions_update_triage on public.commissions for update to authenticated
using (public.is_triage()) with check (public.is_triage());
create policy commission_history_select on public.commission_status_history for select to authenticated
using (public.is_triage() or exists (
  select 1 from public.commissions c where c.id = commission_id
  and c.advisor_id = (select auth.uid())
));
create policy commission_history_insert_triage on public.commission_status_history for insert to authenticated
with check (public.is_triage());

-- Contenido: público solo publicado y no demostrativo; edición solo autorizada.
create policy content_select_public on public.content_items for select to anon
using (status = 'publicado' and is_demo = false);
create policy content_select_staff on public.content_items for select to authenticated
using (public.is_triage() or public.has_any_role(array['empresa_contenido']::public.app_role[]));
create policy content_insert_staff on public.content_items for insert to authenticated
with check (public.is_triage() or public.has_any_role(array['empresa_contenido']::public.app_role[]));
create policy content_update_staff on public.content_items for update to authenticated
using (public.is_triage() or public.has_any_role(array['empresa_contenido']::public.app_role[]))
with check (public.is_triage() or public.has_any_role(array['empresa_contenido']::public.app_role[]));
create policy content_revisions_select_staff on public.content_revisions for select to authenticated
using (public.is_triage() or public.has_any_role(array['empresa_contenido']::public.app_role[]));
create policy content_revisions_insert_staff on public.content_revisions for insert to authenticated
with check (public.is_triage() or public.has_any_role(array['empresa_contenido']::public.app_role[]));

-- ARSOP: únicamente el rol expresamente responsable.
create policy arsop_requests_select on public.arsop_requests for select to authenticated
using (public.has_any_role(array['arsop_manager']::public.app_role[]));
create policy arsop_requests_insert_manager on public.arsop_requests for insert to authenticated
with check (public.has_any_role(array['arsop_manager']::public.app_role[]));
create policy arsop_requests_update_manager on public.arsop_requests for update to authenticated
using (public.has_any_role(array['arsop_manager']::public.app_role[]))
with check (public.has_any_role(array['arsop_manager']::public.app_role[]));
create policy arsop_events_select on public.arsop_events for select to authenticated
using (public.has_any_role(array['arsop_manager']::public.app_role[]));
create policy arsop_events_insert_manager on public.arsop_events for insert to authenticated
with check (
  public.has_any_role(array['arsop_manager']::public.app_role[])
  and actor_id = (select auth.uid())
);

-- Consentimientos de cookies: escritura de servidor; sin lectura de usuarios.
-- Auditoría: lectura de triage; inserción exclusivamente de servidor.
create policy audit_events_select_triage on public.audit_events for select to authenticated
using (public.is_triage());

commit;
