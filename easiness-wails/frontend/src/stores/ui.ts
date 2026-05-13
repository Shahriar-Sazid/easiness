import { writable } from 'svelte/store'

interface Toast {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface UIState {
  loading: boolean
  toasts: Toast[]
  sidebarOpen: boolean
}

let toastId = 0

function createUIStore() {
  const { subscribe, set, update } = writable<UIState>({
    loading: false,
    toasts: [],
    sidebarOpen: true,
  })

  return {
    subscribe,

    setLoading(val: boolean) {
      update(s => ({ ...s, loading: val }))
    },

    toast(type: Toast['type'], message: string, duration = 3500) {
      const id = ++toastId
      update(s => ({ ...s, toasts: [...s.toasts, { id, type, message }] }))
      setTimeout(() => {
        update(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }))
      }, duration)
    },

    success(message: string) { this.toast('success', message) },
    error(message: string) { this.toast('error', message, 5000) },
    warning(message: string) { this.toast('warning', message) },
    info(message: string) { this.toast('info', message) },

    dismissToast(id: number) {
      update(s => ({ ...s, toasts: s.toasts.filter(t => t.id !== id) }))
    },

    toggleSidebar() {
      update(s => ({ ...s, sidebarOpen: !s.sidebarOpen }))
    },
  }
}

export const uiStore = createUIStore()
