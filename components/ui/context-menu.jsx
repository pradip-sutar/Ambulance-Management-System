'use client'

import * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

// Root
function ContextMenu(props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

// Trigger
function ContextMenuTrigger(props) {
  return (
    <ContextMenuPrimitive.Trigger
      data-slot="context-menu-trigger"
      {...props}
    />
  )
}

// Group
function ContextMenuGroup(props) {
  return (
    <ContextMenuPrimitive.Group
      data-slot="context-menu-group"
      {...props}
    />
  )
}

// Portal
function ContextMenuPortal(props) {
  return (
    <ContextMenuPrimitive.Portal
      data-slot="context-menu-portal"
      {...props}
    />
  )
}

// Sub
function ContextMenuSub(props) {
  return (
    <ContextMenuPrimitive.Sub
      data-slot="context-menu-sub"
      {...props}
    />
  )
}

// Radio Group
function ContextMenuRadioGroup(props) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

// Sub Trigger
function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "focus:bg-accent focus:text-accent-foreground flex items-center px-2 py-1.5 text-sm rounded-sm cursor-default data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

// Sub Content
function ContextMenuSubContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        'bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-lg',
        className
      )}
      {...props}
    />
  )
}

// Main Content
function ContextMenuContent({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          'bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-md overflow-auto',
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

// Item
function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-default select-none data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  )
}

// Checkbox Item
function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        'flex items-center gap-2 pl-8 pr-2 py-1.5 text-sm rounded-sm cursor-default',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

// Radio Item
function ContextMenuRadioItem({
  className,
  children,
  ...props
}) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        'flex items-center gap-2 pl-8 pr-2 py-1.5 text-sm rounded-sm cursor-default',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex items-center justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

// Label
function ContextMenuLabel({ className, inset, ...props }) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 text-sm font-medium data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  )
}

// Separator
function ContextMenuSeparator({ className, ...props }) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn('bg-border h-px my-1', className)}
      {...props}
    />
  )
}

// Shortcut
function ContextMenuShortcut({ className, ...props }) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        'ml-auto text-xs text-muted-foreground tracking-widest',
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}