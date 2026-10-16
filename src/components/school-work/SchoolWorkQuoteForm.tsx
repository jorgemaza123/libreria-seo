"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SchoolWorkQuoteFormProps {
  defaultType: string;
  sourceSlug: string;
}

const workTypes = [
  "Maqueta escolar",
  "Día del Logro",
  "Proyecto de ciencia",
  "Material para exposición",
  "Lapbook escolar",
  "Tríptico escolar",
  "Otro trabajo escolar",
];

export function SchoolWorkQuoteForm({ defaultType, sourceSlug }: SchoolWorkQuoteFormProps) {
  const { getWhatsAppUrl } = useWhatsApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({
    type: defaultType,
    topic: "",
    level: "",
    grade: "",
    course: "",
    dueDate: "",
    district: "",
    size: "",
    quantity: "1",
    hasReference: false,
    notes: "",
  });

  const updateField = (field: keyof typeof form, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const canContinue = form.type.trim() && form.topic.trim() && form.dueDate.trim();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const lines = [
      "Hola Librería CHROMA, necesito cotizar un trabajo escolar.",
      "",
      `Tipo: ${form.type}`,
      `Tema: ${form.topic}`,
      form.course ? `Curso/área: ${form.course}` : "",
      form.level ? `Nivel: ${form.level}` : "",
      form.grade ? `Grado: ${form.grade}` : "",
      `Fecha de entrega: ${form.dueDate}`,
      form.district ? `Distrito: ${form.district}` : "",
      form.size ? `Tamaño o formato: ${form.size}` : "",
      form.quantity ? `Cantidad: ${form.quantity}` : "",
      form.hasReference ? "Referencia: tengo una foto o archivo y lo adjuntaré en WhatsApp." : "",
      form.notes ? `Observaciones: ${form.notes}` : "",
      "",
      `Página consultada: /${sourceSlug}`,
      "¿Pueden confirmarme disponibilidad y cotización?",
    ].filter(Boolean);

    try {
      await fetch("/api/conversion-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_type: "school_work_quote",
          metadata: {
            source: sourceSlug,
            work_type: form.type,
            level: form.level || "not_provided",
            has_reference: form.hasReference,
          },
        }),
      });
    } catch {
      // La cotización no debe bloquearse si la analítica falla.
    }

    window.open(getWhatsAppUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel mx-auto max-w-4xl p-5 sm:p-8" id="cotizar">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Cotización guiada</p>
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            {step === 1 ? "Cuéntanos lo esencial" : "Completa los detalles que tengas"}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {step === 1
              ? "Solo pedimos tres datos para empezar. En el siguiente paso todo lo demás es opcional."
              : "El mensaje llegará ordenado a WhatsApp. Si tienes una foto, podrás adjuntarla allí."}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
          Paso {step} de 2
        </span>
      </div>

      {step === 1 ? (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-type`}>Tipo de trabajo</Label>
            <select
              id={`${sourceSlug}-type`}
              value={form.type}
              onChange={(event) => updateField("type", event.target.value)}
              className="min-h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground"
              required
            >
              {workTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-topic`}>Tema</Label>
            <Input id={`${sourceSlug}-topic`} value={form.topic} onChange={(event) => updateField("topic", event.target.value)} placeholder="Ej.: sistema digestivo" className="min-h-12 rounded-xl" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-date`}>Fecha de entrega</Label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input id={`${sourceSlug}-date`} type="date" value={form.dueDate} onChange={(event) => updateField("dueDate", event.target.value)} className="min-h-12 rounded-xl pl-10" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-level`}>Nivel educativo <span className="text-muted-foreground">(opcional)</span></Label>
            <select id={`${sourceSlug}-level`} value={form.level} onChange={(event) => updateField("level", event.target.value)} className="min-h-12 w-full rounded-xl border border-input bg-background px-3 text-base text-foreground">
              <option value="">Seleccionar</option>
              <option value="Inicial">Inicial</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <Button type="button" size="lg" className="min-h-14 w-full rounded-2xl text-base font-bold sm:w-auto sm:px-8" disabled={!canContinue} onClick={() => setStep(2)}>
              Continuar
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-course`}>Curso o área</Label>
            <Input id={`${sourceSlug}-course`} value={form.course} onChange={(event) => updateField("course", event.target.value)} placeholder="Ej.: Ciencia y Tecnología" className="min-h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-grade`}>Grado</Label>
            <Input id={`${sourceSlug}-grade`} value={form.grade} onChange={(event) => updateField("grade", event.target.value)} placeholder="Ej.: 5.º de primaria" className="min-h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-district`}>Distrito</Label>
            <Input id={`${sourceSlug}-district`} value={form.district} onChange={(event) => updateField("district", event.target.value)} placeholder="Para revisar recojo o entrega" className="min-h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-size`}>Tamaño o formato</Label>
            <Input id={`${sourceSlug}-size`} value={form.size} onChange={(event) => updateField("size", event.target.value)} placeholder="Ej.: base 50 × 40 cm" className="min-h-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${sourceSlug}-quantity`}>Cantidad</Label>
            <Input id={`${sourceSlug}-quantity`} type="number" min="1" value={form.quantity} onChange={(event) => updateField("quantity", event.target.value)} className="min-h-12 rounded-xl" />
          </div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-input bg-background px-4 py-3 text-sm text-slate-200">
            <input type="checkbox" checked={form.hasReference} onChange={(event) => updateField("hasReference", event.target.checked)} className="h-5 w-5 accent-primary" />
            Tengo una foto, rúbrica o referencia para adjuntar
          </label>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`${sourceSlug}-notes`}>Observaciones</Label>
            <Textarea id={`${sourceSlug}-notes`} value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Materiales, colores, indicaciones especiales o dudas" className="min-h-28 rounded-xl" />
          </div>

          <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row">
            <Button type="button" size="lg" variant="outline" className="min-h-14 rounded-2xl" onClick={() => setStep(1)}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver
            </Button>
            <Button type="submit" size="lg" className="min-h-14 flex-1 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 sm:flex-none sm:px-8">
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar cotización por WhatsApp
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
