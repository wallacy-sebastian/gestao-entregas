import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useDeliveryPersistence } from '@/utils/persistence'
import { useNotification } from '@/composables/useNotification'
import { validarPedido, verificarDuplicataNome } from '@/utils/validation'
import { formatDate } from '@/utils/format'

export interface Delivery {
  num: string
  name: string
  ap: boolean
  manha: boolean
  brinde: boolean
}

export interface DeliveryFormData {
  num: string
  nome: string
  ap: boolean
  manha: boolean
  brinde: boolean
}

export interface DeliveryListData {
  list: Delivery[]
  total: number
}

export interface ReportStats {
  manha: number
  ap: number
  brinde: number
  total: number
}

export type AdicionarResult =
  | { success: true }
  | { success: false; error: string }
  | { success: false; error: string; isDuplicate: true; positions: string }

export type NovoResult =
  | { success: true }
  | { success: false }
  | { success: false; needsConfirmation: true; listLength: number }

export type ListQueryResult = { valid: false; mode: 'no-list' | 'no-deliveries' } | { valid: true; data: DeliveryListData }

export type ReportQueryResult = { valid: false } | { valid: true; stats: ReportStats; date: string }

export const useDeliveryStore = defineStore('delivery', () => {
  const list = ref<Delivery[]>([])
  const limit = ref<number>(15)
  const date = ref<Date | null>(null)
  const duplicataPendente = ref<{ newEntry: Delivery; existingIndices: number[] } | null>(null)
  const { exibirNotificacao } = useNotification()

  const { save, load } = useDeliveryPersistence()

  watch(
    [list, date, limit],
    () => {
      if (date.value) {
        save(list.value, date.value, limit.value)
      }
    },
    { deep: true },
  )

  const adicionarPedidoComSuffix = (
    newEntry: Delivery,
    suffixExistente: string,
    suffixNovo: string,
  ): boolean => {
    if (!suffixExistente?.trim() || !suffixNovo?.trim()) {
      exibirNotificacao('Operação cancelada - sobrenomes não fornecidos.', true)
      return false
    }

    const nomeOriginal = newEntry.name.trim().toLowerCase()

    for (const item of list.value) {
      if (item && item.name.trim().toLowerCase() === nomeOriginal) {
        item.name += ` ${suffixExistente.trim()}`
      }
    }

    newEntry.name = `${newEntry.name.trim()} ${suffixNovo.trim()}`

    if (list.value.length < limit.value) {
      list.value.push(newEntry)
      exibirNotificacao(
        `Duplicatas resolvidas! Pedido ${newEntry.num} adicionado como "${newEntry.name}".`,
      )
      return true
    } else {
      exibirNotificacao(
        `Limite de entregas atingido. Remova um pedido para adicionar ${newEntry.num}.`,
        true,
      )
      return false
    }
  }

  function adicionarPedidoLogic(
    numero: string,
    nome: string,
    isAp: boolean,
    isManha: boolean,
    isBrinde: boolean,
  ): AdicionarResult {
    const validacao = validarPedido(numero, nome, date.value, list.value, limit.value)
    if (!validacao.valid) {
      exibirNotificacao(validacao.error!, true)
      return { success: false, error: validacao.error! }
    }

    const newEntry: Delivery = {
      num: numero,
      name: nome.trim(),
      ap: isAp,
      manha: isManha,
      brinde: isBrinde,
    }

    const duplicateIndices = verificarDuplicataNome(newEntry.name, list.value)

    if (duplicateIndices.length > 0) {
      if (duplicataPendente.value) {
        exibirNotificacao('Já existe uma pendência de duplicata para resolver.', true)
        return { success: false, error: 'Já existe uma pendência de duplicata para resolver.' }
      }

      duplicataPendente.value = { newEntry, existingIndices: duplicateIndices }
      const positions = duplicateIndices.map((i) => i + 1).join(', ')

      return {
        success: false,
        error: `Nome duplicado detectado nas posições: ${positions}`,
        isDuplicate: true,
        positions,
      }
    }

    list.value.push(newEntry)
    exibirNotificacao(`Pedido ${newEntry.num} adicionado na posição ${list.value.length}`)
    return { success: true }
  }

  function resolverDuplicata(suffixExisting?: string, suffixNovo?: string): void {
    if (!duplicataPendente.value) return

    if (suffixExisting === undefined || suffixNovo === undefined) {
      const { existingIndices } = duplicataPendente.value
      const validIndices = existingIndices.filter(
        (idx) => idx >= 0 && idx < list.value.length && list.value[idx],
      )
      if (validIndices.length === 0) {
        exibirNotificacao('Pedidos originais não encontrados mais.', true)
        duplicataPendente.value = null
        return
      }
      exibirNotificacao('Preencha os sobrenomes no diálogo aberto.', true)
      return
    }

    adicionarPedidoComSuffix(duplicataPendente.value.newEntry, suffixExisting, suffixNovo)
    duplicataPendente.value = null
  }

  function ignorarDuplicata(): void {
    if (duplicataPendente.value) {
      duplicataPendente.value = null
      exibirNotificacao('Duplicata ignorada. O pedido não foi adicionado.')
    }
  }

  function novoCommand(days: number): NovoResult {
    if (duplicataPendente.value) {
      exibirNotificacao(
        'Resolva a pendência de duplicata primeiro.',
        true,
      )
      return { success: false }
    }

    if (list.value.length > 0) {
      return { success: false, needsConfirmation: true, listLength: list.value.length }
    }

    const d = new Date()
    d.setDate(d.getDate() + days)
    date.value = d
    list.value = []
    duplicataPendente.value = null
    exibirNotificacao(`Lista criada para ${formatDate(d)} · limite de ${limit.value} entregas.`)
    return { success: true }
  }

  function forcarNovoCommand(days: number): NovoResult {
    const d = new Date()
    d.setDate(d.getDate() + days)
    date.value = d
    list.value = []
    duplicataPendente.value = null
    exibirNotificacao(`Lista criada para ${formatDate(d)} · limite de ${limit.value} entregas.`)
    return { success: true }
  }

  function verEntregasPersistente(): ListQueryResult {
    if (!date.value) return { valid: false, mode: 'no-list' }
    if (list.value.length === 0) return { valid: false, mode: 'no-deliveries' }

    return {
      valid: true,
      data: {
        list: list.value.map((d) => ({ ...d })),
        total: list.value.length,
      },
    }
  }

  function relatorioPersistente(): ReportQueryResult {
    if (!date.value) return { valid: false }

    const manha = list.value.filter((e) => e && e.manha).length
    const ap = list.value.filter((e) => e && e.ap).length
    const brinde = list.value.filter((e) => e && e.brinde).length
    const total = list.value.length

    return {
      valid: true,
      stats: { manha, ap, brinde, total },
      date: formatDate(date.value),
    }
  }

  function removerPedido(numero: string): { success: boolean } {
    const idx = list.value.findIndex((e) => e && e.num === numero)
    if (idx !== -1) {
      const removed = list.value[idx]
      if (removed) {
        list.value.splice(idx, 1)
        exibirNotificacao(`Removido: ${removed.num} - ${removed.name}`)
        return { success: true }
      }
    }
    exibirNotificacao(`Pedido ${numero} não encontrado.`, true)
    return { success: false }
  }

  const inicializar = (): void => {
    const saved = load()
    if (saved) {
      list.value = saved.list
      date.value = saved.date
      limit.value = saved.limit
    }
  }

  return {
    list,
    limit,
    date,
    duplicataPendente,
    inicializar,
    novoCommand,
    forcarNovoCommand,
    verEntregasPersistente,
    relatorioPersistente,
    adicionarPedidoLogic,
    resolverDuplicata,
    ignorarDuplicata,
    removerPedido,
  }
})
