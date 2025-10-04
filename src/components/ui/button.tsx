// components/ui/button.tsx (Updated to import variants)
import { buttonVariants } from '@/lib/button-variants'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'circle'
  children: React.ReactNode
}

export function Button({ 
  variant = 'default', 
  size = 'default', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  const classes = buttonVariants({ variant, size, className })

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}