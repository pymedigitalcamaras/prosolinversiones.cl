export type CategoryId = "acs-horizontal" | "acs-vertical" | "piscina" | "climatizacion" | "acumulacion";

export type ProductSpec = { label: string; value: string };

export type Product = {
  slug: string;
  name: string;
  shortName: string;
  model: string;
  category: CategoryId;
  description: string;
  application: string;
  image: string;
  gallery?: string[];
  highlights: string[];
  specs: ProductSpec[];
  sourcePage: string;
};

export const categories: { id: CategoryId | "todos"; name: string; description: string }[] = [
  { id: "todos", name: "Toda la línea", description: "Las 12 soluciones del catálogo V1" },
  { id: "acs-horizontal", name: "ACS horizontal", description: "Agua caliente sanitaria centralizada" },
  { id: "acs-vertical", name: "ACS vertical", description: "Mayor capacidad en formato vertical" },
  { id: "piscina", name: "Piscinas", description: "Climatización con recirculación" },
  { id: "climatizacion", name: "All-in-one", description: "Frío y calor con hidráulica integrada" },
  { id: "acumulacion", name: "Acumulación", description: "Estanques sanitarios de acero inoxidable" },
];

const acsBenefits = [
  "Producción continua de agua caliente sanitaria para sistemas centralizados.",
  "Compatible con acumulación y recirculación, según el diseño del proyecto.",
  "Ingeniería y dimensionamiento según el consumo real del edificio.",
];

const horizontal = [
  {
    slug: "bomba-horizontal-5p", name: "Bomba de calor horizontal 5P", shortName: "Horizontal 5P", model: "OBT-050-DKFXRS",
    description: "Una solución compacta para producción centralizada de agua caliente sanitaria, con integración a estanques de acumulación.",
    application: "Edificios y sistemas centralizados de ACS", image: "/images/productos/catalogo-02.webp", sourcePage: "Catálogo de productos, página 2",
    highlights: ["17,8 kW de capacidad térmica", "383 L/h de caudal nominal", "1 compresor"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "17,8 kW" },
      { label: "Caudal de agua nominal", value: "383 L/h" }, { label: "Temperatura de salida nominal", value: "60 °C" },
      { label: "Refrigerante / carga", value: "R410A / 1.900 g" }, { label: "Nivel sonoro", value: "≤ 58 dB(A)" },
      { label: "Dimensiones", value: "750 × 750 × 1.100 mm" }, { label: "Peso neto", value: "120 kg" },
      { label: "Consumo eléctrico informado", value: "4,5 kWh" }, { label: "Compresores", value: "1" },
    ]
  },
  {
    slug: "bomba-horizontal-7p", name: "Bomba de calor horizontal 7P", shortName: "Horizontal 7P", model: "OBT-070-DKFXRS",
    description: "Mayor capacidad térmica en el mismo formato horizontal compacto para proyectos de agua caliente sanitaria.",
    application: "Edificios con mayor demanda de ACS", image: "/images/productos/catalogo-03.webp", sourcePage: "Catálogo de productos, página 3",
    highlights: ["22,3 kW de capacidad térmica", "499 L/h de caudal nominal", "1 compresor"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "22,3 kW" },
      { label: "Caudal de agua nominal", value: "499 L/h" }, { label: "Temperatura de salida nominal", value: "60 °C" },
      { label: "Refrigerante / carga", value: "R410A / 2.500 g" }, { label: "Nivel sonoro", value: "≤ 58 dB(A)" },
      { label: "Dimensiones", value: "750 × 750 × 1.100 mm" }, { label: "Peso neto", value: "155 kg" },
      { label: "Consumo eléctrico informado", value: "5,4 kWh" }, { label: "Compresores", value: "1" },
    ]
  },
  {
    slug: "bomba-horizontal-10p", name: "Bomba de calor horizontal 10P", shortName: "Horizontal 10P", model: "OBT-100-DKFXRS",
    description: "Equipo de dos compresores para sistemas de ACS que requieren una mayor capacidad de producción y acumulación.",
    application: "Demanda comercial y comunitaria de ACS", image: "/images/productos/catalogo-04.webp", sourcePage: "Catálogo de productos, página 4",
    highlights: ["35,6 kW de capacidad térmica", "766 L/h de caudal nominal", "2 compresores"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "35,6 kW" },
      { label: "Caudal de agua nominal", value: "766 L/h" }, { label: "Temperatura de salida nominal", value: "60 °C" },
      { label: "Refrigerante / carga", value: "R410A / 1.900 g × 2" }, { label: "Nivel sonoro", value: "≤ 58 dB(A)" },
      { label: "Dimensiones", value: "1.500 × 690 × 1.060 mm" }, { label: "Peso neto", value: "240 kg" },
      { label: "Consumo eléctrico informado", value: "9,0 kWh" }, { label: "Compresores", value: "2" },
    ]
  },
  {
    slug: "bomba-horizontal-12p", name: "Bomba de calor horizontal 12P", shortName: "Horizontal 12P", model: "OBT-120-DKFXRS",
    description: "La alternativa horizontal de mayor capacidad de esta línea, con dos compresores y operación a 60 °C.",
    application: "Proyectos centralizados de alta demanda", image: "/images/productos/catalogo-05.webp", sourcePage: "Catálogo de productos, página 5",
    highlights: ["42 kW de capacidad térmica", "902 L/h de caudal nominal", "2 compresores"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "42 kW" },
      { label: "Caudal de agua nominal", value: "902 L/h" }, { label: "Temperatura de salida nominal", value: "60 °C" },
      { label: "Refrigerante / carga", value: "R410A / 2.200 g × 2" }, { label: "Nivel sonoro", value: "≤ 58 dB(A)" },
      { label: "Dimensiones", value: "1.500 × 690 × 1.060 mm" }, { label: "Peso neto", value: "260 kg" },
      { label: "Consumo eléctrico informado", value: "10,2 kWh" }, { label: "Compresores", value: "2" },
    ]
  },
] satisfies Omit<Product, "category">[];

const vertical = [
  {
    slug: "bomba-vertical-10p", name: "Bomba de calor vertical 10P", shortName: "Vertical 10P", model: "OBT-100-DKFXRS",
    description: "Configuración vertical para proyectos que requieren alta capacidad y una huella de instalación compacta.",
    application: "Azoteas y salas técnicas de edificios", image: "/images/productos/catalogo-06.webp", sourcePage: "Catálogo de productos, página 6",
    highlights: ["38,6 kW de capacidad térmica", "830 L/h de caudal nominal", "Formato vertical"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "38,6 kW" },
      { label: "Caudal de agua nominal", value: "830 L/h" }, { label: "Temperatura de salida nominal", value: "60 °C" },
      { label: "Refrigerante / carga", value: "R410A / 6.500 g" }, { label: "Nivel sonoro", value: "≤ 66 dB(A)" },
      { label: "Dimensiones", value: "854 × 854 × 1.920 mm" }, { label: "Peso neto", value: "320 kg" },
      { label: "Consumo eléctrico informado", value: "9,38 kWh" }, { label: "Compresores", value: "1" },
    ]
  },
  {
    slug: "bomba-vertical-12p", name: "Bomba de calor vertical 12P", shortName: "Vertical 12P", model: "OBT-120-DKFXRS",
    description: "La opción vertical de mayor capacidad del catálogo para sistemas centralizados de agua caliente sanitaria.",
    application: "Proyectos de alta demanda con espacio vertical", image: "/images/productos/catalogo-07.webp", sourcePage: "Catálogo de productos, página 7",
    highlights: ["44,2 kW de capacidad térmica", "950 L/h de caudal nominal", "Formato vertical"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "44,2 kW" },
      { label: "Caudal de agua nominal", value: "950 L/h" }, { label: "Temperatura de salida nominal", value: "60 °C" },
      { label: "Refrigerante / carga", value: "R410A / 7.000 g" }, { label: "Nivel sonoro", value: "≤ 66 dB(A)" },
      { label: "Dimensiones", value: "854 × 854 × 1.920 mm" }, { label: "Peso neto", value: "340 kg" },
      { label: "Consumo eléctrico informado", value: "10,72 kWh" }, { label: "Compresores", value: "1" },
    ]
  },
] satisfies Omit<Product, "category">[];

const pool = [
  {
    slug: "piscina-1-compresor", name: "Bomba de calor para piscina · 1 compresor", shortName: "Piscina · 1 compresor", model: "DKFXRS-050H-HW",
    description: "Climatización de piscinas mediante recirculación, con temperatura de consigna nominal de 28 °C.",
    application: "Piscinas de hasta 32 m² con cobertor", image: "/images/productos/catalogo-08.webp", sourcePage: "Catálogo de productos, página 8",
    highlights: ["20,5 kW de capacidad térmica", "6 m³/h de recirculación", "28 °C de consigna"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "20,5 kW" },
      { label: "Potencia eléctrica nominal", value: "4,0 kW" }, { label: "Caudal de recirculación", value: "6 m³/h" },
      { label: "Temperatura de salida nominal", value: "28 °C" }, { label: "Refrigerante", value: "R410A" },
      { label: "Nivel sonoro", value: "≤ 60 dB(A)" }, { label: "Dimensiones", value: "750 × 750 × 1.100 mm" },
      { label: "Peso neto", value: "150 kg" }, { label: "Superficie orientativa", value: "32 m² con cobertor" },
    ]
  },
  {
    slug: "piscina-2-compresores", name: "Bomba de calor para piscina · 2 compresores", shortName: "Piscina · 2 compresores", model: "DKFXRS-100H-HW",
    description: "Mayor capacidad para climatización de piscinas, integrada al circuito de filtración y recirculación.",
    application: "Piscinas de hasta 72 m² con cobertor", image: "/images/productos/catalogo-09.webp", sourcePage: "Catálogo de productos, página 9",
    highlights: ["45 kW de capacidad térmica", "12,9 m³/h de recirculación", "2 compresores"],
    specs: [
      { label: "Alimentación", value: "380 V / 3N / 50 Hz" }, { label: "Capacidad térmica nominal", value: "45 kW" },
      { label: "Potencia eléctrica nominal", value: "8,2 kW" }, { label: "Caudal de recirculación", value: "12,9 m³/h" },
      { label: "Temperatura de salida nominal", value: "28 °C" }, { label: "Refrigerante", value: "R410A" },
      { label: "Nivel sonoro", value: "≤ 66 dB(A)" }, { label: "Dimensiones", value: "1.500 × 700 × 1.100 mm" },
      { label: "Peso neto", value: "280 kg" }, { label: "Superficie orientativa", value: "72 m² con cobertor" },
    ]
  },
] satisfies Omit<Product, "category">[];

const allInOneBenefits = ["Equipo compacto para circuitos de climatización.", "Compatible con radiadores y fancoils.", "Incluye estanque buffer presurizado, bomba de circulación y base galvanizada."];
const allInOne = [
  {
    slug: "all-in-one-5p-60l", name: "Bomba all-in-one 5P · buffer 60 L", shortName: "All-in-one · 60 L", model: "DKFXRS-050H",
    description: "Equipo de frío y calor con componentes hidráulicos integrados para circuitos de climatización.",
    application: "Superficie orientativa de 100–110 m²", image: "/images/productos/catalogo-10.webp", sourcePage: "Catálogo de productos, página 10",
    highlights: ["Buffer presurizado de 60 L", "Bomba Wilo PUN-201", "Frío y calor"],
    specs: [
      { label: "Aplicación", value: "Climatización frío / calor" }, { label: "Estanque buffer", value: "60 L, presurizado" },
      { label: "Bomba de circulación", value: "Wilo PUN-201" }, { label: "Base", value: "Acero galvanizado" },
      { label: "Dimensiones", value: "1.600 × 700 × 1.500 mm" }, { label: "Superficie orientativa", value: "100–110 m²" },
    ]
  },
  {
    slug: "all-in-one-5p-120l", name: "Bomba all-in-one 5P · buffer 120 L", shortName: "All-in-one · 120 L", model: "DKFXRS-080H",
    description: "Configuración all-in-one con mayor volumen de buffer para circuitos de climatización de frío y calor.",
    application: "Superficie orientativa de 150–160 m²", image: "/images/productos/catalogo-11.webp", sourcePage: "Catálogo de productos, página 11",
    highlights: ["Buffer presurizado de 120 L", "Bomba Wilo PUN-601", "Frío y calor"],
    specs: [
      { label: "Aplicación", value: "Climatización frío / calor" }, { label: "Estanque buffer", value: "120 L, presurizado" },
      { label: "Bomba de circulación", value: "Wilo PUN-601" }, { label: "Base", value: "Acero galvanizado" },
      { label: "Dimensiones", value: "1.800 × 700 × 1.800 mm" }, { label: "Superficie orientativa", value: "150–160 m²" },
    ]
  },
  {
    slug: "all-in-one-5p-150l", name: "Bomba all-in-one 5P · buffer 150 L", shortName: "All-in-one · 150 L", model: "DKFXRS-100H",
    description: "La configuración de mayor superficie orientativa de la línea all-in-one, con buffer y circulación integrados.",
    application: "Superficie orientativa de 200–220 m²", image: "/images/productos/catalogo-12.webp", sourcePage: "Catálogo de productos, página 12",
    highlights: ["Buffer presurizado de 150 L", "Bomba Wilo PUN-750", "Frío y calor"],
    specs: [
      { label: "Aplicación", value: "Climatización frío / calor" }, { label: "Estanque buffer", value: "150 L, presurizado" },
      { label: "Bomba de circulación", value: "Wilo PUN-750" }, { label: "Base", value: "Acero galvanizado" },
      { label: "Dimensiones", value: "2.400 × 1.000 × 1.900 mm" }, { label: "Superficie orientativa", value: "200–220 m²" },
    ]
  },
] satisfies Omit<Product, "category">[];

const tank: Product = {
  slug: "estanque-acero-inoxidable", name: "Estanques de acero inoxidable", shortName: "Acumulación inoxidable", model: "Formatos modular y armado",
  category: "acumulacion", description: "Acumulación abierta, sin presión, para proyectos de agua caliente sanitaria con bombas de calor. Disponible en formato modular para armar y cilíndrico armado.",
  application: "Acumulación sanitaria para proyectos ACS", image: "/images/productos/catalogo-14.webp", gallery: ["/images/productos/catalogo-14.webp", "/images/productos/catalogo-13.webp"], sourcePage: "Catálogo de productos, páginas 13 y 14",
  highlights: ["Acero inoxidable sanitario", "Aislación térmica", "Formatos para armar o armados"],
  specs: [
    { label: "Tipo", value: "Abierto, sin presión" }, { label: "Material", value: "Acero inoxidable sanitario" },
    { label: "Capacidades modulares", value: "1 / 2 / 3 / 5 / 10 m³" }, { label: "Modular 5 m³", value: "2,5 × 2 × 1 m" },
    { label: "Modular 10 m³", value: "2,5 × 2 × 2 m" }, { label: "Armado 5 m³", value: "Ø 1,75 × 2,4 m" },
    { label: "Armado 10 m³", value: "Ø 2,4 × 2,4 m" }, { label: "Aislación", value: "Aislación térmica" },
  ]
};

const baseProducts: Product[] = [
  ...horizontal.map((p) => ({ ...p, category: "acs-horizontal" as const })),
  ...vertical.map((p) => ({ ...p, category: "acs-vertical" as const })),
  ...pool.map((p) => ({ ...p, category: "piscina" as const })),
  ...allInOne.map((p) => ({ ...p, category: "climatizacion" as const })),
  tank,
];

export const products: Product[] = baseProducts.map((product) => ({ ...product, gallery: product.gallery ?? [product.image] }));

export const productBenefits = (product: Product) =>
  product.category === "climatizacion" ? allInOneBenefits :
  product.category === "acumulacion" ? ["Acumulación abierta para sistemas de ACS.", "Menor carga estructural que alternativas tradicionales, según el proyecto.", "Opciones para armado en sitio o entrega armada."] :
  product.category === "piscina" ? ["Climatización mediante recirculación.", "Compatible con filtración y circuito hidráulico existente.", "Dimensionamiento según volumen y condiciones de uso."] : acsBenefits;

export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
export const getCategory = (id: CategoryId) => categories.find((category) => category.id === id)!;
