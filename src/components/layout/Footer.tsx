"use client"

import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { mockNavItems, mockCategories } from '@/lib/mock-data';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { BUSINESS_INFO } from '@/lib/constants';

export function Footer() {
  const { effectiveContent } = useSiteContent();
  const { contact, social, footer } = effectiveContent;

  const visibleNavItems = mockNavItems
    .filter((i) => i.isVisible)
    .sort((a, b) => a.order - b.order);

  const getWhatsAppUrl = () =>
    `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`;

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-10">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                LC
              </div>
              <span className="font-heading font-bold text-lg">
                Librería CHROMA
              </span>
            </div>
            <p className="text-sm text-secondary-foreground/75 leading-relaxed">
              {footer.description ||
                'Útiles escolares, impresiones, servicios TI y más.'}
            </p>

            {/* SOCIAL */}
            <div className="flex gap-3">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-white transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  className="w-9 h-9 rounded-full bg-secondary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-white transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                className="w-9 h-9 rounded-full bg-whatsapp/20 text-whatsapp flex items-center justify-center"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h4 className="font-semibold mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              {visibleNavItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="text-secondary-foreground/70 hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CATEGORIES */}
          <div>
            <h4 className="font-semibold mb-3">Categorías</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {mockCategories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}#productos`}
                  className="px-3 py-1.5 rounded-full bg-secondary-foreground/5 hover:bg-primary/10 transition"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-3 text-sm">
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-secondary-foreground/70">
                {contact.address}
              </span>
            </div>
            <div className="flex gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-secondary-foreground/70">
                {contact.phone}
              </span>
            </div>
            <div className="flex gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-secondary-foreground/70">
                {contact.email}
              </span>
            </div>
            <div className="flex gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-secondary-foreground/70">
                Lun–Sáb: {contact.businessHours.weekdays.opens} -{' '}
                {contact.businessHours.weekdays.closes}
              </span>
            </div>
          </div>
        </div>

        {/* MAP STRIP */}
        <div className="mt-8 flex items-center justify-between gap-4 bg-secondary-foreground/5 rounded-xl p-4 border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-secondary-foreground/80">
              Encuéntranos en Google Maps
            </p>
          </div>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${BUSINESS_INFO.coordinates.lat},${BUSINESS_INFO.coordinates.lng}`}
            target="_blank"
            className="text-sm text-primary font-medium flex items-center gap-1"
          >
            Abrir GPS <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* BOTTOM */}
        <div className="mt-6 pt-6 border-t border-secondary-foreground/10 text-center text-sm text-secondary-foreground/60">
          © {new Date().getFullYear()} Librería CHROMA — Todos los derechos reservados
        </div>
      </div>
    </footer>
  );
}
