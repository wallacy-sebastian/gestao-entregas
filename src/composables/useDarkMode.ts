import { ref, watch } from 'vue'

const STORAGE_KEY = 'delivery_dark_mode'

const isDark = ref(false)

export function useDarkMode() {
  function init(): void {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      isDark.value = stored === 'true'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    apply()
  }

  function toggle(): void {
    isDark.value = !isDark.value
  }

  function apply(): void {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem(STORAGE_KEY, String(isDark.value))
  }

  watch(isDark, apply)

  return { isDark, init, toggle }
}
