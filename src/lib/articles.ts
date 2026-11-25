export type TechnicalArticle = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  source: string;
  sections: { heading: string; paragraphs: string[]; bullets?: string[] }[];
};

export const technicalArticles: TechnicalArticle[] = [
  {
    slug: "bomba-de-calor-no-es-caldera",
    title: "Por qué una bomba de calor no se instala como una caldera",
    description: "Diferencias de operación, acumulación y control que un edificio debe considerar antes de modernizar su sistema de agua caliente.",
    eyebrow: "Fundamentos para edificios",
    source: "Catálogo de productos Prosol y criterios técnicos aprobados en el documento maestro F0.",
    sections: [
      { heading: "Dos tecnologías, dos lógicas de operación", paragraphs: ["Una caldera y una bomba de calor pueden cumplir una función relacionada, pero no operan de la misma manera. Reemplazar un equipo sin revisar el sistema completo puede producir una instalación que no responde adecuadamente a la demanda.", "La evaluación debe considerar agua caliente sanitaria, horarios de consumo, acumulación, recirculación, espacio y condiciones eléctricas e hidráulicas."] },
      { heading: "La acumulación forma parte del diseño", paragraphs: ["El estanque permite relacionar la producción con la demanda de la comunidad. Su volumen, formato, aislación y conexión deben definirse según el proyecto, no como un accesorio elegido al final."], bullets: ["Revisar el consumo real y las horas punta.", "Coordinar equipo, acumulación y recirculación.", "Verificar el espacio y la carga estructural.", "Definir controles y puesta en marcha."] },
      { heading: "La puesta en marcha también es ingeniería", paragraphs: ["El resultado depende de la instalación y de la configuración. Prosol acompaña el montaje, la verificación y la explicación al equipo del edificio según el alcance acordado. La experiencia previa no elimina la necesidad de evaluar cada nuevo edificio."] },
    ],
  },
  {
    slug: "acumulacion-y-recirculacion-acs",
    title: "Acumulación y recirculación en un sistema de ACS",
    description: "Qué función cumplen los estanques y la recirculación en una solución centralizada de agua caliente sanitaria para edificios.",
    eyebrow: "Diseño hidráulico",
    source: "Catálogo de productos Prosol, páginas 2 a 7, 13 y 14.",
    sections: [
      { heading: "Acumular para responder a la demanda", paragraphs: ["En un sistema centralizado, la acumulación permite mantener un volumen de agua caliente disponible para las condiciones de uso del edificio. El dimensionamiento debe considerar el consumo y la capacidad de producción, sin extrapolar una configuración desde otro proyecto."] },
      { heading: "Estanques abiertos y sin presión", paragraphs: ["El catálogo V1 contempla estanques sanitarios de acero inoxidable, abiertos y sin presión, con aislación térmica. Existen formatos modulares para armar en terreno y formatos cilíndricos armados."], bullets: ["Formato modular: facilita la logística y el armado en sala técnica o azotea.", "Formato armado: reduce el trabajo de ensamblaje en terreno.", "La alternativa final depende del diseño hidráulico y de las condiciones de instalación."] },
      { heading: "Recirculación y continuidad", paragraphs: ["La recirculación debe integrarse al diseño para que el sistema responda a la operación esperada. Su configuración, controles y puesta en marcha requieren revisión profesional junto con el resto de los componentes."] },
    ],
  },
  {
    slug: "monitoreo-remoto-edificios",
    title: "Qué se necesita para monitorear un sistema en un edificio",
    description: "Equipamiento compatible, conectividad y un protocolo de escalamiento: condiciones para aprovechar el monitoreo remoto sin promesas universales.",
    eyebrow: "Continuidad operativa",
    source: "Requisitos técnicos aprobados en el documento maestro F0 y notas vigentes del proyecto.",
    sections: [
      { heading: "El monitoreo depende de la instalación", paragraphs: ["No todos los sistemas entregan los mismos datos. Para revisar información a distancia se requiere equipamiento compatible, conectividad a internet en la sala técnica y un servicio que defina qué parámetros se revisan y cómo se actúa ante una anomalía."] },
      { heading: "Menos desplazamientos innecesarios", paragraphs: ["Cuando esas condiciones están disponibles, el equipo autorizado puede revisar reportes sin depender exclusivamente de una inspección presencial. Esto puede orientar la conversación con conserjería o mayordomía y ayudar a decidir si una visita es necesaria."], bullets: ["Revisar el antecedente o la alerta.", "Confirmar las condiciones con el edificio.", "Intentar orientación a distancia cuando sea seguro.", "Coordinar una visita si el problema no se resuelve."] },
      { heading: "Una función acotada, no una promesa automática", paragraphs: ["La velocidad de respuesta y las funciones disponibles dependen de los equipos, la conectividad y el alcance contratado. Por ello Prosol no comunica un porcentaje universal de mejora ni promete resolución remota para toda anomalía."] },
    ],
  },
];

export const getTechnicalArticle = (slug: string) => technicalArticles.find((article) => article.slug === slug);
