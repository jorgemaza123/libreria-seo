"use client"

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockSiteContent } from '@/lib/mock-data';
import { CONTACT, BUSINESS_INFO, BUSINESS_HOURS, getWhatsAppUrl, getPhoneUrl, getEmailUrl } from '@/lib/constants';
import { toast } from 'sonner';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - will integrate with backend
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success('¡Mensaje enviado!', {
      description: 'Nos pondremos en contacto contigo pronto.',
    });

    setFormData({ name: '', email: '', phone: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contacto" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium animate-fade-down">
            👋 Estamos Aquí Para Ti
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold animate-fade-up">
            {mockSiteContent.contactTitle}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {mockSiteContent.contactSubtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Contact Form (Ocupa 7 columnas en PC) */}
          <div className="lg:col-span-7 bg-card/50 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50 shadow-lg card-elevated animate-fade-right">
            <div className="mb-8">
              <h3 className="text-2xl font-heading font-bold flex items-center gap-2">
                Envíanos un Mensaje
                <Send className="w-5 h-5 text-primary" />
              </h3>
              <p className="text-muted-foreground mt-2">
                Completa el formulario y te responderemos a la brevedad posible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label 
                    htmlFor="name" 
                    className={`text-sm font-medium transition-colors ${focusedField === 'name' ? 'text-primary' : 'text-foreground'}`}
                  >
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label 
                    htmlFor="phone" 
                    className={`text-sm font-medium transition-colors ${focusedField === 'phone' ? 'text-primary' : 'text-foreground'}`}
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full h-12 px-4 rounded-xl border border-input bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Ej. 999 999 999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="email" 
                  className={`text-sm font-medium transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-foreground'}`}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="Ej. tu@email.com"
                />
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="message" 
                  className={`text-sm font-medium transition-colors ${focusedField === 'message' ? 'text-primary' : 'text-foreground'}`}
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                  placeholder="Cuéntanos ¿En qué podemos ayudarte?"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-base font-bold shadow-lg hover:shadow-primary/25 transition-all duration-300"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <>
                    Enviar Mensaje
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info & Map (Ocupa 5 columnas en PC) */}
          <div className="lg:col-span-5 space-y-6 animate-fade-left" style={{ animationDelay: '0.2s' }}>
            
            {/* Quick Contact Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-6 md:p-8 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                Información de Contacto
              </h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Dirección</p>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-1">
                      {BUSINESS_INFO.address.street}
                      <br />
                      {BUSINESS_INFO.address.city}, {BUSINESS_INFO.address.state}
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Teléfono</p>
                    <a
                      href={getPhoneUrl()}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors mt-1 block"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Email</p>
                    <a
                      href={getEmailUrl()}
                      className="text-muted-foreground text-sm hover:text-primary transition-colors mt-1 block"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Horario de Atención</p>
                    <div className="text-muted-foreground text-sm space-y-1 mt-1">
                      <div className="flex justify-between gap-4">
                        <span>{BUSINESS_HOURS.weekdays.label}:</span>
                        <span className="font-medium text-foreground">{BUSINESS_HOURS.weekdays.hours}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>{BUSINESS_HOURS.saturday.label}:</span>
                        <span className="font-medium text-foreground">{BUSINESS_HOURS.saturday.hours}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>

              {/* WhatsApp CTA */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <Button className="w-full bg-[#25D366] hover:bg-[#20BA5C] text-white border-none h-14 text-lg font-bold shadow-lg hover:shadow-green-500/20 transition-all duration-300" asChild>
                  <a
                    href={getWhatsAppUrl('Hola, me gustaría obtener información sobre sus productos y servicios.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-6 h-6 fill-white" />
                    Chatear por WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            {/* Map Card */}
            <div className="bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 group">
              <div className="p-4 bg-muted/30 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-bold">Ubicación en Tiempo Real</span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  Abrir GPS <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              
              <div className="relative w-full h-[250px] bg-muted">
                <iframe
                  src={`https://maps.google.com/maps?q=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}&z=16&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Librería Central"
                  className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}