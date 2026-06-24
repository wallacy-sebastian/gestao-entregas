import { ref } from 'vue'

const STORAGE_KEY = 'delivery_animations'

const animationsEnabled = ref(true)

function apply(): void {
  document.documentElement.classList.toggle('no-animations', !animationsEnabled.value)
  localStorage.setItem(STORAGE_KEY, String(animationsEnabled.value))
}

export function useAnimationToggle() {
  function init(): void {
    const stored = localStorage.getItem(STORAGE_KEY)
    animationsEnabled.value = stored !== null ? stored === 'true' : true
    apply()
  }

  function toggle(): void {
    animationsEnabled.value = !animationsEnabled.value
    apply()
  }

  return { animationsEnabled, init, toggle }
}
