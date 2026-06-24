import { ref } from 'vue'
import type { DeliveryListData, ReportStats } from '@/stores/delivery'

export type InfoPanelMode = 'no-list' | 'no-deliveries' | 'delivery-list' | 'report'

export function useUIState() {
  const modalAberto = ref(false)
  const removerModalAberto = ref(false)
  const painelVisivel = ref(false)
  const painelTitulo = ref('Informações')
  const painelModo = ref<InfoPanelMode>('no-list')
  const painelDadosEntregas = ref<DeliveryListData | null>(null)
  const painelDadosRelatorio = ref<ReportStats | null>(null)
  const painelDataRelatorio = ref('')

  function exibirPainel(
    title: string,
    mode: InfoPanelMode,
    data?: {
      deliveriesData?: DeliveryListData | null
      reportStats?: ReportStats | null
      reportDate?: string
    },
  ): void {
    painelTitulo.value = title
    painelModo.value = mode
    painelDadosEntregas.value = data?.deliveriesData ?? null
    painelDadosRelatorio.value = data?.reportStats ?? null
    painelDataRelatorio.value = data?.reportDate ?? ''
    painelVisivel.value = true
  }

  function ocultarPainel(): void {
    painelVisivel.value = false
    painelTitulo.value = 'Informações'
    painelModo.value = 'no-list'
    painelDadosEntregas.value = null
    painelDadosRelatorio.value = null
    painelDataRelatorio.value = ''
  }

  const novaListaPendente = ref<{ date: Date; listLength: number } | null>(null)

  function definirNovaListaPendente(date: Date, listLength: number): void {
    novaListaPendente.value = { date, listLength }
  }

  function limparNovaListaPendente(): void {
    novaListaPendente.value = null
  }

  function abrirModal(): void {
    modalAberto.value = true
  }

  function fecharModal(): void {
    modalAberto.value = false
  }

  function abrirRemoverModal(): void {
    removerModalAberto.value = true
  }

  function fecharRemoverModal(): void {
    removerModalAberto.value = false
  }

  return {
    modalAberto,
    removerModalAberto,
    painelVisivel,
    painelTitulo,
    painelModo,
    painelDadosEntregas,
    painelDadosRelatorio,
    painelDataRelatorio,
    novaListaPendente,
    exibirPainel,
    ocultarPainel,
    definirNovaListaPendente,
    limparNovaListaPendente,
    abrirModal,
    fecharModal,
    abrirRemoverModal,
    fecharRemoverModal,
  }
}
