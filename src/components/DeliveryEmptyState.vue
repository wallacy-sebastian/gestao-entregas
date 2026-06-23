<template>
  <div class="py-12 px-6 text-center">
    <div class="max-w-sm mx-auto">
      <div
        class="w-20 h-20 mx-auto mb-4 rounded-full bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center"
      >
        <IconSprite v-if="hasList" name="sun" size="32" class="text-amber-400" :stroke-width="1.5" />
        <IconSprite v-else name="box" size="32" class="text-slate-400" :stroke-width="1.5" />
      </div>
      <h3 class="text-slate-700 font-medium mb-1">{{ hasList ? 'Nenhuma entrega programada' : 'Nenhuma lista criada' }}</h3>
      <p class="text-slate-400 text-sm">
        <template v-if="hasList">
          Use o botão <strong class="bg-slate-100 px-2 py-0.5 rounded-full">Adicionar</strong> para incluir pedidos na rota
        </template>
        <template v-else>
          Clique em <strong class="bg-slate-100 px-2 py-0.5 rounded-full">Amanhã</strong> ou
          <strong class="bg-slate-100 px-2 py-0.5 rounded-full">Depois</strong> para começar
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSprite from '@/components/IconSprite.vue'

defineProps<{
  hasList?: boolean
}>()
</script>
