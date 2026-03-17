export interface SeoPageData {
  slug: string;
  h1Title: string;
  subtitle: string;
  painPoints: string[];
  whatsappMessage: string;
  metaTitle: string;
  metaDescription: string;
  categoryHint: "utiles" | "servicios" | "arte";
}

export const seoPagesConfig: Record<string, SeoPageData> = {
  "listas-escolares-completas-sin-salir-de-casa": {
    slug: "listas-escolares-completas-sin-salir-de-casa",
    h1Title: "Listas escolares completas sin salir de casa",
    subtitle:
      "Mandanos una foto de la lista por WhatsApp y te ayudamos a resolver utiles, forrado y entrega sin perder tiempo.",
    painPoints: [
      "Evita colas y compras de ultima hora",
      "Podemos ayudarte con utiles y forrado",
      "Recojo rapido o delivery local en VMT",
    ],
    whatsappMessage: "Hola, quiero resolver mi lista escolar completa. Aqui esta la foto:",
    metaTitle: "Lista escolar completa a domicilio",
    metaDescription:
      "Resuelve tu lista escolar sin salir de casa. Envia la foto por WhatsApp y te ayudamos con utiles, forrado y entrega rapida.",
    categoryHint: "utiles",
  },
  "donde-dejar-la-lista-escolar-para-cotizar": {
    slug: "donde-dejar-la-lista-escolar-para-cotizar",
    h1Title: "Donde dejar tu lista escolar para cotizar",
    subtitle:
      "Toma una foto con tu celular y enviala por WhatsApp. Te respondemos con una cotizacion clara y sin vueltas.",
    painPoints: [
      "Cotizacion gratis por WhatsApp",
      "Respuesta clara para padres y alumnos",
      "Opciones segun tu presupuesto",
    ],
    whatsappMessage: "Hola, quiero cotizar esta lista escolar por favor:",
    metaTitle: "Cotiza tu lista escolar por WhatsApp",
    metaDescription:
      "Envia una foto de tu lista escolar y recibe una cotizacion rapida por WhatsApp. Te ayudamos a resolverla paso a paso.",
    categoryHint: "utiles",
  },
  "utiles-escolares-economicos-y-de-marca": {
    slug: "utiles-escolares-economicos-y-de-marca",
    h1Title: "Utiles escolares economicos y de marca",
    subtitle:
      "Encuentra utiles accesibles o marcas reconocidas segun lo que te pida el colegio y tu presupuesto.",
    painPoints: [
      "Opciones economicas para ahorrar",
      "Marcas conocidas para pedidos exigentes",
      "Asesoria para elegir lo necesario",
    ],
    whatsappMessage: "Hola, quiero cotizar utiles escolares economicos y de marca.",
    metaTitle: "Utiles escolares baratos y de marca",
    metaDescription:
      "Cotiza utiles escolares economicos o de marca por WhatsApp. Te ayudamos a comparar opciones y resolver tu compra rapido.",
    categoryHint: "utiles",
  },
  "forrado-de-cuadernos-y-etiquetas-personalizadas": {
    slug: "forrado-de-cuadernos-y-etiquetas-personalizadas",
    h1Title: "Forrado de cuadernos y etiquetas personalizadas",
    subtitle:
      "Si no tienes tiempo para forrar, nosotros lo hacemos por ti y te entregamos tus cuadernos listos para el colegio.",
    painPoints: [
      "Forrado prolijo y sin burbujas",
      "Etiquetas resistentes y legibles",
      "Ahorra tiempo en temporada escolar",
    ],
    whatsappMessage: "Hola, necesito forrado de cuadernos y etiquetas personalizadas.",
    metaTitle: "Forrado de cuadernos y etiquetas",
    metaDescription:
      "Te ayudamos con forrado de cuadernos y etiquetas personalizadas. Ahorra tiempo y recibe todo listo para usar.",
    categoryHint: "servicios",
  },
  "emergencias-escolares-ultimos-utiles": {
    slug: "emergencias-escolares-ultimos-utiles",
    h1Title: "Emergencias escolares y ultimos utiles",
    subtitle:
      "Si te falto algo para manana, escribenos ahora y te confirmamos rapido si tenemos stock disponible.",
    painPoints: [
      "Respuesta rapida por WhatsApp",
      "Stock de utiles comunes y urgentes",
      "Recojo rapido para salir del apuro",
    ],
    whatsappMessage: "Hola, me faltan utiles urgentes y quiero confirmar stock.",
    metaTitle: "Utiles de ultima hora para el colegio",
    metaDescription:
      "Si te falto algo de la lista escolar, te ayudamos a resolverlo rapido por WhatsApp con recojo o entrega local.",
    categoryHint: "utiles",
  },
  "utiles-para-ninos-de-inicial-kinder": {
    slug: "utiles-para-ninos-de-inicial-kinder",
    h1Title: "Listas y utiles para inicial y kinder",
    subtitle:
      "Encuentra crayones, plastilina, mandiles y materiales escolares para inicial con atencion clara para padres.",
    painPoints: [
      "Materiales adecuados para inicial",
      "Opciones recomendadas por maestras",
      "Compra guiada para evitar errores",
    ],
    whatsappMessage: "Hola, necesito cotizar utiles para inicial o kinder.",
    metaTitle: "Utiles para inicial y kinder",
    metaDescription:
      "Cotiza utiles para inicial y kinder por WhatsApp. Te ayudamos con materiales escolares adecuados y entrega rapida.",
    categoryHint: "arte",
  },
  "materiales-para-maquetas-y-trabajos": {
    slug: "materiales-para-maquetas-y-trabajos",
    h1Title: "Materiales para maquetas y trabajos escolares",
    subtitle:
      "Tenemos tecnopor, carton, silicona, palitos y otros insumos para maquetas, exposiciones y trabajos del colegio.",
    painPoints: [
      "Materiales para maquetas y manualidades",
      "Consulta stock antes de venir",
      "Ayuda rapida para resolver el pedido",
    ],
    whatsappMessage: "Hola, necesito materiales para maquetas y trabajos escolares.",
    metaTitle: "Materiales para maquetas y trabajos",
    metaDescription:
      "Encuentra tecnopor, carton, silicona y materiales para maquetas. Consulta stock por WhatsApp y resuelve tu trabajo rapido.",
    categoryHint: "arte",
  },
  "impresion-de-trabajos-y-pdf-por-whatsapp": {
    slug: "impresion-de-trabajos-y-pdf-por-whatsapp",
    h1Title: "Impresion de trabajos y PDF por WhatsApp",
    subtitle:
      "Envianos tu archivo desde el celular y deja listo tu trabajo antes de llegar a la tienda.",
    painPoints: [
      "Impresion en blanco y negro o color",
      "Envio directo del archivo por WhatsApp",
      "Recojo rapido sin hacer fila",
    ],
    whatsappMessage: "Hola, necesito imprimir un trabajo. Aqui te envio mi archivo.",
    metaTitle: "Imprime trabajos y PDF por WhatsApp",
    metaDescription:
      "Envianos tu PDF o Word por WhatsApp y deja listas tus impresiones antes de llegar. Servicio rapido y claro.",
    categoryHint: "servicios",
  },
  "papeleria-bonita-y-asthetic-para-apuntes": {
    slug: "papeleria-bonita-y-asthetic-para-apuntes",
    h1Title: "Papeleria bonita y aesthetic para apuntes",
    subtitle:
      "Plumones, resaltadores pastel, cuadernos y accesorios para apuntes bonitos, lettering y estudio creativo.",
    painPoints: [
      "Papeleria para apuntes creativos",
      "Resaltadores y lettering por consulta",
      "Ideas para estudio mas visual",
    ],
    whatsappMessage: "Hola, tienen papeleria aesthetic y productos para lettering?",
    metaTitle: "Papeleria aesthetic y lettering",
    metaDescription:
      "Encuentra papeleria aesthetic, resaltadores pastel y productos para lettering. Consulta stock y modelos por WhatsApp.",
    categoryHint: "arte",
  },
  "materiales-de-arte-y-pintura-colegio": {
    slug: "materiales-de-arte-y-pintura-colegio",
    h1Title: "Materiales de arte y pintura para el colegio",
    subtitle:
      "Acuarelas, temperas, pinceles y blocks para tareas de arte, dibujo y pintura escolar.",
    painPoints: [
      "Acuarelas y temperas escolares",
      "Pinceles, blocks y materiales de dibujo",
      "Consulta modelos y stock por WhatsApp",
    ],
    whatsappMessage: "Hola, necesito materiales de arte y pintura para el colegio.",
    metaTitle: "Materiales de arte y pintura escolar",
    metaDescription:
      "Cotiza acuarelas, temperas, pinceles y blocks para clases de arte. Te ayudamos a encontrar lo necesario rapido.",
    categoryHint: "arte",
  },
  "utiles-para-secundaria-y-universidad": {
    slug: "utiles-para-secundaria-y-universidad",
    h1Title: "Utiles de secundaria y universidad",
    subtitle:
      "Cuadernos universitarios, lapiceros, blocks y calculadoras para clases mas exigentes y estudio diario.",
    painPoints: [
      "Utiles para secundaria y universidad",
      "Formatos A4, cuadriculados y tecnicos",
      "Compra rapida por WhatsApp",
    ],
    whatsappMessage: "Hola, busco utiles para secundaria o universidad.",
    metaTitle: "Utiles para secundaria y universidad",
    metaDescription:
      "Cotiza cuadernos, lapiceros y calculadoras para secundaria o universidad. Te ayudamos a resolver tu pedido por WhatsApp.",
    categoryHint: "utiles",
  },
  "libreria-abierta-ahora-cerca-al-colegio": {
    slug: "libreria-abierta-ahora-cerca-al-colegio",
    h1Title: "Libreria abierta ahora cerca de ti",
    subtitle:
      "Confirma por WhatsApp si tenemos lo que necesitas antes de venir y resuelve tu compra mas rapido.",
    painPoints: [
      "Atencion rapida antes de llegar",
      "Confirmacion de stock por WhatsApp",
      "Compra agil cerca del colegio",
    ],
    whatsappMessage: "Hola, estan abiertos ahora? Quiero confirmar stock antes de ir.",
    metaTitle: "Libreria abierta ahora cerca de ti",
    metaDescription:
      "Si buscas una libreria abierta cerca, escribenos por WhatsApp y confirma stock antes de venir a la tienda.",
    categoryHint: "servicios",
  },
  "silicona-goma-y-pegamentos-para-trabajos": {
    slug: "silicona-goma-y-pegamentos-para-trabajos",
    h1Title: "Silicona, goma y pegamentos para trabajos",
    subtitle:
      "Tenemos silicona liquida, goma en barra, cinta doble faz y otros adhesivos para trabajos escolares y maquetas.",
    painPoints: [
      "Adhesivos para colegio y manualidades",
      "Consulta stock de silicona y cinta",
      "Te orientamos segun el trabajo",
    ],
    whatsappMessage: "Hola, necesito silicona, goma o cinta doble faz para un trabajo.",
    metaTitle: "Silicona, goma y cinta doble faz",
    metaDescription:
      "Cotiza silicona, goma y cinta doble faz para trabajos escolares. Consulta stock y opciones por WhatsApp.",
    categoryHint: "arte",
  },
  "cartulinas-papelografos-y-papel-craft": {
    slug: "cartulinas-papelografos-y-papel-craft",
    h1Title: "Cartulinas, papelografos y papel kraft",
    subtitle:
      "Todo para exposiciones escolares: cartulinas de colores, papelografos, kraft y plumones gruesos.",
    painPoints: [
      "Material para exposiciones y afiches",
      "Varios colores y formatos escolares",
      "Consulta disponibilidad por WhatsApp",
    ],
    whatsappMessage: "Hola, busco cartulinas, papelografos y papel kraft para una exposicion.",
    metaTitle: "Cartulinas y papelografos escolares",
    metaDescription:
      "Encuentra cartulinas, papelografos y papel kraft para exposiciones escolares. Consulta colores y stock por WhatsApp.",
    categoryHint: "arte",
  },
  "fotocopias-y-escaneos-rapidos": {
    slug: "fotocopias-y-escaneos-rapidos",
    h1Title: "Fotocopias y escaneos rapidos",
    subtitle:
      "Resuelve fotocopias, escaneos y envio de archivos con una atencion clara, rapida y sin complicaciones.",
    painPoints: [
      "Fotocopias y escaneos al instante",
      "Envio de archivos por WhatsApp o correo",
      "Atencion simple para tramites y colegio",
    ],
    whatsappMessage: "Hola, necesito fotocopias y escaneos rapidos.",
    metaTitle: "Fotocopias y escaneos rapidos",
    metaDescription:
      "Servicio rapido de fotocopias y escaneos para colegio y tramites. Te atendemos por WhatsApp y en tienda.",
    categoryHint: "servicios",
  },
  "necesito-utiles-urgente": {
    slug: "necesito-utiles-urgente",
    h1Title: "Necesito utiles urgente",
    subtitle:
      "Escribenos ahora, dinos que te falta y te confirmamos stock rapido para que salgas del apuro.",
    painPoints: [
      "Respuesta rapida para urgencias",
      "Confirmacion de stock en minutos",
      "Recojo agil y medios de pago simples",
    ],
    whatsappMessage: "Hola, necesito utiles urgente y quiero confirmar stock ahora.",
    metaTitle: "Utiles urgentes con recojo rapido",
    metaDescription:
      "Si necesitas utiles urgente, escribenos por WhatsApp y confirma stock en minutos para resolver tu compra rapido.",
    categoryHint: "utiles",
  },
};
