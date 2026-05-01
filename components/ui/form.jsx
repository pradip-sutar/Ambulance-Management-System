'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

// Form Provider
const Form = FormProvider

// ---------------- Context ----------------
const FormFieldContext = React.createContext({})

const FormItemContext = React.createContext({})

// ---------------- FormField ----------------
function FormField(props) {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// ---------------- Hook ----------------
function useFormField() {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)

  const { getFieldState } = useFormContext()
  const formState = useFormState({ name: fieldContext?.name })
  const fieldState = getFieldState(fieldContext?.name, formState)

  if (!fieldContext || !fieldContext.name) {
    throw new Error('useFormField must be used inside <FormField>')
  }

  const id = itemContext?.id || 'form-item'

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-description`,
    formMessageId: `${id}-message`,
    ...fieldState,
  }
}

// ---------------- FormItem ----------------
function FormItem({ className, ...props }) {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn('grid gap-2', className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
}

// ---------------- Label ----------------
function FormLabel({ className, ...props }) {
  const { error, formItemId } = useFormField()

  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn(error && 'text-red-500', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
}

// ---------------- Control ----------------
function FormControl(props) {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField()

  return (
    <Slot
      data-slot="form-control"
      id={formItemId}
      aria-describedby={
        error
          ? `${formDescriptionId} ${formMessageId}`
          : formDescriptionId
      }
      aria-invalid={!!error}
      {...props}
    />
  )
}

// ---------------- Description ----------------
function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useFormField()

  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

// ---------------- Message ----------------
function FormMessage({ className, children, ...props }) {
  const { error, formMessageId } = useFormField()

  const body = error ? String(error?.message || '') : children

  if (!body) return null

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn('text-red-500 text-sm', className)}
      {...props}
    >
      {body}
    </p>
  )
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}