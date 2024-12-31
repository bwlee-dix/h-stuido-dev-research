<template>
  <div class="touch-data-container">
    <div v-for="(value, key) in displayData" :key="key" class="data-item">
      <div class="data-label">{{ formatLabel(key) }}:</div>
      <div class="data-value">{{ value }}</div>
    </div>

    <div class="accordion">
      <div class="accordion-header" @click="toggleCoordinates">
        <div class="flex items-center justify-between w-full">
          <span>touchCoordinates(터치 좌표 데이터) ({{ touchData.touchCoordinates.length }}개)</span>
          <span class="toggle-icon">{{ isOpen ? '▲' : '▼' }}</span>
        </div>
      </div>
      <div v-if="isOpen" class="accordion-content">
        <div v-for="(coord, index) in touchData.touchCoordinates" :key="index" class="coordinate-item">
          <div class="coordinate-header">좌표 #{{ index + 1 }}</div>
          <div class="coordinate-details">
            <div>X: {{ coord.x }}</div>
            <div>Y: {{ coord.y }}</div>
            <div>시간: {{ new Date(coord.time_millis).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TouchEventData } from '@/module/touchCountTracker'

const props = defineProps<{
  touchData: TouchEventData
}>()

const isOpen = ref(false)

type DisplayDataKeys = Exclude<keyof TouchEventData, 'touchCoordinates'>

const displayData = computed(() => {
  const result: Partial<TouchEventData> = {}
  const keysToShow: DisplayDataKeys[] = ['touchStartCount', 'touchEndCount', 'touchCancelCount', 'totalTouches', 'activeTouches']

  keysToShow.forEach(key => {
    result[key] = props.touchData[key]
  })

  return result
})

const toggleCoordinates = () => {
  isOpen.value = !isOpen.value
}

const formatLabel = (key: string) => {
  const labels: Record<string, string> = {
    touchStartCount: 'touchStartCount(터치 시작 횟수)',
    touchEndCount: 'touchEndCount(터치 종료 횟수)',
    touchCancelCount: 'touchCancelCount(터치 취소 횟수)',
    totalTouches: 'totalTouches(전체 터치 횟수)',
    activeTouches: 'activeTouches(현재 활성 터치)'
  }
  return labels[key] || key
}
</script>

<style scoped>
.touch-data-container {
  font-family: monospace;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.data-item {
  display: flex;
  margin-bottom: 0.5rem;
}

.data-label {
  font-weight: bold;
  margin-right: 1rem;
  min-width: 150px;
}

.accordion {
  margin-top: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.accordion-header {
  padding: 0.75rem;
  background-color: #f1f1f1;
  cursor: pointer;
  user-select: none;
}

.accordion-header:hover {
  background-color: #e9e9e9;
}

.toggle-icon {
  font-size: 0.8rem;
}

.accordion-content {
  padding: 1rem;
  background-color: white;
}

.coordinate-item {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #eee;
  border-radius: 4px;
}

.coordinate-header {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #666;
}

.coordinate-details {
  padding-left: 1rem;
}

.coordinate-details>div {
  margin-bottom: 0.25rem;
}
</style>
