export const site = {
  name: "Prosol Inversiones",
  legalName: "Prosol Inversiones SpA",
  url: "https://prosolinversiones.cl",
  description: "Bombas de calor termodinámicas NAE de 3ra generación para agua caliente sanitaria ACS en edificios y copropiedades. Venta, instalación y asesoría técnica en Chile.",
  email: "prosol.aguacaliente@gmail.com",
  privacyEmail: "prosol.aguacaliente@gmail.com",
  privacyOwner: "Alejandro Olate",
  phoneDisplay: "+56 9 9011 7784",
  phoneHref: "+56990117784",
  whatsapp: "56990117784",
  hours: "Lunes a viernes · 9:00–18:30",
  responseTime: "Respuesta dentro de 24 horas hábiles",
  coverage: "Santiago y todo Chile",
};

export function whatsappUrl(message = "Hola, Prosol. Quisiera solicitar información para una comunidad o edificio.") {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const navigation = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/experiencia", label: "Experiencia" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/centro-tecnico", label: "Centro técnico" },
  { href: "/contacto", label: "Contacto" },
];

export const faqs = [
  {
    question: "¿Qué es una bomba de calor termodinámica de 3ra generación?",
    answer: "Una bomba de calor termodinámica de 3ra generación es un equipo que extrae calor del ambiente para producir agua caliente sanitaria ACS de manera eficiente. Las unidades NAE que comercializa Prosol alcanzan COP superiores a 4, lo que significa que por cada kWh de electricidad consumido, se generan más de 4 kWh de calor útil para el edificio.",
  },
  {
    question: "¿Cuánto puede ahorrar una bomba de calor en un edificio?",
    answer: "Prosol comunica un ahorro de hasta 50 %, dependiendo del sistema actual, las condiciones del edificio, los hábitos de consumo y el dimensionamiento. Un antecedente de referencia registra 46,2 % de ahorro anual. Ninguna cifra constituye una garantía universal: cada proyecto requiere evaluación técnica.",
  },
  {
    question: "¿Cómo se evalúa una solución de bomba de calor para mi comunidad?",
    answer: "Se revisan la demanda de agua caliente, el sistema existente, los equipos, el espacio disponible y las condiciones eléctricas e hidráulicas. Con esos antecedentes se define una alternativa técnica y se analiza la inversión en relación con el ahorro estimado. El dimensionamiento correcto es clave para la eficiencia de la bomba de calor.",
  },
  {
    question: "¿Las bombas de calor reemplazan una caldera?",
    answer: "Pueden formar parte de una modernización del sistema de agua caliente, pero no se instalan como si fueran una caldera. Su operación, acumulación, recirculación y puesta en marcha requieren un diseño específico. Prosol cuenta con experiencia en el primer edificio de Chile en apagar sus calderas a gas e instalar una bomba de calor NAE.",
  },
  {
    question: "¿Prosol vende e instala bombas de calor en todo Chile?",
    answer: "Sí. Prosol Inversiones importa, vende e instala bombas de calor NAE en edificios y copropiedades de Chile. Contamos con más de 10 años de experiencia, departamento de ingeniería propio, laboratorio climático y capacitación directa con los fabricantes.",
  },
  {
    question: "¿Puedo pedir antecedentes para presentar al comité?",
    answer: "Sí. Puede solicitar una presentación con los antecedentes técnicos y comerciales de la evaluación para que el comité pueda revisar el alcance, los supuestos y las condiciones antes de tomar una decisión sobre la instalación de la bomba de calor.",
  },
  {
    question: "¿Cómo participa un asesor en copropiedad con Prosol?",
    answer: "El asesor puede presentar oportunidades, facilitar antecedentes y acompañar la conversación con la comunidad dentro de una relación comercial legítima. Prosol no paga comisiones a administradores. Los asesores tienen acceso a un panel exclusivo para monitorear sus clientes y comisiones.",
  },
  {
    question: "¿Cuál es la diferencia entre una bomba de calor y una caldera tradicional?",
    answer: "Una caldera quema combustible (gas, petróleo o eléctrico) para generar calor, mientras que una bomba de calor transfiere calor del ambiente al agua consumiendo mucha menos energía. Una bomba de calor no se instala como una caldera: requiere dimensionamiento técnico, acumulación adecuada y recirculación correcta para obtener el máximo rendimiento energético.",
  },
];
