interface Toast {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const show = (
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration: number = 3000
  ) => {
    const id = Date.now().toString() + Math.random().toString(36)
    
    const toast: Toast = {
      id,
      type,
      message,
      duration
    }

    toasts.value.push(toast)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        remove(id)
      }, duration)
    }
  }

  const remove = (id: string) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (message: string, duration: number = 3000) => {
    show(message, 'success', duration)
  }

  const error = (message: string, duration: number = 4000) => {
    show(message, 'error', duration)
  }

  const info = (message: string, duration: number = 3000) => {
    show(message, 'info', duration)
  }

  const warning = (message: string, duration: number = 3000) => {
    show(message, 'warning', duration)
  }

  return {
    toasts,
    show,
    remove,
    success,
    error,
    info,
    warning
  }
}
