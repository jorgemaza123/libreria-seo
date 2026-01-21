import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface DynamicIconProps extends LucideProps {
  name: string;
}

export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  // Buscamos el icono en la librería usando el nombre que viene de la BD
  // @ts-ignore - Ignoramos error de índice porque el nombre viene de BD string
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    // Si el nombre está mal o no existe, mostramos un icono por defecto
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <IconComponent {...props} />;
};