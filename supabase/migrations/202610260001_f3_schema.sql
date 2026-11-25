-- F3-A · Diseño preliminar para un proyecto Supabase NUEVO de Prosol.
-- ARCHIVO NO APLICADO. No ejecutar sin aprobación escrita y revisión técnica.
-- No contiene datos reales ni credenciales.

begin;

create extension if not exists pgcrypto;

create type public.app_role as enum (
  'empresa_triage',
  'empresa_contenido',
  'empresa_ventas',
  'empresa_tecnico',
  'arsop_manager',
  'administrador',
  'asesor'
);

create type public.contact_status as enum ('nuevo', 'en_gestion', 'cerrado');
create type public.content_status as enum ('borrador', 'publicado', 'archivado');
create type public.notification_status as enum ('pendiente', 'enviado', 'fallido');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.role_assignments (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  assigned_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (user_id, role)
);

create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  phone text check (phone is null or char_length(phone) <= 30),
  profile text not null check (profile in ('administrador', 'presidente_comite', 'asesor', 'otro')),
  message text not null check (char_length(message) between 10 and 3000),
  source_path text not null check (source_path ~ '^/' and source_path !~ '[?#]'),
  source_cta text check (source_cta is null or char_length(source_cta) <= 100),
  status public.contact_status not null default 'nuevo',
  responsible_id uuid references auth.users(id) on delete set null,
  legal_hold boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_activity_at timestamptz
);

create table public.contact_consents (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  purpose text not null check (purpose in ('contacto_comercial', 'derechos_arsop')),
  policy_version text not null,
  policy_text_hash text not null check (policy_text_hash ~ '^[a-f0-9]{64}$'),
  consented_at timestamptz not null,
  unique (contact_id, purpose, policy_version)
);

create table public.contact_assignments (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  assigned_by uuid not null references auth.users(id) on delete restrict,
  assigned_to uuid not null references auth.users(id) on delete restrict,
  reason text check (reason is null or char_length(reason) <= 500),
  assigned_at timestamptz not null default now()
);

create table public.contact_activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete restrict,
  activity_type text not null check (activity_type in ('nota', 'asignacion', 'whatsapp', 'cierre')),
  notes text not null check (char_length(notes) between 1 and 3000),
  occurred_at timestamptz not null default now()
);

create table public.notification_outbox (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  channel text not null check (channel in ('correo')),
  status public.notification_status not null default 'pendiente',
  attempts integer not null default 0 check (attempts >= 0),
  last_error text,
  available_at timestamptz not null default now(),
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.buildings (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 2 and 160),
  internal_notes text check (internal_notes is null or char_length(internal_notes) <= 2000),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.building_memberships (
  building_id uuid not null references public.buildings(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (building_id, user_id)
);

create table public.advisor_clients (
  contact_id uuid not null references public.contacts(id) on delete cascade,
  advisor_id uuid not null references auth.users(id) on delete cascade,
  linked_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (contact_id, advisor_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete restrict,
  title text not null check (char_length(title) between 2 and 180),
  summary text check (summary is null or char_length(summary) <= 5000),
  status text not null default 'activo' check (char_length(status) <= 50),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.project_memberships (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  document_path text not null unique check (document_path !~ '^https?://'),
  original_filename text not null check (char_length(original_filename) <= 255),
  version integer not null default 1 check (version > 0),
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (project_id, version)
);

create table public.building_logs (
  id uuid primary key default gen_random_uuid(),
  building_id uuid not null references public.buildings(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  author_id uuid references auth.users(id) on delete set null,
  entry text not null check (char_length(entry) between 2 and 5000),
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.commissions (
  id uuid primary key default gen_random_uuid(),
  advisor_id uuid not null references auth.users(id) on delete restrict,
  contact_id uuid references public.contacts(id) on delete restrict,
  amount_clp numeric(14,2) not null check (amount_clp >= 0),
  status text not null check (char_length(status) <= 50),
  approved_by uuid references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.commission_status_history (
  id uuid primary key default gen_random_uuid(),
  commission_id uuid not null references public.commissions(id) on delete cascade,
  from_status text,
  to_status text not null,
  changed_by uuid references auth.users(id) on delete set null,
  note text check (note is null or char_length(note) <= 1000),
  changed_at timestamptz not null default now()
);

create table public.content_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9][a-z0-9-]*$'),
  content_type text not null check (content_type in ('slide', 'edificio', 'testimonio', 'confirmacion_tecnica')),
  title text not null check (char_length(title) between 2 and 180),
  payload jsonb not null default '{}'::jsonb check (jsonb_typeof(payload) = 'object'),
  is_demo boolean not null default true,
  status public.content_status not null default 'borrador',
  published_at timestamptz,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'publicado' or (published_at is not null and is_demo = false))
);

create table public.content_revisions (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid not null references public.content_items(id) on delete cascade,
  revision_number integer not null check (revision_number > 0),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  edited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (content_item_id, revision_number)
);

create table public.arsop_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null check (char_length(requester_name) between 2 and 120),
  email text not null check (char_length(email) between 3 and 254),
  request_type text not null check (request_type in ('acceso', 'rectificacion', 'supresion', 'oposicion', 'portabilidad')),
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'recibida' check (char_length(status) <= 50),
  received_at timestamptz not null default now(),
  due_at timestamptz not null,
  assigned_to uuid references auth.users(id) on delete set null,
  identity_verified_at timestamptz,
  completed_at timestamptz
);

create table public.arsop_events (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.arsop_requests(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null check (char_length(event_type) <= 80),
  notes text check (notes is null or char_length(notes) <= 3000),
  created_at timestamptz not null default now()
);

create table public.cookie_consents (
  id uuid primary key default gen_random_uuid(),
  necessary boolean not null default true check (necessary = true),
  analytics boolean not null default false,
  marketing boolean not null default false,
  policy_version text not null,
  decided_at timestamptz not null default now()
);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null check (char_length(action) <= 100),
  entity_type text not null check (char_length(entity_type) <= 80),
  entity_id text,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now()
);

create index contacts_status_created_idx on public.contacts(status, created_at desc);
create index contacts_responsible_idx on public.contacts(responsible_id, status);
create index contact_assignments_contact_idx on public.contact_assignments(contact_id, assigned_at desc);
create index contact_activities_contact_idx on public.contact_activities(contact_id, occurred_at desc);
create index notification_outbox_queue_idx on public.notification_outbox(status, available_at);
create index advisor_clients_advisor_idx on public.advisor_clients(advisor_id, contact_id);
create index projects_building_idx on public.projects(building_id);
create index budgets_project_idx on public.budgets(project_id, version desc);
create index building_logs_building_idx on public.building_logs(building_id, occurred_at desc);
create index commissions_advisor_idx on public.commissions(advisor_id, created_at desc);
create index arsop_requests_due_idx on public.arsop_requests(status, due_at);
create index audit_events_entity_idx on public.audit_events(entity_type, entity_id, created_at desc);

create or replace function public.has_any_role(allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.role_assignments ra
    where ra.user_id = (select auth.uid()) and ra.role = any(allowed_roles)
  );
$$;

create or replace function public.is_triage()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.has_any_role(array['empresa_triage']::public.app_role[]);
$$;

create or replace function public.is_building_member(target_building uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.building_memberships bm
    where bm.building_id = target_building and bm.user_id = (select auth.uid())
  ) and public.has_any_role(array['administrador']::public.app_role[]);
$$;

create or replace function public.is_project_member(target_project uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.project_memberships pm
    where pm.project_id = target_project and pm.user_id = (select auth.uid())
  ) and public.has_any_role(array['empresa_tecnico']::public.app_role[]);
$$;

create or replace function public.is_advisor_contact(target_contact uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.advisor_clients ac
    where ac.contact_id = target_contact and ac.advisor_id = (select auth.uid())
  ) and public.has_any_role(array['asesor']::public.app_role[]);
$$;

create or replace function public.is_assigned_contact(target_contact uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.contacts c
    where c.id = target_contact and c.responsible_id = (select auth.uid())
  ) and public.has_any_role(array['empresa_ventas', 'empresa_triage']::public.app_role[]);
$$;

create or replace function public.can_access_contact(target_contact uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_triage()
    or public.is_assigned_contact(target_contact)
    or public.is_advisor_contact(target_contact);
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_admin_commission()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.role_assignments ra
    where ra.user_id = new.advisor_id and ra.role = 'asesor'
  ) then
    raise exception 'La comisión requiere un usuario con rol de asesor';
  end if;

  if exists (
    select 1 from public.role_assignments ra
    where ra.user_id = new.advisor_id and ra.role = 'administrador'
  ) then
    raise exception 'Prosol no paga comisiones a administradores';
  end if;

  return new;
end;
$$;

create or replace function public.prevent_admin_with_commissions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role = 'administrador' and exists (
    select 1 from public.commissions c where c.advisor_id = new.user_id
  ) then
    raise exception 'No se puede asignar rol administrador a un usuario con comisiones';
  end if;
  return new;
end;
$$;

create or replace function public.sync_contact_assignment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.contacts
  set responsible_id = new.assigned_to,
      status = 'en_gestion',
      last_activity_at = new.assigned_at,
      updated_at = now()
  where id = new.contact_id;
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger contacts_updated_at before update on public.contacts
for each row execute function public.set_updated_at();
create trigger buildings_updated_at before update on public.buildings
for each row execute function public.set_updated_at();
create trigger projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();
create trigger commissions_updated_at before update on public.commissions
for each row execute function public.set_updated_at();
create trigger content_items_updated_at before update on public.content_items
for each row execute function public.set_updated_at();

create trigger commissions_no_administradores before insert or update on public.commissions
for each row execute function public.prevent_admin_commission();
create trigger role_assignments_no_admin_con_comisiones before insert or update on public.role_assignments
for each row execute function public.prevent_admin_with_commissions();
create trigger contact_assignments_sync after insert on public.contact_assignments
for each row execute function public.sync_contact_assignment();

revoke all on function public.has_any_role(public.app_role[]) from public;
revoke all on function public.is_triage() from public;
revoke all on function public.is_building_member(uuid) from public;
revoke all on function public.is_project_member(uuid) from public;
revoke all on function public.is_advisor_contact(uuid) from public;
revoke all on function public.is_assigned_contact(uuid) from public;
revoke all on function public.can_access_contact(uuid) from public;
grant execute on function public.has_any_role(public.app_role[]) to authenticated;
grant execute on function public.is_triage() to authenticated;
grant execute on function public.is_building_member(uuid) to authenticated;
grant execute on function public.is_project_member(uuid) to authenticated;
grant execute on function public.is_advisor_contact(uuid) to authenticated;
grant execute on function public.is_assigned_contact(uuid) to authenticated;
grant execute on function public.can_access_contact(uuid) to authenticated;

commit;
