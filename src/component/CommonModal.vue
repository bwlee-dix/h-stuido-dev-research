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
    class="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-10"
  >
    <div
      class="absolute w-[80%] h-[70%] bg-white rounded-lg p-4 z-20 flex flex-col items-center justify-between"
    >
      <div class="w-full flex justify-end">
        <button
          @click="hideModal"
          class="w-8 h-8 rounded-full bg-gray-600 text-white flex justify-center items-center"
        >
          X
        </button>
      </div>
      <div class="flex flex-col items-center">
        <h2 class="text-xl font-bold mb-4">Common 모달입니다.</h2>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
