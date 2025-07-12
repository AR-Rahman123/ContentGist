import { useState } from 'react'

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
}

const toasts: Toast[] = []
let toastId = 0

export function useToast() {
  const [, setCounter] = useState(0)

  const toast = ({
    title,
    description,
    variant = 'default',
    duration = 5000,
  }: Omit<Toast, 'id'>) => {
    const id = (toastId++).toString()
    const newToast: Toast = {
      id,
      title,
      description,
      variant,
      duration,
    }

    toasts.push(newToast)
    setCounter(c => c + 1)

    // Auto dismiss
    setTimeout(() => {
      const index = toasts.findIndex(t => t.id === id)
      if (index > -1) {
        toasts.splice(index, 1)
        setCounter(c => c + 1)
      }
    }, duration)
  }

  const dismiss = (id: string) => {
    const index = toasts.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.splice(index, 1)
      setCounter(c => c + 1)
    }
  }

  return {
    toast,
    dismiss,
    toasts: [...toasts],
  }
}

// Simple console-based fallback for now
export const toast = ({
  title,
  description,
  variant = 'default',
}: Omit<Toast, 'id'>) => {
  const message = `${title ? title + ': ' : ''}${description || ''}`
  if (variant === 'destructive') {
    console.error('Toast Error:', message)
  } else {
    console.log('Toast:', message)
  }
}