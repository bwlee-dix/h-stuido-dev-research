<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { CSSProperties } from 'vue'

const button = ref<HTMLDivElement | null>(null)
const accuracy = ref(0)
const overlapStyle = ref<CSSProperties>({
  display: 'none',
  position: 'absolute',
  backgroundColor: 'rgba(255, 0, 0, 0.5)', // 겹치는 영역 표시 색상
  zIndex: '10',
})
const touchAreaStyle = ref<CSSProperties>({
  display: 'none',
  position: 'absolute',
  backgroundColor: 'rgba(0, 255, 0, 0.5)', // 터치 영역 표시 색상
  zIndex: '5',
})

const handleTouch = (event: MouseEvent) => {
  if (!button.value) return

  const rect = button.value.getBoundingClientRect()
  const buttonArea = {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  }

  const touchAreaRadius = 20 // 터치 영역 반경
  const touchArea = {
    left: event.clientX - touchAreaRadius,
    top: event.clientY - touchAreaRadius,
    right: event.clientX + touchAreaRadius,
    bottom: event.clientY + touchAreaRadius,
    width: touchAreaRadius * 2,
    height: touchAreaRadius * 2,
  }

  // 겹치는 영역 계산
  const overlapWidth = Math.max(
    0,
    Math.min(buttonArea.right, touchArea.right) - Math.max(buttonArea.left, touchArea.left),
  )
  const overlapHeight = Math.max(
    0,
    Math.min(buttonArea.bottom, touchArea.bottom) - Math.max(buttonArea.top, touchArea.top),
  )
  const overlapArea = overlapWidth * overlapHeight

  // 터치 영역 면적
  const touchAreaSize = touchArea.width * touchArea.height

  // 정확도 계산
  accuracy.value = ((overlapArea / touchAreaSize) * 100).toFixed(2) as unknown as number

  // 터치 영역 스타일 업데이트
  touchAreaStyle.value = {
    display: 'block',
    position: 'absolute',
    left: `${touchArea.left}px`,
    top: `${touchArea.top}px`,
    width: `${touchArea.width}px`,
    height: `${touchArea.height}px`,
    backgroundColor: 'rgba(0, 255, 0, 0.5)', // 터치 영역 색상
    zIndex: '5',
  }

  // 겹치는 영역 스타일 업데이트
  overlapStyle.value = {
    display: 'block',
    position: 'absolute',
    left: `${Math.max(buttonArea.left, touchArea.left)}px`,
    top: `${Math.max(buttonArea.top, touchArea.top)}px`,
    width: `${overlapWidth}px`,
    height: `${overlapHeight}px`,
    backgroundColor: 'rgba(255, 0, 0, 0.5)', // 겹치는 영역 색상
    zIndex: '10',
  }
}
</script>

<template>
  <div>
    <div ref="button" class="touch-button" @click="handleTouch">터치 버튼</div>
    <div :style="overlapStyle"></div>
    <div :style="touchAreaStyle"></div>
    <div class="mt-[64px] select-none flex justify-center">
      <div class="w-fit">정확도: {{ accuracy }}%</div>
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
