<template>
  <div v-if="modalVisible"
    class="absolute bottom-[120px] left-[40px] z-20 flex h-[400px] w-[400px] flex-col items-center gap-4 rounded-lg bg-white p-4 shadow-md">
    <div class="flex h-full w-full flex-col items-center justify-between">
      <div class="text-[24px] font-bold">{{ modalName }}</div>
      <slot name="body"></slot>
      <div ref="buttonElement"
        class="flex h-[64px] w-full cursor-pointer items-center justify-center rounded-md bg-blue-500 text-xl font-bold text-white"
        @click="hideModal">
        {{ buttonLabel }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModalStore } from '@/store/modal'
import { computed, } from 'vue'

const modalStore = useModalStore()
const modalVisible = computed(() => modalStore.modals.screen)

const hideModal = () => {
  modalStore.hideModal('screen')
}

export interface Props {
  modalName?: string
  buttonLabel?: string
}

withDefaults(defineProps<Props>(), {
  modalName: 'Screen Modal',
  buttonLabel: '확인',
})




</script>

<style scoped>
.touch-area {
  position: absolute;
  border: 2px dashed red;
  border-radius: 50%;
  pointer-events: none;
}

.overlap-area {
  position: absolute;
  background-color: rgba(0, 255, 0, 0.5);
  pointer-events: none;
}
</style>
