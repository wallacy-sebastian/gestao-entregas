import { storeToRefs } from 'pinia'
import { useDeliveryStore } from '@/stores/delivery'
import { useUIState } from './useUIState'
import { useNotification } from './useNotification'
import type { DeliveryFormData } from '@/stores/delivery'

export function useDeliveryActions() {
  const store = useDeliveryStore()
  const ui = useUIState()
  const { exibirNotificacao } = useNotification()

  const { list, limit, date, duplicataPendente } = storeToRefs(store)

  function handleNovoCommand(days: number): void {
    const result = store.novoCommand(days)
    if (result.success) {
      ui.ocultarPainel()
    } else if ('needsConfirmation' in result && result.needsConfirmation) {
      ui.definirNovaListaPendente(days, result.listLength)
    }
  }

  function handleConfirmarNovaLista(): void {
    const pending = ui.novaListaPendente.value
    if (!pending) return
    store.forcarNovoCommand(pending.days)
    ui.limparNovaListaPendente()
    ui.ocultarPainel()
  }

  function handleCancelarNovaLista(): void {
    ui.limparNovaListaPendente()
  }

  function handleVerEntregas(): void {
    if (store.duplicataPendente) {
      exibirNotificacao('Resolva a pendência de duplicata primeiro.', true)
      return
    }
    const result = store.verEntregasPersistente()
    if (!result.valid) {
      ui.exibirPainel(
        result.mode === 'no-list' ? 'Sem lista ativa' : 'Entregas do dia',
        result.mode,
      )
      return
    }
    ui.exibirPainel('Relação de entregas', 'delivery-list', { deliveriesData: result.data })
  }

  function handleRelatorio(): void {
    if (store.duplicataPendente) {
      exibirNotificacao('Resolva a pendência de duplicata primeiro.', true)
      return
    }
    const result = store.relatorioPersistente()
    if (!result.valid) {
      ui.exibirPainel('Relatório', 'no-list')
      return
    }
    ui.exibirPainel('Relatório analítico', 'report', {
      reportStats: result.stats,
      reportDate: result.date,
    })
  }

  function handleAbrirModal(): void {
    if (store.duplicataPendente) {
      exibirNotificacao('Resolva a pendência de duplicata primeiro.', true)
      return
    }
    ui.abrirModal()
  }

  function handleEnviarModal(data: DeliveryFormData): void {
    const result = store.adicionarPedidoLogic(data.num, data.nome, data.ap, data.manha, data.brinde)
    if (result.success) {
      ui.fecharModal()
    }
  }

  function handleAbrirRemoverModal(): void {
    if (store.duplicataPendente) {
      exibirNotificacao('Resolva a pendência de duplicata primeiro.', true)
      return
    }
    if (list.value.length === 0) {
      exibirNotificacao('Nenhuma entrega cadastrada para remover.', true)
      return
    }
    ui.abrirRemoverModal()
  }

  function handleRemoverDoModal(numero: string): void {
    store.removerPedido(numero)
    ui.fecharRemoverModal()
  }

  function handleConfirmarResolucao(existing: string, novo: string): void {
    store.resolverDuplicata(existing, novo)
    ui.ocultarPainel()
  }

  function handleCancelarResolucao(): void {
    store.ignorarDuplicata()
    ui.ocultarPainel()
  }

  function handleOcultarPainel(): void {
    if (store.duplicataPendente) {
      store.ignorarDuplicata()
    }
    ui.ocultarPainel()
  }

  function inicializar(): void {
    store.inicializar()
  }

  return {
    list,
    limit,
    date,
    duplicataPendente,
    modalAberto: ui.modalAberto,
    removerModalAberto: ui.removerModalAberto,
    painelVisivel: ui.painelVisivel,
    painelTitulo: ui.painelTitulo,
    painelModo: ui.painelModo,
    painelDadosEntregas: ui.painelDadosEntregas,
    painelDadosRelatorio: ui.painelDadosRelatorio,
    painelDataRelatorio: ui.painelDataRelatorio,
    fecharModal: ui.fecharModal,
    fecharRemoverModal: ui.fecharRemoverModal,
    novaListaPendente: ui.novaListaPendente,
    handleNovoCommand,
    handleConfirmarNovaLista,
    handleCancelarNovaLista,
    handleVerEntregas,
    handleRelatorio,
    handleAbrirModal,
    handleEnviarModal,
    handleAbrirRemoverModal,
    handleRemoverDoModal,
    handleConfirmarResolucao,
    handleCancelarResolucao,
    handleOcultarPainel,
    inicializar,
  }
}
