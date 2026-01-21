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
          
          

          {/* Contact Info & Map (Ocupa 5 columnas en PC) */}
          <div className="lg:col-span-5 space-y-6 animate-fade-left" style={{ animationDelay: '0.2s' }}>
            
            {/* Quick Contact Card */}
            

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