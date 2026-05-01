import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Empty Container
function Empty({ className, ...props }) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center md:p-12',
        className
      )}
      {...props}
    />
  )
}

// Header
function EmptyHeader({ className, ...props }) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        'flex max-w-sm flex-col items-center gap-2 text-center',
        className
      )}
      {...props}
    />
  )
}

// Variants
const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: 'bg-muted text-foreground flex size-10 items-center justify-center rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// Media
function EmptyMedia({ className, variant = 'default', ...props }) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

// Title
function EmptyTitle({ className, ...props }) {
  return (
    <div
      data-slot="empty-title"
      className={cn('text-lg font-medium tracking-tight', className)}
      {...props}
    />
  )
}

// Description
function EmptyDescription({ className, ...props }) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        'text-muted-foreground text-sm',
        className
      )}
      {...props}
    />
  )
}

// Content
function EmptyContent({ className, ...props }) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'flex w-full max-w-sm flex-col items-center gap-4 text-sm',
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}