<template>
  <svg
    :width="sizeNum"
    :height="sizeNum"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeNum"
    stroke-linecap="round"
    stroke-linejoin="round"
    role="img"
    :aria-label="label || ariaLabels[name] || undefined"
    :aria-hidden="!(label || ariaLabels[name]) || undefined"
    v-html="icon"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    strokeWidth?: number | string
    label?: string
  }>(),
  { size: 16, strokeWidth: 2 },
)

const sizeNum = computed(() => Number(props.size))
const strokeNum = computed(() => Number(props.strokeWidth))

const icons: Record<string, string> = {
  'alert-circle':
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
  box: '<path d="M3 9h18M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9M3 9l6.6-4.4a2 2 0 0 1 2.8 0L21 9"/><path d="M12 9v9"/><path d="M8 13h8"/>',
  building:
    '<rect x="3" y="2" width="18" height="20" rx="2" ry="2"/><line x1="3" y1="8" x2="21" y2="8"/><line x1="9" y1="2" x2="9" y2="6"/><line x1="15" y1="2" x2="15" y2="6"/><rect x="7" y="12" width="3" height="4" rx="0.5"/><rect x="14" y="12" width="3" height="4" rx="0.5"/>',
  calendar:
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  'calendar-days':
    '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  'calendar-plus':
    '<path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><line x1="16" y1="3" x2="16" y2="7"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="4" y1="11" x2="20" y2="11"/><line x1="19" y1="15" x2="19" y2="21"/><line x1="16" y1="18" x2="22" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  'clipboard-list':
    '<rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="12" y1="17" x2="12" y2="17"/><path d="M12 11.01v0"/><path d="M12 17.01v0"/><line x1="9" y1="14" x2="9" y2="14"/><line x1="15" y1="14" x2="15" y2="14"/><path d="M9 14.01v0"/><path d="M15 14.01v0"/>',
  clock:
    '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  gift: '<path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"/><path d="M12 2v20M2 12h20M8 2l4 4 4-4"/>',
  info: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  'pie-chart':
    '<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 12Z"/><path d="M21 3v9h-9"/>',
  pencil: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  'plus-circle':
    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>',
  'sun-full': '<circle cx="12" cy="12" r="5" fill="currentColor" stroke="none"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="5.64" y1="18.36" x2="4.22" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>',
  'trash-2':
    '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'user-search':
    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
}

const ariaLabels: Record<string, string> = {
  'alert-circle': 'Alerta',
  box: 'Caixa',
  building: 'Prédio',
  calendar: 'Calendário',
  'calendar-days': 'Calendário com dias',
  'calendar-plus': 'Adicionar ao calendário',
  check: 'Confirmado',
  'clipboard-list': 'Lista',
  clock: 'Relógio',
  copy: 'Copiar',
  gift: 'Presente',
  info: 'Informação',
  moon: 'Modo escuro',
  pencil: 'Editar',
  list: 'Lista',
  'map-pin': 'Localização',
  'pie-chart': 'Gráfico',
  'plus-circle': 'Adicionar',
  'sun-full': 'Sol',
  'trash-2': 'Lixeira',
  user: 'Usuário',
  'user-search': 'Buscar usuário',
  x: 'Fechar',
}

const icon = computed(() => {
  const svg = icons[props.name]
  if (svg) return svg
  return '<circle cx="12" cy="12" r="10" opacity="0.2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16" opacity="0.2"/>'
})
</script>
