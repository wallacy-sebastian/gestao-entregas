import { onMounted, onUnmounted, type Ref } from 'vue'

export function useFocusTrap(containerRef: Ref<HTMLElement | null>) {
  function getFocusableElements(): HTMLElement[] {
    if (!containerRef.value) return []
    const elements = containerRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    return Array.from(elements)
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return
    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeyDown)
  })
}
