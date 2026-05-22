'use client'

import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

// ---------------- Root ----------------
function InputOTP({
  className,
  containerClassName,
  ...props
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center gap-2',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

// ---------------- Group ----------------
function InputOTPGroup({ className, ...props }) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('flex items-center', className)}
      {...props}
    />
  )
}

// ---------------- Slot ----------------
function InputOTPSlot({ index, className, ...props }) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const slot = inputOTPContext?.slots?.[index] || {}

  const { char, hasFakeCaret, isActive } = slot

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'flex items-center justify-center w-9 h-9 border text-sm',
        isActive && 'border-blue-500 ring-2',
        className
      )}
      {...props}
    >
      {char}

      {hasFakeCaret && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-4 w-px bg-black animate-pulse" />
        </div>
      )}
    </div>
  )
}

// ---------------- Separator ----------------
function InputOTPSeparator(props) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
}