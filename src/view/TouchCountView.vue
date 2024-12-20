<template>
  <div>
    <div ref="pageRef">
      <TouchPage
        v-if="currentPage === 1"
        :pageTitle="'페이지 1'"
        :isFirstPage="true"
        :goToNextPage="goToNextPage"
        :touchData="touchData"
      />
      <TouchPage
        v-if="currentPage === 2"
        :pageTitle="'페이지 2'"
        :goToNextPage="goToNextPage"
        :goToPreviousPage="goToPreviousPage"
        :touchData="touchData"
      />
      <TouchPage
        v-if="currentPage === 3"
        :pageTitle="'페이지 3'"
        :isLastPage="true"
        :goToPreviousPage="goToPreviousPage"
        :touchData="touchData"
      />
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
})

const tracker = new TouchCountTracker({
  onTouchEnd: (data) => {
    touchData.value = { ...data }
    localStorage.setItem('touchData', JSON.stringify(data))
  },
  onTouchCancel: (data) => {
    console.log('터치 취소:', data)
  },
})

onMounted(() => {
  const savedData = localStorage.getItem('touchData')
  if (savedData) {
    const parsedData = JSON.parse(savedData)
    touchData.value = parsedData
    Object.assign(tracker.getData(), parsedData)
  }

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

const finishScenario = () => {}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 1rem;
}
</style>
