<template>
  <div :class="['text-center', compact ? 'py-8 px-4' : 'py-12 px-6']">
    <div class="max-w-sm mx-auto">
      <div
        :class="[
          'mx-auto rounded-xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center',
          compact ? 'w-16 h-16 mb-3' : 'w-20 h-20 mb-4',
        ]"
      >
        <IconSprite
          v-if="hasList"
          name="sun"
          :size="compact ? 28 : 32"
          class="text-amber-400"
          :stroke-width="1.5"
        />
        <IconSprite
          v-else
          name="box"
          :size="compact ? 28 : 32"
          class="text-slate-400"
          :stroke-width="1.5"
        />
      </div>
      <h3 :class="['text-slate-700 dark:text-gray-300 font-medium mb-1', compact ? 'text-sm' : '']">
        {{ hasList ? 'Nenhuma entrega programada' : 'Nenhuma lista criada' }}
      </h3>
      <p class="text-slate-400 dark:text-gray-500 text-sm">
        <template v-if="hasList">
          Use o botão <strong class="bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Adicionar</strong> para incluir pedidos na rota
        </template>
        <template v-else>
          Clique em <strong class="bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Amanhã</strong> ou
          <strong class="bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">Depois</strong> para começar
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSprite from '@/components/IconSprite.vue'

defineProps<{
  hasList?: boolean
  compact?: boolean
}>()
</script>
