import type { Delivery } from '@/stores/delivery'

const STORAGE_KEYS = {
  LIST: 'delivery_list',
  DATE: 'delivery_date',
  LIMIT: 'delivery_limit',
} as const

export function useDeliveryPersistence() {
  function save(list: Delivery[], date: Date, limit: number): void {
    localStorage.setItem(STORAGE_KEYS.LIST, JSON.stringify(list))
    localStorage.setItem(STORAGE_KEYS.DATE, date.toISOString())
    localStorage.setItem(STORAGE_KEYS.LIMIT, limit.toString())
  }

  function load(): { list: Delivery[]; date: Date; limit: number } | null {
    const savedList = localStorage.getItem(STORAGE_KEYS.LIST)
    const savedDate = localStorage.getItem(STORAGE_KEYS.DATE)
    const savedLimit = localStorage.getItem(STORAGE_KEYS.LIMIT)

    if (savedList && savedDate) {
      try {
        const parsedList = JSON.parse(savedList)
        return {
          list: Array.isArray(parsedList) ? parsedList : [],
          date: new Date(savedDate),
          limit: savedLimit ? parseInt(savedLimit, 10) : 15,
        }
      } catch {
        return null
      }
    }
    return null
  }

  return { save, load }
}
