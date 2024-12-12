<script setup lang="ts">
import { useModalStore } from '../store/modal'
import { computed } from 'vue'

const modalStore = useModalStore()
const modalVisible = computed(() => modalStore.modals.common)

const hideModal = () => {
  modalStore.hideModal('common')
}
</script>

<template>
  <div
    v-if="modalVisible"
    class="fixed left-0 top-0 z-[99999] flex h-full w-full items-center justify-center bg-black/50"
    @click="hideModal"
  >
    <div
      class="absolute z-20 flex h-[70%] w-[80%] flex-col items-center justify-between rounded-lg bg-white p-4"
    >
      <div class="flex w-full justify-end">
        <button
          @click="hideModal"
          class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white"
        >
          X
        </button>
      </div>
      <div class="flex flex-col items-center">
        <h2 class="mb-4 text-xl font-bold">Common 모달입니다.</h2>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
