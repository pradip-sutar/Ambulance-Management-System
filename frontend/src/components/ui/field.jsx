'use client'

import { useMemo } from 'react'
import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

// FieldSet
function FieldSet({ className, ...props }) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn('flex flex-col gap-6', className)}
      {...props}
    />
  )
}

// Legend
function FieldLegend({ className, variant = 'legend', ...props }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'mb-3 font-medium',
        variant === 'legend' ? 'text-base' : 'text-sm',
        className
      )}
      {...props}
    />
  )
}

// Group
function FieldGroup({ className, ...props }) {
  return (
    <div
      data-slot="field-group"
      className={cn('flex flex-col gap-7 w-full', className)}
      {...props}
    />
  )
}

// Variants
const fieldVariants = cva(
  'flex w-full gap-3',
  {
    variants: {
      orientation: {
        vertical: 'flex-col',
        horizontal: 'flex-row items-center',
        responsive: 'flex-col md:flex-row md:items-center',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

// Field
function Field({ className, orientation = 'vertical', ...props }) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

// Content
function FieldContent({ className, ...props }) {
  return (
    <div
      data-slot="field-content"
      className={cn('flex flex-1 flex-col gap-1.5', className)}
      {...props}
    />
  )
}

// Label
function FieldLabel({ className, ...props }) {
  return (
    <Label
      data-slot="field-label"
      className={cn('flex gap-2 text-sm', className)}
      {...props}
    />
  )
}

// Title
function FieldTitle({ className, ...props }) {
  return (
    <div
      data-slot="field-title"
      className={cn('text-sm font-medium flex items-center gap-2', className)}
      {...props}
    />
  )
}

// Description
function FieldDescription({ className, ...props }) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

// Separator
function FieldSeparator({ children, className, ...props }) {
  return (
    <div
      data-slot="field-separator"
      className={cn('relative my-2 h-5 text-sm', className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span className="bg-background text-muted-foreground mx-auto block w-fit px-2 relative">
          {children}
        </span>
      )}
    </div>
  )
}

// Error
function FieldError({ className, children, errors, ...props }) {
  const content = useMemo(() => {
    if (children) return children
    if (!errors) return null

    if (errors.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="ml-4 list-disc flex flex-col gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) return null

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn('text-red-500 text-sm', className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}