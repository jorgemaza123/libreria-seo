export type SearchIntent = "transactional" | "commercial" | "informational" | "local";
export type OpportunityTier = 1 | 2 | 3;
export type PageStatus = "published" | "planned" | "research";

export interface SchoolWorkPage {
  slug: string;
  tier: OpportunityTier;
  intent: SearchIntent[];
  updatedAt: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  lead: string;
  directAnswer: string;
  primaryCta: string;
  quoteType: string;
  servicesTitle: string;
  servicesIntro: string;
  services: Array<{
    title: string;
    description: string;
    href?: string;
  }>;
  topicsTitle: string;
  topicGroups: Array<{
    title: string;
    items: string[];
  }>;
  guideTitle: string;
  guideIntro: string;
  guideSteps: Array<{
    title: string;
    description: string;
  }>;
  requirements: string[];
  levels: Array<{
    title: string;
    description: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedSlugs: string[];
}

export const schoolWorkPages: Record<string, SchoolWorkPage> = {
  "trabajos-escolares": {
    slug: "trabajos-escolares",
    tier: 1,
    intent: ["commercial", "transactional", "local"],
    updatedAt: "2026-10-15",
    metaTitle: "Trabajos escolares por encargo en Lima",
    metaDescription:
      "Cotiza maquetas, lapbooks, trípticos, paneles y material para exposiciones escolares en Lima. Envíanos el tema y la fecha por WhatsApp.",
    eyebrow: "Trabajos escolares en Lima",
    h1: "Material para trabajos escolares, listo para explicar y presentar",
    lead:
      "Ayudamos a estudiantes y familias a preparar la parte visual y material de maquetas, exposiciones, proyectos, lapbooks, trípticos e impresiones.",
    directAnswer:
      "Puedes cotizar enviando el tipo de trabajo, tema, curso, nivel, fecha y una foto de la indicación del colegio. Confirmamos qué podemos preparar, el tiempo disponible y la forma de recojo o entrega antes de empezar.",
    primaryCta: "Cotizar mi trabajo escolar",
    quoteType: "Trabajo escolar",
    servicesTitle: "¿Qué trabajo necesitas preparar?",
    servicesIntro:
      "Empieza por el formato que te pidieron. Cada opción conduce a una página con ejemplos de alcance, datos necesarios y una cotización más precisa.",
    services: [
      {
        title: "Maquetas escolares",
        description: "Modelos de ciencia, geografía, historia, ambiente y estructuras.",
        href: "/maquetas-escolares-lima",
      },
      {
        title: "Día del Logro",
        description: "Material visual para demostrar un aprendizaje y exponerlo con claridad.",
        href: "/dia-del-logro",
      },
      {
        title: "Proyectos de ciencia",
        description: "Apoyo material para prototipos, paneles, informes e impresión del proyecto.",
        href: "/proyectos-de-ciencia",
      },
      {
        title: "Material para exposiciones",
        description: "Paneles, papelotes, rótulos, líneas de tiempo, mapas e infografías.",
        href: "/material-para-exposiciones",
      },
      {
        title: "Lapbooks escolares",
        description: "Libro desplegable, secciones, bolsillos, piezas móviles e impresión.",
        href: "/lapbooks-escolares",
      },
      {
        title: "Trípticos escolares",
        description: "Organización, diseño e impresión de información para una exposición.",
        href: "/tripticos-escolares",
      },
    ],
    topicsTitle: "Organiza el pedido por necesidad",
    topicGroups: [
      {
        title: "Tengo que explicar un tema",
        items: ["Panel o papelote", "Mapa conceptual", "Infografía", "Línea de tiempo"],
      },
      {
        title: "Tengo que mostrar cómo funciona",
        items: ["Maqueta", "Prototipo", "Experimento", "Modelo didáctico"],
      },
      {
        title: "Tengo que entregar material impreso",
        items: ["Tríptico", "Informe", "Fichas", "Rótulos y recortables"],
      },
    ],
    guideTitle: "Cómo pedir un trabajo sin perder tiempo",
    guideIntro:
      "La cotización mejora cuando conocemos el objetivo de aprendizaje y la indicación exacta del docente.",
    guideSteps: [
      {
        title: "Envía la consigna",
        description: "Una foto o transcripción de lo que pidió el colegio evita interpretar mal el encargo.",
      },
      {
        title: "Indica nivel y curso",
        description: "El lenguaje, tamaño y cantidad de información cambian entre inicial, primaria y secundaria.",
      },
      {
        title: "Confirma fecha y entrega",
        description: "Primero validamos disponibilidad; no prometemos trabajos urgentes sin revisar el alcance.",
      },
    ],
    requirements: [
      "Tipo de trabajo o formato solicitado",
      "Tema, curso, grado y nivel",
      "Fecha de entrega y distrito",
      "Medidas, cantidad y referencia si existen",
    ],
    levels: [
      {
        title: "Inicial y primaria",
        description: "Material claro, visual, manipulable y con textos breves que el estudiante pueda comprender.",
      },
      {
        title: "Secundaria",
        description: "Presentación más académica, jerarquía de información, fuentes y apoyo para una exposición ordenada.",
      },
    ],
    faqs: [
      {
        question: "¿Qué tipos de trabajos escolares pueden cotizarse?",
        answer:
          "Maquetas, lapbooks, trípticos, paneles, papelotes, líneas de tiempo, material para exposiciones, impresiones y apoyo visual para proyectos. La disponibilidad depende del tema, tamaño y fecha.",
      },
      {
        question: "¿Hacen trabajos para primaria y secundaria?",
        answer:
          "Sí. Adaptamos la cantidad de texto, complejidad visual y materiales al nivel indicado por el colegio.",
      },
      {
        question: "¿Puedo enviar una foto de la indicación por WhatsApp?",
        answer:
          "Sí. Es la forma más rápida de entender el pedido y evitar que tengas que escribir nuevamente todos los requisitos.",
      },
    ],
    relatedSlugs: ["dia-del-logro", "maquetas-escolares-lima", "proyectos-de-ciencia", "material-para-exposiciones"],
  },

  "dia-del-logro": {
    slug: "dia-del-logro",
    tier: 1,
    intent: ["commercial", "informational", "transactional"],
    updatedAt: "2026-10-15",
    metaTitle: "Día del Logro: maquetas y material para exponer",
    metaDescription:
      "Prepara maquetas, paneles, lapbooks, trípticos, rótulos e impresiones para el Día o Semana del Logro. Cotiza tu material escolar en Lima.",
    eyebrow: "Campaña Día y Semana del Logro",
    h1: "Material para presentar tus aprendizajes en el Día del Logro",
    lead:
      "Organizamos el apoyo visual que acompaña la explicación del estudiante: maquetas, paneles, lapbooks, trípticos, rótulos, recortables e impresiones.",
    directAnswer:
      "El Día del Logro es una presentación de los aprendizajes alcanzados. El material debe ayudar a explicar qué se aprendió, cómo se trabajó y qué evidencia se mostrará; no debe reemplazar la participación del estudiante.",
    primaryCta: "Preparar mi material",
    quoteType: "Día del Logro",
    servicesTitle: "Elige lo que tienes que presentar",
    servicesIntro:
      "No todos necesitan el mismo producto. Empieza por la tarea que debes resolver durante la exposición.",
    services: [
      {
        title: "Tengo que hacer una maqueta",
        description: "Modelo visual para ciencia, ambiente, geografía, historia o tecnología.",
        href: "/maquetas-escolares-lima",
      },
      {
        title: "Tengo que explicar un tema",
        description: "Panel, papelote, mapa conceptual, línea de tiempo o infografía.",
        href: "/material-para-exposiciones",
      },
      {
        title: "Tengo que presentar un proyecto",
        description: "Prototipo, panel explicativo, informe, rótulos y material impreso.",
        href: "/proyectos-de-ciencia",
      },
      {
        title: "Tengo que preparar un stand",
        description: "Carteles, títulos, fichas, decoración funcional y piezas para la mesa.",
      },
      {
        title: "Necesito un lapbook",
        description: "Contenido desplegable, bolsillos y secciones para explicar un aprendizaje.",
        href: "/lapbooks-escolares",
      },
      {
        title: "Necesito impresiones y rótulos",
        description: "Textos, imágenes, etiquetas, recortables, fichas e informes.",
        href: "/impresion-de-trabajos-y-pdf-por-whatsapp",
      },
    ],
    topicsTitle: "Material que suele acompañar una presentación",
    topicGroups: [
      {
        title: "Demostración visual",
        items: ["Maqueta", "Modelo didáctico", "Prototipo", "Experimento"],
      },
      {
        title: "Explicación",
        items: ["Panel", "Lapbook", "Tríptico", "Infografía", "Mapa conceptual"],
      },
      {
        title: "Organización del stand",
        items: ["Rótulos", "Fichas", "Recortables", "Títulos", "Impresiones"],
      },
    ],
    guideTitle: "Qué debe incluir una buena presentación del Día del Logro",
    guideIntro:
      "La presentación funciona mejor cuando el material visual sigue el mismo orden que la explicación oral.",
    guideSteps: [
      {
        title: "Aprendizaje principal",
        description: "Una frase clara debe explicar qué competencia, tema o conclusión se mostrará.",
      },
      {
        title: "Evidencia comprensible",
        description: "La maqueta, panel o proyecto debe permitir señalar partes y explicar relaciones, no solo decorar.",
      },
      {
        title: "Recorrido breve",
        description: "Ordena inicio, desarrollo y conclusión para que el estudiante pueda presentar sin memorizar párrafos largos.",
      },
    ],
    requirements: [
      "Tema o aprendizaje que se presentará",
      "Área, nivel, grado y formato solicitado",
      "Medidas del panel, mesa o maqueta",
      "Fecha del evento y distrito",
    ],
    levels: [
      {
        title: "Primaria",
        description: "Textos cortos, piezas visuales y una secuencia sencilla que facilite explicar con sus propias palabras.",
      },
      {
        title: "Secundaria",
        description: "Mayor precisión conceptual, evidencias, proceso, resultados y una presentación visual menos infantil.",
      },
    ],
    faqs: [
      {
        question: "¿Día del Logro y Semana del Logro son lo mismo?",
        answer:
          "Las instituciones pueden usar ambos nombres y organizar uno o varios días, pero la necesidad del estudiante suele ser la misma: mostrar aprendizajes mediante una exposición y evidencias. Por eso esta página cubre ambas variantes.",
      },
      {
        question: "¿Qué puedo presentar en el Día del Logro?",
        answer:
          "Depende del área y de la indicación del docente. Son frecuentes las maquetas, experimentos, proyectos, paneles, lapbooks, organizadores visuales, informes y material impreso.",
      },
      {
        question: "¿Pueden preparar todo un stand escolar?",
        answer:
          "Podemos cotizar las piezas visuales y materiales que realmente ofrecemos. Para confirmar alcance, medidas y tiempo necesitamos una foto de la indicación y la fecha del evento.",
      },
    ],
    relatedSlugs: ["trabajos-escolares", "maquetas-escolares-lima", "proyectos-de-ciencia", "material-para-exposiciones"],
  },

  "maquetas-escolares-lima": {
    slug: "maquetas-escolares-lima",
    tier: 1,
    intent: ["transactional", "commercial", "local", "informational"],
    updatedAt: "2026-10-15",
    metaTitle: "Maquetas escolares por encargo en Lima",
    metaDescription:
      "Cotiza maquetas escolares de ciencia, geografía, historia, ambiente y tecnología en Lima. Envíanos tema, medidas, nivel y fecha por WhatsApp.",
    eyebrow: "Maquetas escolares en Lima",
    h1: "Maquetas escolares por encargo, organizadas para poder exponer",
    lead:
      "Preparamos maquetas y modelos visuales según el tema, nivel, medidas y fecha disponibles. El estudiante recibe una estructura clara para reconocer y explicar sus partes.",
    directAnswer:
      "Para cotizar una maqueta necesitamos el tema exacto, grado, tamaño aproximado, indicación del docente, fecha y distrito. Con esos datos confirmamos materiales, alcance y disponibilidad; no asumimos entregas urgentes sin revisar el pedido.",
    primaryCta: "Cotizar mi maqueta",
    quoteType: "Maqueta escolar",
    servicesTitle: "Tipos de maquetas que puedes consultar",
    servicesIntro:
      "Agrupamos los temas por área para evitar decenas de páginas repetidas. Si tu tema no aparece, envía la indicación y lo revisamos.",
    services: [
      {
        title: "Ciencia y cuerpo humano",
        description: "Sistemas del cuerpo, células, ADN, cadena alimenticia, ciclo del agua y energía.",
      },
      {
        title: "Geografía y territorio",
        description: "Costa, sierra y selva; relieves, regiones naturales, cuencas y mapa del Perú.",
      },
      {
        title: "Historia y culturas del Perú",
        description: "Caral, Chavín, Paracas, Nazca, Mochica, Chimú, Inca y representaciones históricas.",
      },
      {
        title: "Ambiente y reciclaje",
        description: "Ecosistemas, contaminación, cuidado del agua, reciclaje y áreas naturales.",
      },
      {
        title: "Tecnología y estructuras",
        description: "Puentes, casas, ciudades, circuitos, máquinas simples y prototipos.",
      },
      {
        title: "Dioramas y escenas",
        description: "Representaciones tridimensionales de hábitats, paisajes, épocas o situaciones.",
      },
    ],
    topicsTitle: "Temas frecuentes sin crear páginas vacías",
    topicGroups: [
      {
        title: "Ciencias",
        items: ["Sistema digestivo", "Sistema respiratorio", "Célula animal y vegetal", "ADN", "Sistema solar"],
      },
      {
        title: "Perú, geografía e historia",
        items: ["Regiones naturales", "Relieve", "Culturas preincas", "Imperio inca", "Paisajes del Perú"],
      },
      {
        title: "Tecnología y ambiente",
        items: ["Energía", "Reciclaje", "Contaminación", "Circuitos", "Máquinas simples"],
      },
    ],
    guideTitle: "Qué debe incluir una buena maqueta escolar",
    guideIntro:
      "Una maqueta útil no es solo decorativa: debe representar las partes importantes y permitir seguir una explicación.",
    guideSteps: [
      {
        title: "Título y objetivo",
        description: "El observador debe comprender de inmediato qué representa la maqueta y para qué se elaboró.",
      },
      {
        title: "Partes identificables",
        description: "Rótulos legibles, colores consistentes y una escala visual ayudan a señalar cada elemento.",
      },
      {
        title: "Explicación propia",
        description: "El estudiante debe reconocer el recorrido, proceso o relación que muestra el modelo.",
      },
    ],
    requirements: [
      "Foto o texto de la indicación del docente",
      "Tema, curso, grado y nivel",
      "Medidas o espacio disponible",
      "Fecha de entrega, distrito y referencia visual",
    ],
    levels: [
      {
        title: "Maquetas para primaria",
        description: "Formas claras, etiquetas grandes y una explicación breve centrada en conceptos esenciales.",
      },
      {
        title: "Maquetas para secundaria",
        description: "Mayor detalle conceptual, relaciones entre partes y presentación visual más técnica.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta una maqueta escolar?",
        answer:
          "El precio depende del tamaño, tema, nivel de detalle, materiales y tiempo disponible. Enviar la indicación y una medida aproximada permite cotizar sin inventar un precio genérico.",
      },
      {
        question: "¿Hacen maquetas urgentes para mañana?",
        answer:
          "Puedes consultar disponibilidad, pero primero revisamos complejidad, tamaño y carga de trabajo. No confirmamos una entrega urgente automáticamente.",
      },
      {
        question: "¿La maqueta incluye rótulos o material para exponer?",
        answer:
          "Puede cotizarse con rótulos, fichas, tríptico o panel complementario cuando el pedido lo requiera.",
      },
    ],
    relatedSlugs: ["trabajos-escolares", "dia-del-logro", "proyectos-de-ciencia", "material-para-exposiciones"],
  },

  "proyectos-de-ciencia": {
    slug: "proyectos-de-ciencia",
    tier: 1,
    intent: ["commercial", "informational", "transactional"],
    updatedAt: "2026-10-15",
    metaTitle: "Proyectos de ciencia: material y presentación escolar",
    metaDescription:
      "Apoyo material para proyectos y ferias de ciencia: prototipo, maqueta, panel, informe, tríptico y rótulos. Cotiza en Lima por WhatsApp.",
    eyebrow: "Proyectos y feria de ciencias",
    h1: "Material para proyectos de ciencia y exposiciones escolares",
    lead:
      "Ayudamos con la presentación física y visual del proyecto: maqueta o prototipo, panel explicativo, impresión del informe, rótulos y material para el stand.",
    directAnswer:
      "Un proyecto de ciencia debe partir de una pregunta, indagación o problema y mostrar proceso, evidencia y conclusión. Podemos preparar material de apoyo, pero los datos, resultados y explicación deben corresponder al trabajo real del estudiante.",
    primaryCta: "Cotizar material del proyecto",
    quoteType: "Proyecto de ciencia",
    servicesTitle: "Apoyo que puedes solicitar",
    servicesIntro:
      "Cotiza una pieza concreta o un conjunto coherente para la presentación. No añadimos resultados ni afirmaciones que el proyecto no haya demostrado.",
    services: [
      { title: "Maqueta o prototipo", description: "Representación del fenómeno, solución tecnológica o funcionamiento." },
      { title: "Panel explicativo", description: "Problema, objetivo, proceso, resultados y conclusión en una lectura ordenada." },
      { title: "Informe impreso", description: "Impresión, ordenado, carátula, anexos y acabado del documento entregado." },
      { title: "Tríptico o ficha", description: "Resumen breve para visitantes, jurado o comunidad educativa." },
      { title: "Rótulos y recortables", description: "Títulos, etiquetas, leyendas, imágenes y piezas para el stand." },
      { title: "Material para exposición", description: "Organización visual de la mesa y apoyo para explicar el proyecto." },
    ],
    topicsTitle: "Tipos de proyecto que requieren materiales diferentes",
    topicGroups: [
      {
        title: "Indagación científica",
        items: ["Pregunta investigable", "Variables", "Registro de datos", "Resultados", "Conclusión"],
      },
      {
        title: "Solución tecnológica",
        items: ["Problema", "Diseño", "Prototipo", "Prueba", "Mejora"],
      },
      {
        title: "Indagación social",
        items: ["Pregunta", "Fuentes", "Evidencias", "Interpretación", "Hallazgos"],
      },
    ],
    guideTitle: "Cómo presentar un proyecto de ciencia con claridad",
    guideIntro:
      "La Feria Escolar Nacional de Ciencia y Tecnología Eureka diferencia proyectos de indagación y soluciones tecnológicas; el material visual debe respetar el tipo de proyecto.",
    guideSteps: [
      { title: "Define qué se investigó", description: "Presenta una pregunta o problema concreto y evita títulos demasiado amplios." },
      { title: "Muestra el proceso", description: "Incluye materiales, procedimiento, pruebas y cambios realizados, no solo el resultado final." },
      { title: "Separa evidencia de opinión", description: "Los datos y conclusiones deben coincidir con el registro real del proyecto." },
    ],
    requirements: [
      "Tipo de proyecto y tema",
      "Indicación o rúbrica del colegio",
      "Material ya desarrollado por el estudiante",
      "Formato, medidas, fecha y distrito",
    ],
    levels: [
      {
        title: "Primaria",
        description: "Secuencia visual simple, datos comprensibles y énfasis en explicar qué se observó o construyó.",
      },
      {
        title: "Secundaria",
        description: "Problema, sustento, método, evidencia, limitaciones y resultados presentados con mayor rigor.",
      },
    ],
    faqs: [
      {
        question: "¿Hacen experimentos escolares?",
        answer:
          "Podemos cotizar materiales visuales, modelos o prototipos dentro de lo que realmente ofrecemos. La viabilidad y seguridad del experimento deben revisarse según la indicación del docente.",
      },
      {
        question: "¿Pueden imprimir el informe y preparar el panel?",
        answer:
          "Sí, puedes enviar el archivo y las medidas solicitadas. Revisamos impresión, organización visual, rótulos y acabado por separado o como conjunto.",
      },
      {
        question: "¿Esto sirve para la feria Eureka?",
        answer:
          "El material puede apoyar la presentación, pero el proyecto debe respetar las bases vigentes de la institución o convocatoria y reflejar el trabajo real del estudiante.",
      },
    ],
    relatedSlugs: ["trabajos-escolares", "maquetas-escolares-lima", "dia-del-logro", "material-para-exposiciones"],
  },

  "material-para-exposiciones": {
    slug: "material-para-exposiciones",
    tier: 1,
    intent: ["transactional", "commercial", "informational"],
    updatedAt: "2026-10-15",
    metaTitle: "Material para exposiciones escolares en Lima",
    metaDescription:
      "Paneles, papelotes, líneas de tiempo, mapas conceptuales, infografías, rótulos e impresiones para exposiciones escolares en Lima.",
    eyebrow: "Exposiciones escolares",
    h1: "Material visual para explicar un tema sin llenar todo de texto",
    lead:
      "Preparamos piezas de apoyo para exposiciones: paneles, papelotes, organizadores visuales, líneas de tiempo, infografías, rótulos y material impreso.",
    directAnswer:
      "El mejor material para exponer resume ideas, ordena la explicación y permite señalar datos o imágenes. Debe leerse a distancia y apoyar al estudiante, no convertirse en un documento pegado en la pared.",
    primaryCta: "Cotizar mi material de exposición",
    quoteType: "Material para exposición",
    servicesTitle: "Formatos que puedes cotizar",
    servicesIntro: "Elige según la forma en que necesitas explicar el tema y el espacio disponible.",
    services: [
      { title: "Panel explicativo", description: "Secciones ordenadas para problema, desarrollo, evidencias y conclusión." },
      { title: "Papelote o mural", description: "Composición grande para exposición en aula, pasillo o stand." },
      { title: "Línea de tiempo", description: "Hechos, etapas o procesos organizados cronológicamente." },
      { title: "Mapa mental o conceptual", description: "Ideas principales, conexiones, jerarquías y palabras enlace." },
      { title: "Infografía", description: "Datos e ideas condensados con apoyo de iconos, cifras e imágenes." },
      { title: "Rótulos y recortables", description: "Títulos, etiquetas, leyendas e imágenes listas para colocar." },
    ],
    topicsTitle: "Qué formato conviene según el contenido",
    topicGroups: [
      { title: "Orden cronológico", items: ["Línea de tiempo", "Secuencia", "Proceso", "Etapas"] },
      { title: "Relaciones entre ideas", items: ["Mapa conceptual", "Mapa mental", "Cuadro comparativo"] },
      { title: "Presentación de resultados", items: ["Panel", "Infografía", "Gráficos", "Conclusiones"] },
    ],
    guideTitle: "Cómo organizar información para una exposición",
    guideIntro: "Primero se decide qué debe entender el público; después se elige el formato y el diseño.",
    guideSteps: [
      { title: "Una idea por bloque", description: "Evita párrafos extensos y separa definición, ejemplos, datos y conclusión." },
      { title: "Jerarquía visible", description: "Título, subtítulos y palabras clave deben distinguirse incluso a cierta distancia." },
      { title: "Apoyo para hablar", description: "El estudiante debe poder mirar el material, ubicar una idea y continuar la explicación." },
    ],
    requirements: [
      "Tema y texto o información aprobada",
      "Formato solicitado por el docente",
      "Medidas, orientación y cantidad",
      "Curso, nivel, fecha y distrito",
    ],
    levels: [
      { title: "Primaria", description: "Imágenes claras, títulos grandes, vocabulario breve y elementos fáciles de señalar." },
      { title: "Secundaria", description: "Más datos y relaciones, pero con síntesis, fuentes y una composición sobria." },
    ],
    faqs: [
      { question: "¿Qué diferencia hay entre panel, mural y papelote?", answer: "El panel suele organizar información por secciones; el mural puede integrar una composición más libre y visual; papelote describe principalmente el soporte grande usado en aula. El formato final depende de la indicación y medidas." },
      { question: "¿Pueden hacer una línea de tiempo o mapa conceptual?", answer: "Sí, siempre que envíes el tema, la información base y el tamaño requerido. Podemos cotizar diseño, impresión y acabado." },
      { question: "¿Puedo pedir solo rótulos e imágenes?", answer: "Sí. Indica medidas, textos, cantidad y si necesitas las piezas impresas, recortadas o listas para colocar." },
    ],
    relatedSlugs: ["trabajos-escolares", "dia-del-logro", "lapbooks-escolares", "tripticos-escolares"],
  },

  "lapbooks-escolares": {
    slug: "lapbooks-escolares",
    tier: 1,
    intent: ["commercial", "informational", "transactional"],
    updatedAt: "2026-10-15",
    metaTitle: "Lapbooks escolares por encargo en Lima",
    metaDescription:
      "Cotiza lapbooks escolares para primaria y secundaria. Organización del tema, piezas desplegables, bolsillos, impresión y acabado en Lima.",
    eyebrow: "Lapbooks para primaria y secundaria",
    h1: "Lapbooks escolares que organizan el tema de forma visual y desplegable",
    lead:
      "Preparamos la estructura, piezas móviles, bolsillos, rótulos e impresiones de un lapbook según el tema, nivel y formato solicitado.",
    directAnswer:
      "Un lapbook es un material desplegable que reúne información breve en secciones, solapas, bolsillos y piezas móviles. Funciona mejor cuando cada elemento responde una pregunta concreta del tema.",
    primaryCta: "Cotizar mi lapbook",
    quoteType: "Lapbook escolar",
    servicesTitle: "Partes que puede incluir un lapbook",
    servicesIntro: "La cantidad de piezas depende del tema y del nivel; no es necesario llenar cada espacio.",
    services: [
      { title: "Portada y título", description: "Tema reconocible, curso y presentación visual coherente." },
      { title: "Solapas", description: "Definiciones, preguntas, características o datos que se descubren al abrir." },
      { title: "Bolsillos y fichas", description: "Tarjetas, ejemplos, vocabulario, personajes o conceptos relacionados." },
      { title: "Línea de tiempo", description: "Etapas o hechos en formato plegable cuando el tema lo requiere." },
      { title: "Imágenes y recortables", description: "Piezas impresas y organizadas para reforzar la explicación." },
      { title: "Guía de recorrido", description: "Orden sugerido para que el estudiante pueda presentar cada sección." },
    ],
    topicsTitle: "Temas que se adaptan bien al formato",
    topicGroups: [
      { title: "Ciencia", items: ["Cuerpo humano", "Ecosistemas", "Ciclo del agua", "Animales y plantas"] },
      { title: "Personal Social e historia", items: ["Culturas del Perú", "Regiones", "Personajes", "Hechos históricos"] },
      { title: "Comunicación", items: ["Obra literaria", "Autor", "Tipos de texto", "Plan lector"] },
    ],
    guideTitle: "Cómo hacer que un lapbook sea fácil de explicar",
    guideIntro: "El orden importa más que la cantidad de adornos o piezas móviles.",
    guideSteps: [
      { title: "Define preguntas", description: "Cada solapa puede responder qué es, cómo funciona, cuáles son sus partes o por qué es importante." },
      { title: "Resume antes de diseñar", description: "Convierte párrafos en ideas breves, listas, comparaciones o secuencias." },
      { title: "Ensaya el recorrido", description: "Abre las piezas en el mismo orden en que se explicará el tema." },
    ],
    requirements: ["Tema e indicación del docente", "Curso, grado y nivel", "Tamaño abierto o tipo de base", "Fecha, distrito y referencia si existe"],
    levels: [
      { title: "Primaria", description: "Piezas grandes, textos breves, color funcional y secciones fáciles de manipular." },
      { title: "Secundaria", description: "Más síntesis conceptual, comparaciones y datos, con un acabado menos infantil." },
    ],
    faqs: [
      { question: "¿Qué es un lapbook escolar?", answer: "Es un libro o carpeta desplegable que organiza un tema mediante solapas, bolsillos, fichas, imágenes y otros elementos interactivos." },
      { question: "¿Un lapbook es igual que un tríptico?", answer: "No. Ambos pueden plegarse, pero el lapbook suele ser interactivo y tener piezas internas; el tríptico organiza información en seis caras impresas o diseñadas." },
      { question: "¿Pueden prepararlo con un tema específico?", answer: "Sí. Envía la indicación, el contenido disponible, nivel, tamaño y fecha para revisar qué estructura conviene." },
    ],
    relatedSlugs: ["trabajos-escolares", "dia-del-logro", "material-para-exposiciones", "tripticos-escolares"],
  },

  "tripticos-escolares": {
    slug: "tripticos-escolares",
    tier: 1,
    intent: ["commercial", "informational", "transactional"],
    updatedAt: "2026-10-15",
    metaTitle: "Trípticos escolares: diseño e impresión en Lima",
    metaDescription:
      "Cotiza diseño e impresión de trípticos escolares para exposiciones, proyectos y Día del Logro. Envíanos tema, cantidad y fecha.",
    eyebrow: "Trípticos para trabajos escolares",
    h1: "Trípticos escolares con información ordenada y lista para presentar",
    lead:
      "Organizamos el contenido en portada, secciones interiores y cierre; luego cotizamos diseño, impresión y cantidad según tu fecha.",
    directAnswer:
      "Un tríptico tiene seis caras. Debe incluir una portada clara, contenido resumido en secciones, imágenes útiles y una cara final con conclusión, fuentes o datos del estudiante según la indicación.",
    primaryCta: "Cotizar mi tríptico",
    quoteType: "Tríptico escolar",
    servicesTitle: "Qué podemos preparar",
    servicesIntro: "Puedes solicitar el trabajo completo o solo la parte que te falta.",
    services: [
      { title: "Organización del contenido", description: "Jerarquía de títulos, resumen y distribución de las seis caras." },
      { title: "Diseño visual", description: "Tipografía, colores, imágenes y lectura adecuada al nivel." },
      { title: "Impresión", description: "Cantidad, tipo de papel y acabado según disponibilidad." },
      { title: "Plegado", description: "Entrega doblada cuando el formato y cantidad lo permitan." },
      { title: "Versión para exposición", description: "Texto breve que acompaña la explicación oral y no la reemplaza." },
      { title: "Archivo listo", description: "Revisión del archivo enviado antes de imprimir, cuando corresponda." },
    ],
    topicsTitle: "Usos escolares frecuentes",
    topicGroups: [
      { title: "Exposición", items: ["Resumen del tema", "Conceptos clave", "Ejemplos", "Conclusión"] },
      { title: "Proyecto", items: ["Problema", "Objetivo", "Proceso", "Resultados"] },
      { title: "Campaña escolar", items: ["Prevención", "Cuidado ambiental", "Salud", "Convivencia"] },
    ],
    guideTitle: "Qué partes lleva un tríptico escolar",
    guideIntro: "La distribución puede variar, pero estas seis funciones evitan repetir información.",
    guideSteps: [
      { title: "Portada", description: "Título, imagen principal y datos que el docente haya solicitado." },
      { title: "Desarrollo interior", description: "Tres caras para definición, explicación, ejemplos, proceso o datos." },
      { title: "Cierre", description: "Conclusión, recomendación, fuentes o contacto según el propósito del trabajo." },
    ],
    requirements: ["Tema y contenido base", "Curso, grado y nivel", "Cantidad, tamaño y tipo de impresión", "Fecha y distrito"],
    levels: [
      { title: "Primaria", description: "Texto corto, imágenes grandes y una idea principal por sección." },
      { title: "Secundaria", description: "Mayor densidad informativa, fuentes y diseño sobrio sin perder legibilidad." },
    ],
    faqs: [
      { question: "¿Cuántas caras tiene un tríptico?", answer: "Tiene seis caras: tres por cada lado de la hoja. La portada, contraportada y solapa exterior forman un lado; el desarrollo principal suele ocupar el interior." },
      { question: "¿Pueden imprimir varias copias?", answer: "Sí. Indica cantidad, tamaño, tipo de papel y fecha para confirmar disponibilidad y precio." },
      { question: "¿Puedo enviar mi archivo ya diseñado?", answer: "Sí. Antes de imprimir revisamos medidas, orientación y márgenes básicos; los cambios de contenido o rediseño se cotizan aparte." },
    ],
    relatedSlugs: ["trabajos-escolares", "dia-del-logro", "material-para-exposiciones", "lapbooks-escolares"],
  },
};

export const searchArchitecture = [
  { cluster: "Trabajos escolares", owner: "/trabajos-escolares", tier: 1, status: "published", intent: "commercial" },
  { cluster: "Día y Semana del Logro", owner: "/dia-del-logro", tier: 1, status: "published", intent: "commercial" },
  { cluster: "Maquetas escolares Lima", owner: "/maquetas-escolares-lima", tier: 1, status: "published", intent: "local" },
  { cluster: "Proyectos y feria de ciencias", owner: "/proyectos-de-ciencia", tier: 1, status: "published", intent: "commercial" },
  { cluster: "Exposiciones, paneles y organizadores", owner: "/material-para-exposiciones", tier: 1, status: "published", intent: "commercial" },
  { cluster: "Lapbooks", owner: "/lapbooks-escolares", tier: 1, status: "published", intent: "commercial" },
  { cluster: "Trípticos", owner: "/tripticos-escolares", tier: 1, status: "published", intent: "commercial" },
  { cluster: "Guías de maquetas por tema", owner: null, tier: 2, status: "research", intent: "informational" },
  { cluster: "Feria Eureka", owner: "/proyectos-de-ciencia", tier: 2, status: "covered", intent: "informational" },
  { cluster: "Cierre del año escolar", owner: null, tier: 2, status: "planned", intent: "commercial" },
  { cluster: "Graduación y promoción", owner: null, tier: 3, status: "research", intent: "commercial" },
] as const;

export const publishedSchoolWorkSlugs = Object.keys(schoolWorkPages);
