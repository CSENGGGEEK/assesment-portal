"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  options?: Array<{ value: string; label: string }>
  value: string
  error: string | null
  touched: boolean
  onChange: (value: string) => void
  onBlur: () => void
  className?: string
}

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  options,
  value,
  error,
  touched,
  onChange,
  onBlur,
  className,
}: FormFieldProps) {
  const hasError = touched && error
  const isValid = touched && !error && value && value.toString().trim() !== ""

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {options ? (
        <Select
          name={name}
          value={value}
          onValueChange={onChange}
          onOpenChange={(open) => {
            if (!open) onBlur()
          }}
          required={required}
        >
          <SelectTrigger
            className={cn(
              "transition-colors",
              hasError && "border-red-500 focus:border-red-500 ring-red-500",
              isValid && "border-green-500 focus:border-green-500 ring-green-500",
            )}
          >
            <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          className={cn(
            "transition-colors",
            hasError && "border-red-500 focus:border-red-500 ring-red-500",
            isValid && "border-green-500 focus:border-green-500 ring-green-500",
          )}
        />
      )}

      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {error}
        </p>
      )}

      {isValid && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <span className="text-green-500">✓</span>
          Looks good!
        </p>
      )}
    </div>
  )
}
