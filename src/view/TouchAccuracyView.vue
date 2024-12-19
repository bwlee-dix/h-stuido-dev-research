<script setup lang="ts">
import TouchAccuracyTracker from '@/module/touchAccuracyTracker'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const buttonElement = ref<HTMLElement | null>(null)
const overlapWidth = ref<number>(0)
const overlapHeight = ref<number>(0)
const accuracy = ref<string>('0')

let touchTracker: any = null

onMounted(() => {
  if (!buttonElement.value) return

  touchTracker = new TouchAccuracyTracker(buttonElement.value, {
    touchAreaRadius: 20,
    isVisibleArea: true,
  })
})

onBeforeUnmount(() => {
  if (!touchTracker) return

  touchTracker = null
})

const updateAccuracy = () => {
  if (!touchTracker) return

  const {
    overlapWidth: newOverlapWidth,
    overlapHeight: newOverlapHeight,
    accuracy: newAccuracy,
  } = touchTracker.getTouchAccuracyDetails()

  overlapWidth.value = newOverlapWidth
  overlapHeight.value = newOverlapHeight
  accuracy.value = newAccuracy
}
</script>

<template>
  <div
    class="mx-auto flex h-dvh w-full max-w-[1400px] flex-col items-center justify-center gap-10"
  >
    <div class="content flex w-[400px] flex-col gap-[24px]">
      <div
        id="note"
        class="note flex w-full flex-col justify-center gap-4 rounded border border-black bg-white p-8"
      >
        <ul id="note-content" class="note-ul flex flex-col gap-3">
          <div class="row flex flex-row items-center gap-1">
            <div class="symbol h-4 w-4 bg-green-300"></div>
            <div class="label">터치 영역:</div>
            <b id="touch-area-size">40px X 40px</b>
          </div>

          <div class="row flex flex-row items-center gap-1">
            <div
              class="symbol h-4 w-4 rounded-full border border-dashed border-red-600"
            ></div>
            <div class="label">겹치는 영역:</div>
            <b>{{ overlapWidth }}px X {{ overlapHeight }}px</b>
          </div>

          <div class="row flex flex-row items-center gap-1">
            <div class="label">📌 정확도:</div>
            <b>{{ accuracy }}%</b>
          </div>
        </ul>
        <div class="desc-wrapper flex flex-col text-[14px] text-gray-700">
          <div class="title">정확도 계산식:</div>
          <div class="desc">(겹치는 영역 면적 / 터치 영역 면적) × 100</div>
        </div>
      </div>
      <div
        class="flex h-[64px] w-full cursor-pointer items-center justify-center rounded-md bg-blue-500 text-lg font-medium text-white"
        ref="buttonElement"
        @click="updateAccuracy"
      >
        Touch Accuracy Button
      </div>
    </div>
  </div>
</template>

<style>
.touch-button {
  width: 240px;
  height: 64px;
  background-color: #007bff;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  user-select: none;
  cursor: pointer;
}
</style>
