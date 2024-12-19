<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import GNB from './component/GNB.vue'
import VideoModal from './component/VideoModal.vue'
import CommonModal from './component/CommonModal.vue'
import ScreenModal from './component/ScreenModal.vue'

const modalVisible = ref(false)
const startY = ref(0)
const currentY = ref(0)
const isDragging = ref(false)
const threshold = 100

const handlePointerDown = (event: PointerEvent) => {
  console.log('Pointer Down:', event.clientY)
  if (!modalVisible.value && event.clientY < 50) {
    startY.value = event.clientY
    isDragging.value = true
  } else if (modalVisible.value) {
    startY.value = event.clientY
    isDragging.value = true
  }
}

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return

  currentY.value = event.clientY
  const deltaY = currentY.value - startY.value
  console.log('Pointer Move:', deltaY)

  if (!modalVisible.value && deltaY > threshold) {
    modalVisible.value = true
    console.log('Modal Opened')
    resetDragState()
  } else if (modalVisible.value && -deltaY > threshold) {
    modalVisible.value = false
    console.log('Modal Closed')
    resetDragState()
  }
}

const handlePointerUp = () => {
  console.log('Pointer Up')
  resetDragState()
}

const resetDragState = () => {
  startY.value = 0
  currentY.value = 0
  isDragging.value = false
}
</script>

<template>
  <div
    class="h-screen w-screen"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
  >
    <div
      v-if="modalVisible"
      :style="{
        transform: `translateY(${Math.max(currentY - startY, 0)}px)`,
        transition: isDragging ? 'none' : 'transform 0.3s ease',
      }"
      class="modal-container fixed z-40 flex h-20 w-full items-center justify-center overflow-hidden rounded-b-2xl bg-red-600 text-[24px] text-white"
    >
      Quick Control
    </div>
    <RouterView />
    <GNB />
    <!-- <ScreenModal :modal-name="'결제 완료'" :button-label="'충전 시작'">
      <template v-slot:body>
        <div class="flex w-full justify-start">
          <ul class="flex w-full flex-col gap-[8px] text-xl">
            <li class="flex w-full justify-between">
              <span>거래처</span>
              <span>현대자동차그룹</span>
            </li>
            <li class="flex w-full justify-between">
              <span>거래 일자</span>
              <span>2024.09.01</span>
            </li>
            <div class="my-8 h-[1px] w-full bg-black"></div>
            <li class="flex w-full justify-between">
              <span>거래 금액</span>
              <span>15,721원</span>
            </li>
          </ul>
        </div>
      </template>
    </ScreenModal> -->
    <VideoModal />
    <CommonModal />
  </div>
</template>

<style scoped>
.modal-container {
  transform: translateY(0);
  transition: transform 0.3s ease;
}
</style>
