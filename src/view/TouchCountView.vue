<template>
  <div>
    <div ref="pageRef">
      <TouchPage v-if="currentPage === 1" :pageTitle="'Task Page 1'" :isFirstPage="true" :goToNextPage="goToNextPage"
        :touchData="touchData" />
      <TouchPage v-if="currentPage === 2" :pageTitle="'Task Page 2'" :goToNextPage="goToNextPage"
        :goToPreviousPage="goToPreviousPage" :touchData="touchData" />
      <TouchPage v-if="currentPage === 3" :pageTitle="'Task Page 3'" :isLastPage="true"
        :goToPreviousPage="goToPreviousPage" :touchData="touchData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

import TouchCountTracker from '@/module/touchCountTracker'
import type { TouchEventData } from '@/module/touchCountTracker'

import TouchPage from '@/component/TouchPage.vue'

const currentPage = ref(1)
const pageRef = ref<HTMLElement | null>(null)
const touchData = ref<TouchEventData>({
  touchStartCount: 0,
  touchEndCount: 0,
  touchCancelCount: 0,
  totalTouches: 0,
  activeTouches: 0,
  touchCoordinates: [
    {
      x: 0,
      y: 0,
      time_millis: 0,
    }
  ]
})

const tracker = new TouchCountTracker({
  onTouchEnd: (data) => {
    touchData.value = { ...data }
  },
})

onMounted(() => {
  tracker.startTracking()
})

onUnmounted(() => {
  tracker.stopTracking()
})

const goToNextPage = () => {
  if (currentPage.value < 3) {
    currentPage.value++
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 1rem;
}
</style>
