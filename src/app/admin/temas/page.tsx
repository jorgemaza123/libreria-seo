"use client"

import { useState } from 'react'
import { Palette, Calendar, Check, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { defaultThemes } from '@/contexts/SeasonalThemeContext'

export default function TemasPage() {
  const [activeTheme, setActiveTheme] = useState<string | null>(null)

  const themes = Object.entries(defaultThemes).map(([key, theme]) => ({
    ...theme,
    key,
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold">Temas Estacionales</h2>
        <p className="text-muted-foreground">
          Personaliza los colores de tu tienda según la temporada
        </p>
      </div>

      {/* Current Theme */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="font-heading font-bold mb-4">Tema Activo</h3>
        {activeTheme ? (
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl"
              style={{ backgroundColor: `hsl(${defaultThemes[activeTheme as keyof typeof defaultThemes]?.primaryColor || '0 0% 0%'})` }}
            />
            <div>
              <p className="font-bold">{defaultThemes[activeTheme as keyof typeof defaultThemes]?.name}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => setActiveTheme(null)}>
                <Pause className="w-4 h-4 mr-2" />
                Desactivar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">No hay tema activo. Usando colores predeterminados.</p>
        )}
      </div>

      {/* Available Themes */}
      <div>
        <h3 className="font-heading font-bold mb-4">Temas Disponibles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themes.map((theme) => (
            <div
              key={theme.key}
              className={`bg-card rounded-xl p-4 border-2 transition-all ${
                activeTheme === theme.key
                  ? 'border-primary shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {/* Color Preview */}
              <div className="flex gap-2 mb-4">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `hsl(${theme.primaryColor})` }}
                  title="Primary"
                />
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `hsl(${theme.secondaryColor})` }}
                  title="Secondary"
                />
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{ backgroundColor: `hsl(${theme.accentColor})` }}
                  title="Accent"
                />
              </div>

              {/* Theme Info */}
              <h4 className="font-bold mb-1">{theme.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Colores perfectos para {theme.name.toLowerCase()}
              </p>

              {/* Action */}
              <Button
                variant={activeTheme === theme.key ? 'secondary' : 'outline'}
                size="sm"
                className="w-full"
                onClick={() => setActiveTheme(activeTheme === theme.key ? null : theme.key)}
              >
                {activeTheme === theme.key ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Activo
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Activar
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="font-heading font-bold mb-2">💡 Cómo funcionan los temas</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Los temas cambian los colores principales de tu tienda</li>
          <li>• Puedes programar temas para fechas específicas (con Supabase)</li>
          <li>• Los cambios se aplican en tiempo real</li>
          <li>• Los temas no afectan el contenido, solo los colores</li>
        </ul>
      </div>
    </div>
  )
}
