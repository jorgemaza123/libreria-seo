"use client"

import { Shirt, CheckCircle2, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function CustomPrintingSection() {
  const externalUrl = "https://www.chromaestampados.com/";

  const benefits = [
    "Diseños 100% personalizados y exclusivos",
    "Tintas de alta durabilidad y colores vibrantes",
    "Variedad de prendas: polos, poleras, gorras y más",
    "Atención rápida y envíos a todo Lima",
    "Garantía de calidad en cada estampado"
  ];

  return (
    <section 
      id="estampados-personalizados" 
      className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Visual Element */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 bg-card border-2 border-primary/20 rounded-3xl p-2 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="aspect-square bg-muted rounded-2xl flex items-center justify-center relative overflow-hidden">
                <Shirt className="w-32 h-32 text-primary/40" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                  <span className="text-4xl font-black text-white/20 select-none rotate-12">CHROMA</span>
                </div>
              </div>
            </div>
            {/* Decorative blobs */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 space-y-8"
          >
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                Exclusividad & Estilo
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold leading-tight">
                Estampados personalizados <span className="text-primary">en Lima</span>
              </h2>
              <div className="text-base sm:text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  En Librería Chroma, elevamos tu creatividad a través de nuestro exclusivo 
                  {" "}<a 
                    href={externalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 inline-flex items-center gap-1 transition-all"
                  >
                    servicio de estampados personalizados
                    <ExternalLink className="w-3 h-3" />
                  </a>. 
                  Entendemos que cada prenda es un lienzo y cada diseño cuenta una historia única. 
                  Por eso, nos especializamos en transformar tus ideas en productos tangibles 
                  de alta calidad que destacan en cualquier lugar.
                </p>
                <p>
                  Ya sea que busques uniformes corporativos, regalos originales o simplemente 
                  expresar tu estilo personal, utilizamos las mejores técnicas de impresión 
                  para garantizar que tus diseños luzcan vibrantes y resistan el paso del tiempo. 
                  Desde polos de algodón premium hasta accesorios especializados, nuestra meta 
                  es ofrecerte una experiencia de personalización sin límites en el corazón de Lima.
                </p>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 group">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <Button 
                size="lg" 
                className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
                asChild
              >
                <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                  Ver catálogo completo de estampados
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
