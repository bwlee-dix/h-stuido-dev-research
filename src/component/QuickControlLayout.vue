<script setup lang="ts">
import { useDragHandler } from '@/module/quickControl'

const {
  modalVisible,
  startY,
  currentY,
  isDragging,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
} = useDragHandler()
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
    <slot name="body"></slot>
  </div>
</template>

<style scoped></style>
