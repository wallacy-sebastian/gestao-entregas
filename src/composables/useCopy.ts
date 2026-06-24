import { ref } from 'vue'

export function useCopy(defaultText = 'Copiar') {
  const copyBtnText = ref(defaultText)

  function resetText(): void {
    setTimeout(() => { copyBtnText.value = defaultText }, 2000)
  }

  async function copyText(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
      copyBtnText.value = 'Copiado!'
    } catch {
      copyBtnText.value = 'Erro'
    }
    resetText()
  }

  return { copyBtnText, copyText }
}
