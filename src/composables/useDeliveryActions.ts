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

  function handleEditDelivery(numero: string): void {
    if (store.duplicataPendente) {
      exibirNotificacao('Resolva a pendência de duplicata primeiro.', true)
      return
    }
    if (!store.date) {
      exibirNotificacao('Crie uma lista primeiro clicando em "Nova lista".', true)
      return
    }
    const delivery = list.value.find((d) => d && d.num === numero)
    if (delivery) {
      ui.definirEditandoDelivery(delivery)
      ui.abrirModal()
    }
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
    if (ui.editandoDelivery.value) {
      const oldNum = ui.editandoDelivery.value.num
      const result = store.adicionarPedidoLogic(data.num, data.name, data.ap, data.manha, data.brinde, data.cidade, oldNum)
      if (result.success) {
        const idx = list.value.findIndex((d) => d && d.num === oldNum)
        if (idx !== -1) list.value.splice(idx, 1)
        ui.fecharModal()
      }
    } else {
      const result = store.adicionarPedidoLogic(data.num, data.name, data.ap, data.manha, data.brinde, data.cidade)
      if (result.success || ('isDuplicate' in result && result.isDuplicate)) {
        ui.fecharModal()
      }
    }
  }

  function handleFecharModal(): void {
    ui.fecharModal()
  }

  function handleRemoverDelivery(numero: string): void {
    const delivery = list.value.find((d) => d && d.num === numero)
    if (delivery) {
      ui.abrirConfirmacaoRemocao(delivery)
    }
  }

  function handleConfirmarRemocao(): void {
    const delivery = ui.deliveryParaRemover.value
    if (delivery) {
      store.removerPedido(delivery.num)
      ui.fecharConfirmacaoRemocao()
    }
  }

  function handleCancelarRemocao(): void {
    ui.fecharConfirmacaoRemocao()
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
    editandoDelivery: ui.editandoDelivery,
    confirmRemoverDeliveryAberto: ui.confirmRemoverDeliveryAberto,
    deliveryParaRemover: ui.deliveryParaRemover,
    painelVisivel: ui.painelVisivel,
    painelTitulo: ui.painelTitulo,
    painelModo: ui.painelModo,
    painelDadosEntregas: ui.painelDadosEntregas,
    painelDadosRelatorio: ui.painelDadosRelatorio,
    painelDataRelatorio: ui.painelDataRelatorio,
    novaListaPendente: ui.novaListaPendente,
    handleNovoCommand,
    handleConfirmarNovaLista,
    handleCancelarNovaLista,
    handleVerEntregas,
    handleRelatorio,
    handleEditDelivery,
    handleAbrirModal,
    handleEnviarModal,
    handleFecharModal,
    handleRemoverDelivery,
    handleConfirmarRemocao,
    handleCancelarRemocao,
    handleConfirmarResolucao,
    handleCancelarResolucao,
    handleOcultarPainel,
    inicializar,
  }
}
