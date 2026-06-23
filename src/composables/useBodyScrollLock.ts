import { ref } from 'vue'

const lockCount = ref(0)

export function useBodyScrollLock() {
  function lock(): void {
    if (lockCount.value === 0) {
      document.body.style.overflow = 'hidden'
    }
    lockCount.value++
  }

  function unlock(): void {
    lockCount.value--
    if (lockCount.value <= 0) {
      lockCount.value = 0
      document.body.style.overflow = ''
    }
  }

  return { lock, unlock }
}
