<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/30">
    <div class="max-w-240 mx-auto w-full px-4 py-6 md:py-8">
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-2">
          <div
            class="w-12 h-12 rounded-2xl bg-linear-to-br from-[#2463eb] to-[#1a4fc9] shadow-lg shadow-blue-500/25 flex items-center justify-center"
          >
            <IconSprite name="box" size="24" class="text-white shrink-0" />
          </div>
          <div>
            <h1
              class="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent"
            >
              Gerenciador de entregas
            </h1>
            <p class="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-[#2463eb]"></span>
              Organize rotas diárias, apartamentos, manhãs e brindes
            </p>
          </div>
        </div>
      </div>

      <ActionButtons
        @novo="handleNovoCommand"
        @ver-entregas="handleVerEntregas"
        @relatorio="handleRelatorio"
        @remover-modal="handleAbrirRemoverModal"
        @abrir-modal="handleAbrirModal"
      />

      <DeliveryList :deliveries="list" :limit="limit" :date="date" />

      <AddDeliveryModal
        v-if="modalAberto"
        :current-count="list.length"
        :max-limit="limit"
        @close="fecharModal"
        @submit="handleEnviarModal"
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
  </div>

  <RemoveDeliveryModal
    v-if="removerModalAberto"
    :deliveries="list"
    @close="fecharRemoverModal"
    @remove="handleRemoverDoModal"
  />

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
import { onMounted } from 'vue'
import { useDeliveryActions } from '@/composables/useDeliveryActions'
import AddDeliveryModal from '@/components/AddDeliveryModal.vue'
import DeliveryInfoPanel from '@/components/DeliveryInfoPanel.vue'
import DeliveryList from '@/components/DeliveryList.vue'
import ActionButtons from '@/components/ActionButtons.vue'
import RemoveDeliveryModal from '@/components/RemoveDeliveryModal.vue'
import ToastNotification from '@/components/ToastNotification.vue'
import ResolveDuplicateDialog from '@/components/ResolveDuplicateDialog.vue'
import ConfirmNewListDialog from '@/components/ConfirmNewListDialog.vue'
import IconSprite from '@/components/IconSprite.vue'

const {
  list,
  limit,
  date,
  duplicataPendente,
  modalAberto,
  removerModalAberto,
  painelVisivel,
  painelTitulo,
  painelModo,
  painelDadosEntregas,
  painelDadosRelatorio,
  painelDataRelatorio,
  fecharModal,
  fecharRemoverModal,
  novaListaPendente,
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
} = useDeliveryActions()

onMounted(() => {
  inicializar()
})
</script>

