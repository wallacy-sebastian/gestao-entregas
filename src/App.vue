<template>
  <main class="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
    <div class="max-w-240 mx-auto w-full px-4 py-6 md:py-8">
      <header class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-12 h-12 rounded-xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-lg shadow-blue-500/25 flex items-center justify-center"
          >
            <IconSprite name="box" size="24" class="text-white shrink-0" />
          </div>
          <div class="flex-1">
            <h1
              class="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-gray-100"
            >
              Gerenciador de entregas
            </h1>
            <p class="text-slate-500 dark:text-slate-400 text-sm mt-1 flex items-center gap-2">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#2463eb]"></span>
              Organize rotas diárias, apartamentos, manhãs e brindes
            </p>
          </div>
          <button
            @click="darkMode.toggle()"
            class="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#2463eb]/20"
            :aria-label="darkMode.isDark.value ? 'Modo claro' : 'Modo escuro'"
          >
            <IconSprite :name="darkMode.isDark.value ? 'sun' : 'moon'" size="20" />
          </button>
        </div>
      </header>

      <ActionButtons
        @nova-lista="novaListaModalAberto = true"
        @ver-entregas="handleVerEntregas"
        @relatorio="handleRelatorio"
        @abrir-modal="handleAbrirModal"
      />

      <DeliveryList :deliveries="list" :limit="limit" :date="date" @remove="handleRemoverDelivery" />

      <AddDeliveryModal
        v-if="modalAberto"
        :current-count="list.length"
        :max-limit="limit"
        @close="fecharModal"
        @submit="handleEnviarModal"
      />

      <NewListModal
        v-if="novaListaModalAberto"
        @confirm="handleNovoCommand"
        @cancel="novaListaModalAberto = false"
      />

      <ConfirmNewListDialog
        v-if="novaListaPendente"
        :list-length="novaListaPendente.listLength"
        @confirm="handleConfirmarNovaLista"
        @cancel="handleCancelarNovaLista"
      />

      <DeliveryInfoPanel
        v-if="painelVisivel"
        :title="painelTitulo"
        :mode="painelModo"
        :deliveries-data="painelDadosEntregas"
        :report-stats="painelDadosRelatorio"
        :report-date-str="painelDataRelatorio"
        @close="handleOcultarPainel"
      />

    </div>
  </main>

  <ToastNotification />
  <ResolveDuplicateDialog
    v-if="duplicataPendente"
    :duplicata-pendente="duplicataPendente"
    :lista="list"
    @confirm="handleConfirmarResolucao"
    @cancel="handleCancelarResolucao"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useDeliveryActions } from '@/composables/useDeliveryActions'
import { useDarkMode } from '@/composables/useDarkMode'
import AddDeliveryModal from '@/components/AddDeliveryModal.vue'
import DeliveryInfoPanel from '@/components/DeliveryInfoPanel.vue'
import DeliveryList from '@/components/DeliveryList.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import ResolveDuplicateDialog from '@/components/ResolveDuplicateDialog.vue'
import ConfirmNewListDialog from '@/components/ConfirmNewListDialog.vue'
import NewListModal from '@/components/NewListModal.vue'
import IconSprite from '@/components/IconSprite.vue'

const novaListaModalAberto = ref(false)

const darkMode = useDarkMode()

const {
  list,
  limit,
  date,
  duplicataPendente,
  modalAberto,
  painelVisivel,
  painelTitulo,
  painelModo,
  painelDadosEntregas,
  painelDadosRelatorio,
  painelDataRelatorio,
  fecharModal,
  novaListaPendente,
  handleNovoCommand,
  handleConfirmarNovaLista,
  handleCancelarNovaLista,
  handleVerEntregas,
  handleRelatorio,
  handleAbrirModal,
  handleEnviarModal,
  handleRemoverDelivery,
  handleConfirmarResolucao,
  handleCancelarResolucao,
  handleOcultarPainel,
  inicializar,
} = useDeliveryActions()

onMounted(() => {
  darkMode.init()
  inicializar()
})
</script>

