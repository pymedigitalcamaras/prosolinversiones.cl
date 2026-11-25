-- ============================================
-- SCHEMA SUPABASE PARA PROSOL INVERSIÓNES
-- ============================================
-- Ejecutar esto en el SQL Editor de Supabase
-- ============================================

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: CONTACTOS (CRM)
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT CHECK (role IN ('administrador', 'comite', 'asesor', 'otro')),
  building_name TEXT,
  building_units INTEGER,
  message TEXT,
  source TEXT DEFAULT 'web',
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'en_proceso', 'cotizado', 'cerrado', 'descartado')),
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: USUARIOS DE PANELES
-- ============================================
CREATE TABLE IF NOT EXISTS panel_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('empresa', 'administrador', 'asesor')),
  password_hash TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: EDIFICIOS
-- ============================================
CREATE TABLE IF NOT EXISTS buildings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  units INTEGER,
  admin_name TEXT,
  admin_phone TEXT,
  admin_email TEXT,
  system_type TEXT,
  install_date DATE,
  status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'mantenimiento')),
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: TESTIMONIOS
-- ============================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  building_name TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: PROYECTOS / PRESUPUESTOS
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  building_id UUID REFERENCES buildings(id),
  contact_id UUID REFERENCES contacts(id),
  title TEXT NOT NULL,
  description TEXT,
  products JSONB,
  estimated_cost DECIMAL(12,2),
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'aprobado', 'en_ejecucion', 'finalizado', 'cancelado')),
  start_date DATE,
  end_date DATE,
  assigned_to TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: BITÁCORA
-- ============================================
CREATE TABLE IF NOT EXISTS log_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  building_id UUID REFERENCES buildings(id),
  entry_type TEXT CHECK (entry_type IN ('visita', 'mantenimiento', 'reparacion', 'instalacion', 'revision', 'otro')),
  description TEXT NOT NULL,
  technician_name TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: CLIENTES DE ASESORES
-- ============================================
CREATE TABLE IF NOT EXISTS advisor_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES panel_users(id),
  contact_id UUID REFERENCES contacts(id),
  building_name TEXT,
  status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo', 'cerrado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: COMISIONES DE ASESORES
-- ============================================
CREATE TABLE IF NOT EXISTS advisor_commissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advisor_id UUID REFERENCES panel_users(id),
  client_id UUID REFERENCES advisor_clients(id),
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(12,2) NOT NULL,
  percentage DECIMAL(5,2),
  status TEXT DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'pagada', 'rechazada')),
  paid_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DATOS INICIALES: USUARIOS DE DEMO
-- ============================================
INSERT INTO panel_users (name, email, role, is_active) VALUES
  ('Marcelo Olate', 'marcelo@prosol.cl', 'empresa', true),
  ('Julio San Martín', 'julio@prosol.cl', 'empresa', true),
  ('Alejandro Olate', 'alejandro@prosol.cl', 'empresa', true),
  ('Irma Romo', 'irma@prosol.cl', 'empresa', true),
  ('Erika Wang', 'erika@prosol.cl', 'empresa', true),
  ('Técnico Demo 1', 'tecnico1@prosol.cl', 'empresa', true),
  ('Vendedor Demo 1', 'vendedor1@prosol.cl', 'empresa', true),
  ('Admin Demo', 'admin@demo.cl', 'administrador', true),
  ('Asesor Demo', 'asesor@demo.cl', 'asesor', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- DATOS INICIALES: CONTACTOS DE DEMO
-- ============================================
INSERT INTO contacts (name, email, phone, company, role, building_name, message, status, assigned_to) VALUES
  ('Juan Pérez', 'juan@demo.cl', '+56912345678', 'Edificio Los Pinos', 'administrador', 'Edificio Los Pinos 123', 'Consulta sobre bomba de calor para ACS', 'nuevo', 'Marcelo Olate'),
  ('María González', 'maria@demo.cl', '+56987654321', 'Condominio El Bosque', 'comite', 'Condominio El Bosque 456', 'Cotización bomba de calor termodinámica', 'en_proceso', 'Julio San Martín'),
  ('Pedro Silva', 'pedro@demo.cl', '+56911223344', 'Torre del Sol', 'asesor', 'Torre del Sol 789', 'Interesado en canal asesor copropiedad', 'nuevo', 'Alejandro Olate')
ON CONFLICT DO NOTHING;

-- ============================================
-- DATOS INICIALES: EDIFICIOS DE DEMO
-- ============================================
INSERT INTO buildings (name, address, units, admin_name, system_type, status, notes) VALUES
  ('Edificio Los Pinos', 'Av. Las Condes 1234, Santiago', 45, 'Juan Pérez', 'Bomba de calor ACS NAE', 'activo', 'Instalación de bomba de calor termodinámica'),
  ('Condominio El Bosque', 'Calle El Bosque 456, Providencia', 80, 'María González', 'Bomba de calor + Estanques', 'activo', 'Sistema completo de agua caliente'),
  ('Torre del Sol', 'Av. del Sol 789, Ñuñoa', 32, 'Carlos Rojas', 'Bomba de calor 3ra generación', 'mantenimiento', 'Revisión de bomba de calor NAE'),
  ('Edificio Plaza Central', 'Plaza de Armas 101, Santiago Centro', 60, 'Ana Martínez', 'Sistema ACS híbrido', 'activo', 'Bomba de calor termodinámica instalada'),
  ('Residencial Los Laureles', 'Los Laureles 202, Las Condes', 25, 'Roberto Díaz', 'Bomba de calor NAE', 'activo', 'ACS con bomba de calor 3ra generación')
ON CONFLICT DO NOTHING;

-- ============================================
-- DATOS INICIALES: TESTIMONIOS DE DEMO
-- ============================================
INSERT INTO testimonials (author_name, author_role, building_name, quote, rating, is_active) VALUES
  ('Juan Pérez', 'Administrador', 'Edificio Los Pinos', 'La instalación de la bomba de calor NAE redujo nuestro consumo energético significativamente. El equipo de Prosol fue muy profesional.', 5, true),
  ('María González', 'Presidenta del Comité', 'Condominio El Bosque', 'Después de evaluar varias opciones, elegimos Prosol por su experiencia en bombas de calor para edificios. Excelente decisión.', 5, true),
  ('Carlos Rojas', 'Administrador', 'Torre del Sol', 'El servicio técnico de Prosol responde rápido. Nuestra bomba de calor funciona perfectamente desde la instalación.', 4, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS: Habilitar Row Level Security
-- ============================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE panel_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_commissions ENABLE ROW LEVEL SECURITY;

-- Política: permitir todo para service_role (usado en server)
CREATE POLICY "service_role_all" ON contacts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_users" ON panel_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_buildings" ON buildings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_testimonials" ON testimonials FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_projects" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_logs" ON log_entries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_clients" ON advisor_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_commissions" ON advisor_commissions FOR ALL USING (true) WITH CHECK (true);
