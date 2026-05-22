'use client'

import { cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// ---------------- Group ----------------
function InputGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'relative flex w-full items-center rounded-md border h-9',
        className
      )}
      {...props}
    />
  )
}

// ---------------- Addon Variants ----------------
const inputGroupAddonVariants = cva(
  'flex items-center gap-2 text-sm py-1.5 text-muted-foreground',
  {
    variants: {
      align: {
        'inline-start': 'order-first pl-3',
        'inline-end': 'order-last pr-3',
        'block-start': 'w-full px-3 pt-3 flex-col',
        'block-end': 'w-full px-3 pb-3 flex-col',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
)

// ---------------- Addon ----------------
function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if (e.target.closest('button')) return
        const input = e.currentTarget.parentElement?.querySelector('input')
        input?.focus()
      }}
      {...props}
    />
  )
}

// ---------------- Button Variants ----------------
const inputGroupButtonVariants = cva(
  'flex items-center gap-2 text-sm',
  {
    variants: {
      size: {
        xs: 'h-6 px-2',
        sm: 'h-8 px-2.5',
        'icon-xs': 'h-6 w-6 p-0',
        'icon-sm': 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

// ---------------- Button ----------------
function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

// ---------------- Text ----------------
function InputGroupText({ className, ...props }) {
  return (
    <span
      className={cn('flex items-center gap-2 text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

// ---------------- Input ----------------
function InputGroupInput({ className, ...props }) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'flex-1 border-0 bg-transparent shadow-none focus:ring-0',
        className
      )}
      {...props}
    />
  )
}

// ---------------- Textarea ----------------
function InputGroupTextarea({ className, ...props }) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'flex-1 resize-none border-0 bg-transparent shadow-none focus:ring-0 py-2',
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}