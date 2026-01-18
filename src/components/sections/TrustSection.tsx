import { Store, Truck, CreditCard, Shield, Clock, MapPin } from 'lucide-react';

const trustItems = [
  {
    icon: Store,
    title: 'Más de 20 años',
    subtitle: 'en el barrio',
    highlight: true,
  },
  {
    icon: Truck,
    title: 'Envío por vecinos',
    subtitle: 'de confianza',
    highlight: false,
  },
  {
    icon: CreditCard,
    title: 'Yape y Plin',
    subtitle: 'aceptados',
    highlight: false,
    hasLogos: true,
  },
  {
    icon: Shield,
    title: 'Productos',
    subtitle: 'originales',
    highlight: false,
  },
  {
    icon: Clock,
    title: 'Entrega',
    subtitle: 'mismo día',
    highlight: false,
  },
  {
    icon: MapPin,
    title: 'Frente a',
    subtitle: 'Estela Maris',
    highlight: false,
  },
];

export function TrustSection() {
  return (
    <section className="py-8 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {trustItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={index}
                className={`
                  flex flex-col items-center text-center p-4 rounded-xl transition-all
                  ${item.highlight 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'hover:bg-secondary-foreground/5'
                  }
                `}
              >
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-3
                  ${item.highlight 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary-foreground/10 text-secondary-foreground'
                  }
                `}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <p className="font-bold text-lg leading-tight">{item.title}</p>
                <p className="text-secondary-foreground/70 text-sm">{item.subtitle}</p>
                
                {/* Yape/Plin logos */}
                {item.hasLogos && (
                  <div className="flex gap-2 mt-2">
                    <div className="w-10 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-[8px] font-bold">
                      YAPE
                    </div>
                    <div className="w-10 h-6 bg-teal-500 rounded flex items-center justify-center text-white text-[8px] font-bold">
                      PLIN
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}