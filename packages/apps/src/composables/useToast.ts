import { createApp, h } from 'vue'
import Toast from '@/components/toast.vue'

export function useToast() {
  function show(msg: string, type: 'success' | 'error' | 'info' = 'info') {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp(h(Toast, {
      message: msg,
      type,
      onClose: () => {
        app.unmount()
        document.body.removeChild(container)
      },
    }))
    app.mount(container)
  }

  return { toast: show }
}
