import type { Metadata } from "next";
import { ClipboardList, Users, Building2, MessageSquare, TrendingUp, UserCog, Home, Quote, ImageIcon, Package } from "lucide-react";
import { requirePanelRole } from "@/lib/auth/access";
import { supabaseAdmin } from "@/lib/supabase";
import { UserManager } from "@/components/panel/UserManager";
import { ContactAssigner } from "@/components/panel/ContactAssigner";
import { BuildingManager } from "@/components/panel/BuildingManager";
import { TestimonialManager } from "@/components/panel/TestimonialManager";
import { SlideManager } from "@/components/panel/SlideManager";
import { ProductManager } from "@/components/panel/ProductManager";

export const metadata: Metadata = { title: "Panel EMPRESA", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function getStats() {
  const [contactsRes, buildingsRes, testimonialsRes, usersRes, pendingRes] = await Promise.all([
    supabaseAdmin.from("contacts").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("buildings").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("testimonials").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("panel_users").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabaseAdmin.from("panel_users").select("*", { count: "exact", head: true }).eq("is_active", false),
  ]);
  return {
    contacts: contactsRes.count || 0,
    buildings: buildingsRes.count || 0,
    testimonials: testimonialsRes.count || 0,
    activeUsers: usersRes.count || 0,
    pendingUsers: pendingRes.count || 0,
  };
}

async function getUsers() {
  const { data } = await supabaseAdmin
    .from("panel_users")
    .select("id, name, email, role, is_active, phone, notes, verification_token")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getContacts() {
  const { data } = await supabaseAdmin
    .from("contacts")
    .select("id, full_name, email, phone, profile, status, responsible_id")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getSellers() {
  const { data } = await supabaseAdmin
    .from("panel_users")
    .select("id, name")
    .eq("is_active", true);
  return data || [];
}

async function getBuildings() {
  const { data } = await supabaseAdmin
    .from("buildings")
    .select("id, name, location, system, summary, image")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getTestimonials() {
  const { data } = await supabaseAdmin
    .from("testimonials")
    .select("id, quote, role")
    .order("created_at", { ascending: false });
  return data || [];
}

async function getSlides() {
  const { data } = await supabaseAdmin
    .from("slides")
    .select("id, image, alt, eyebrow, title, text, href, action, sort_order")
    .order("sort_order", { ascending: true });
  return data || [];
}

async function getProducts() {
  const { data } = await supabaseAdmin
    .from("products")
    .select("id, slug, name, short_name, model, category, description, application, image, is_active, sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return data || [];
}

export default async function CompanyPanel() {
  const session = await requirePanelRole("empresa");
  const stats = await getStats();
  const users = await getUsers();
  const contacts = await getContacts();
  const sellers = await getSellers();
  const buildings = await getBuildings();
  const testimonials = await getTestimonials();
  const slides = await getSlides();
  const products = await getProducts();

  const unassignedCount = contacts.filter((c) => !c.responsible_id).length;

  return (
    <div className="panel-content">
      <header className="panel-page-header">
        <span className="eyebrow">Panel EMPRESA</span>
        <h1>Base de operacion y control</h1>
        <p>Bienvenido, {session.name}. Gestione edificios, testimonios, slider, catalogo, contactos y usuarios desde un solo lugar.</p>
      </header>

      <section className="panel-stats-grid" aria-label="Estadisticas">
        <div className="panel-stat-card">
          <Users size={24} />
          <strong>{stats.contacts}</strong>
          <span>Contactos CRM</span>
        </div>
        <div className="panel-stat-card">
          <Building2 size={24} />
          <strong>{stats.buildings}</strong>
          <span>Edificios</span>
        </div>
        <div className="panel-stat-card">
          <MessageSquare size={24} />
          <strong>{stats.testimonials}</strong>
          <span>Testimonios</span>
        </div>
        <div className="panel-stat-card">
          <TrendingUp size={24} />
          <strong>{stats.activeUsers}</strong>
          <span>Usuarios activos</span>
        </div>
      </section>

      <section className="panel-data-section">
        <h2><ClipboardList size={20} /> Asignacion de contactos</h2>
        {unassignedCount > 0 && (
          <p style={{ color: "#92311f", fontWeight: 600, marginBottom: "0.5rem" }}>
            {unassignedCount} contacto{unassignedCount > 1 ? "s" : ""} sin asignar
          </p>
        )}
        <ContactAssigner initialContacts={contacts} sellers={sellers} />
      </section>

      <section className="panel-data-section">
        <h2><ImageIcon size={20} /> Slider principal</h2>
        <SlideManager initialSlides={slides} />
      </section>

      <section className="panel-data-section">
        <h2><Home size={20} /> Edificios</h2>
        <BuildingManager initialBuildings={buildings} />
      </section>

      <section className="panel-data-section">
        <h2><Package size={20} /> Catalogo de productos</h2>
        <ProductManager initialProducts={products} />
      </section>

      <section className="panel-data-section">
        <h2><Quote size={20} /> Testimonios</h2>
        <TestimonialManager initialTestimonials={testimonials} />
      </section>

      <section className="panel-data-section">
        <h2><UserCog size={20} /> Gestion de usuarios</h2>
        {stats.pendingUsers > 0 && (
          <p style={{ color: "#92311f", fontWeight: 600, marginBottom: "0.5rem" }}>
            {stats.pendingUsers} solicitud{stats.pendingUsers > 1 ? "es" : ""} pendiente{stats.pendingUsers > 1 ? "s" : ""} de aprobacion
          </p>
        )}
        <UserManager initialUsers={users} />
      </section>
    </div>
  );
}
