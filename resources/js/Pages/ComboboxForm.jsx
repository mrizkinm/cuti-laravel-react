import React from "react"
import { ChevronsUpDown, Check } from "lucide-react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { Controller } from "react-hook-form"

export function ComboboxForm({ name, control, options, placeholder = "Pilih opsi..." }) {
  const [open, setOpen] = useState(false)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selected = options.find((opt) => opt.id === field.value)
        
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full justify-between"
              >
                {selected ? selected.name : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Cari opsi..." />
                <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {options.map((item) => (
                    <CommandItem
                      key={item.id}
                      value={item.name}
                      onSelect={(val) => {
                        field.onChange(item.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.id === item.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {item.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )
      }}
    />
  )
}