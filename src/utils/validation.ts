import type { Delivery } from '@/stores/delivery'

export function validarNumero(numero: string): string | null {
  if (!numero) return 'Número é obrigatório.'
  if (!/^\d+$/.test(numero)) return 'Número deve conter apenas dígitos.'
  return null
}

export function validarNome(nome: string): string | null {
  if (!nome) return 'Nome é obrigatório.'
  if (nome.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres.'
  return null
}

export function validarPedido(
  numero: string,
  nome: string,
  date: Date | null,
  list: Delivery[],
  limit: number,
): { valid: boolean; error?: string } {
  if (!date) {
    return {
      valid: false,
      error: 'Crie uma lista primeiro clicando em "Amanhã" ou "Depois"',
    }
  }

  if (!numero || !nome) {
    return { valid: false, error: 'Número e nome são obrigatórios.' }
  }

  if (!/^\d+$/.test(numero)) {
    return { valid: false, error: 'Número do pedido deve conter apenas dígitos.' }
  }

  if (nome.trim().length < 2) {
    return { valid: false, error: 'Nome deve ter pelo menos 2 caracteres.' }
  }

  const existingNumIndex = list.findIndex((e) => e && e.num === numero)
  if (existingNumIndex !== -1) {
    return {
      valid: false,
      error: `Número ${numero} já existe na posição ${existingNumIndex + 1}`,
    }
  }

  if (list.length >= limit) {
    return {
      valid: false,
      error: `Limite de ${limit} entregas atingido. Remova algum pedido.`,
    }
  }

  return { valid: true }
}

export function verificarDuplicataNome(nome: string, list: Delivery[]): number[] {
  const nomeNormalizado = nome.trim().toLowerCase()
  return list.reduce<number[]>((acc, e, i) => {
    if (e && e.name && e.name.trim().toLowerCase() === nomeNormalizado) {
      acc.push(i)
    }
    return acc
  }, [])
}
