"use client"

import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search } from 'lucide-react'

// Lista de iconos sugeridos para tu rubro (puedes agregar más)
const SUGGESTED_ICONS = [
  'Backpack', 'Book', 'BookOpen', 'Pencil', 'PenTool', 'Ruler', 'Scissors', // Escolar
  'Laptop', 'Monitor', 'Mouse', 'Keyboard', 'Cpu', 'Wifi', 'HardDrive', // Tecnología
  'FileText', 'FileCheck', 'Printer', 'Scan', 'Copy', 'Folders', // Trámites
  'Gift', 'Package', 'ShoppingBag', 'Tag', 'CreditCard', // Regalos/Venta
  'Palette', 'Image', 'Camera', 'Music', 'Headphones' // Arte/Multimedia
]

interface IconPickerProps {
  value: string
  onChange: (iconName: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  // Renderizar el icono seleccionado dinámicamente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SelectedIcon = (LucideIcons as any)[value] || LucideIcons.HelpCircle

  // Filtrar iconos
  const filteredIcons = SUGGESTED_ICONS.filter(iconName => 
    iconName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start gap-2 h-10 px-3">
          <SelectedIcon className="w-4 h-4" />
          <span className="flex-1 text-left truncate">{value || 'Seleccionar icono'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="start">
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar icono..."
              className="pl-8 h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-4 gap-2 p-2">
            {filteredIcons.map((iconName) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const Icon = (LucideIcons as any)[iconName]
              if (!Icon) return null
              
              return (
                <Button
                  key={iconName}
                  variant={value === iconName ? "default" : "ghost"}
                  className="h-10 w-10 p-0"
                  onClick={() => {
                    onChange(iconName)
                    setOpen(false)
                  }}
                  title={iconName}
                >
                  <Icon className="h-5 w-5" />
                </Button>
              )
            })}
          </div>
          {filteredIcons.length === 0 && (
            <div className="p-4 text-center text-xs text-muted-foreground">
              No se encontraron iconos
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}