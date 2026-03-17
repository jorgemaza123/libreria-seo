import { Metadata } from "next";
import { SchoolListLanding } from "./SchoolListLanding";

export const metadata: Metadata = {
  title: "Listas escolares en Villa Maria del Triunfo",
  description:
    "Envia tu lista escolar por WhatsApp y la armamos el mismo dia. Opciones segun tu presupuesto, delivery en VMT y recojo rapido.",
  alternates: {
    canonical: "https://www.libreriachroma.com/listas-escolares",
  },
  openGraph: {
    title: "Listas escolares en Villa Maria del Triunfo",
    description:
      "Cotiza tu lista escolar por WhatsApp con opciones claras, delivery local y recojo rapido en VMT.",
    type: "website",
    locale: "es_PE",
    url: "https://www.libreriachroma.com/listas-escolares",
  },
};

export default function ListasEscolaresPage() {
  return <SchoolListLanding />;
}
