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

  function handleNovoCommand(data: Date): void {
    const result = store.novoCommand(data)
    if (result.success) {
      ui.ocultarPainel()
    } else if ('needsConfirmation' in result && result.needsConfirmation) {
      ui.definirNovaListaPendente(data, result.listLength)
    }
  }

  function handleConfirmarNovaLista(): void {
    const pending = ui.novaListaPendente.value
    if (!pending) return
    store.forcarNovoCommand(pending.date)
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
      const titulo = result.mode === 'no-list' ? 'Sem lista ativa' : 'Lista do dia'
      ui.exibirPainel(titulo, result.mode)
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
    if (!store.date) {
      exibirNotificacao('Crie uma lista primeiro clicando em "Nova lista".', true)
      return
    }
    ui.abrirModal()
  }

  function handleEnviarModal(data: DeliveryFormData): void {
    const result = store.adicionarPedidoLogic(data.num, data.name, data.ap, data.manha, data.brinde, data.cidade)
    if (result.success || ('isDuplicate' in result && result.isDuplicate)) {
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
    const result = store.removerPedido(numero)
    if (result.success) {
      ui.fecharRemoverModal()
    }
  }

  function handleRemoverDelivery(numero: string): void {
    store.removerPedido(numero)
  }

  function handleConfirmarResolucao(existing: string, novo: string): void {
    store.resolverDuplicata(existing, novo)
  }

  function handleCancelarResolucao(): void {
    store.ignorarDuplicata()
  }

  function handleOcultarPainel(): void {
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
    handleRemoverDelivery,
    handleConfirmarResolucao,
    handleCancelarResolucao,
    handleOcultarPainel,
    inicializar,
  }
}
