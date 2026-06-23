import { ref } from 'vue'

const mensagemNotificacao = ref<string | null>(null)
const tipoNotificacao = ref<'success' | 'error'>('success')

export function useNotification() {
  function exibirNotificacao(msg: string, isError = false): void {
    mensagemNotificacao.value = msg
    tipoNotificacao.value = isError ? 'error' : 'success'
  }

  return {
    mensagemNotificacao,
    tipoNotificacao,
    exibirNotificacao,
  }
}
