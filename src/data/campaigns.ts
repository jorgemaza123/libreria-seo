export type CampaignStatus = "active" | "scheduled" | "paused";

export interface HomeHeroCampaign {
  countdown?: {
    targetDate: string;
    text: string;
    subtext: string;
  };
  primaryEvent: string;
  goal: string;
}

export const homeHeroCampaigns: Record<"school" | "sublimation" | "services", HomeHeroCampaign> = {
  school: {
    primaryEvent: "SchoolListLead",
    goal: "Capturar listas escolares por WhatsApp",
  },
  sublimation: {
    primaryEvent: "SublimationLead",
    goal: "Cotizaciones de sublimación y personalización",
  },
  services: {
    primaryEvent: "MultiServiceLead",
    goal: "Consultas de útiles, sublimación y trámites",
  },
};

export interface SiteCampaign {
  slug: string;
  name: string;
  status: CampaignStatus;
  startsAt: string;
  endsAt: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  primaryCta: string;
  secondaryCta: string;
  secondaryHref: string;
  relatedLinks: Array<{
    label: string;
    href: string;
  }>;
}

export const campaigns: SiteCampaign[] = [
  {
    slug: "dia-del-logro-2026",
    name: "Día y Semana del Logro",
    status: "active",
    startsAt: "2026-10-15",
    endsAt: "2026-12-12",
    eyebrow: "Campaña escolar de noviembre",
    title: "¿Qué tienes que presentar en el Día del Logro?",
    description:
      "Encuentra rápido maquetas, paneles, proyectos, lapbooks, trípticos, rótulos e impresiones según lo que debes explicar.",
    href: "/dia-del-logro",
    primaryCta: "Preparar mi trabajo",
    secondaryCta: "Ver todas las opciones",
    secondaryHref: "/trabajos-escolares",
    relatedLinks: [
      { label: "Maqueta", href: "/maquetas-escolares-lima" },
      { label: "Panel o exposición", href: "/material-para-exposiciones" },
      { label: "Proyecto de ciencia", href: "/proyectos-de-ciencia" },
      { label: "Lapbook", href: "/lapbooks-escolares" },
      { label: "Tríptico", href: "/tripticos-escolares" },
    ],
  },
  {
    slug: "cierre-escolar-2026",
    name: "Cierre del año escolar",
    status: "scheduled",
    startsAt: "2026-11-20",
    endsAt: "2026-12-31",
    eyebrow: "Campaña de diciembre",
    title: "Presentaciones y materiales para cerrar el año escolar",
    description:
      "Arquitectura reservada para trabajos finales, clausura, promoción, recuerdos e impresiones que correspondan a la oferta real.",
    href: "/trabajos-escolares",
    primaryCta: "Ver trabajos escolares",
    secondaryCta: "Consultar",
    secondaryHref: "/#contacto",
    relatedLinks: [],
  },
];

export function getActiveHomeCampaign(now = new Date()) {
  const limaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return campaigns.find((campaign) =>
    campaign.status === "active"
    && campaign.startsAt <= limaDate
    && campaign.endsAt >= limaDate
  ) ?? null;
}
