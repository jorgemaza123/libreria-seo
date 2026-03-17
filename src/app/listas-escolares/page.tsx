import { Metadata } from "next";
import { SchoolListLanding } from "./SchoolListLanding";

export const metadata: Metadata = {
  title: "Listas escolares en Villa Maria del Triunfo | Libreria CHROMA",
  description:
    "Envia tu lista escolar por WhatsApp y la armamos el mismo dia. Opciones segun tu presupuesto, delivery en VMT y recojo rapido frente al Colegio Estela Maris.",
  alternates: {
    canonical: "https://www.libreriachroma.com/listas-escolares",
  },
  openGraph: {
    title: "Listas escolares en Villa Maria del Triunfo | Libreria CHROMA",
    description:
      "Cotiza tu lista escolar por WhatsApp con opciones claras, delivery local y recojo rapido en VMT.",
    type: "website",
    locale: "es_PE",
    url: "https://www.libreriachroma.com/listas-escolares",
  },
  keywords: [
    "lista escolar Villa Maria del Triunfo",
    "utiles escolares VMT",
    "pack escolar Lima",
    "regreso a clases Villa Maria del Triunfo",
    "libreria VMT",
    "listas escolares WhatsApp",
    "utiles escolares baratos Lima",
    "forrado de cuadernos",
  ],
};

export default function ListasEscolaresPage() {
  return <SchoolListLanding />;
}
