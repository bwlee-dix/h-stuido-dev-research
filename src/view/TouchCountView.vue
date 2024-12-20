<template>
  <div>
    <div ref="pageRef">
      <TouchPage
        v-if="currentPage === 1"
        :pageTitle="'페이지 1'"
        :isFirstPage="true"
        :goToNextPage="goToNextPage"
        :finishScenario="finishScenario"
        :touchData="touchData"
      />
      <TouchPage
        v-if="currentPage === 2"
        :pageTitle="'페이지 2'"
        :goToNextPage="goToNextPage"
        :goToPreviousPage="goToPreviousPage"
        :finishScenario="finishScenario"
        :touchData="touchData"
      />
      <TouchPage
        v-if="currentPage === 3"
        :pageTitle="'페이지 3'"
        :isLastPage="true"
        :goToPreviousPage="goToPreviousPage"
        :finishScenario="finishScenario"
        :touchData="touchData"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import TouchPage from '@/component/TouchPage.vue'
import TouchCountTracker from '@/module/touchCountTracker'
import PageScreenshotTracker from '@/module/pageScreenshotTracker'
import type { TouchEventData } from '@/module/touchCountTracker'
import router from '@/router'
import TouchHeatmapTracker from '@/module/touchHeatmapTracker'

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

const heatmapTracker = new TouchHeatmapTracker()

const screenshotTracker = new PageScreenshotTracker()

const handleTouch = (event: TouchEvent) => {
  const touch = event.touches[0]
  if (touch && pageRef.value) {
    const rect = pageRef.value.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    screenshotTracker.trackTouch(x, y, currentPage.value)
  }
}

onMounted(() => {
  const savedData = localStorage.getItem('touchData')
  if (savedData) {
    const parsedData = JSON.parse(savedData)
    touchData.value = parsedData
    Object.assign(tracker.getData(), parsedData)
  }

  tracker.startTracking()
  screenshotTracker.loadFromLocalStorage()

  if (pageRef.value) {
    pageRef.value.addEventListener('touchstart', handleTouch)
  }

  heatmapTracker.startTracking()

  if (pageRef.value) {
    pageRef.value.addEventListener('touchstart', handleTouch)
  }
})

onUnmounted(() => {
  tracker.stopTracking()
  if (pageRef.value) {
    pageRef.value.removeEventListener('touchstart', handleTouch)
  }
  heatmapTracker.stopTracking()

  if (pageRef.value) {
    pageRef.value.removeEventListener('touchstart', handleTouch)
  }
})

const goToNextPage = () => {
  if (currentPage.value < 3) {
    if (pageRef.value) {
      screenshotTracker.capturePageState(currentPage.value, pageRef.value)
    }
    currentPage.value++
  }
}

const goToPreviousPage = () => {
  if (currentPage.value > 1) {
    if (pageRef.value) {
      screenshotTracker.capturePageState(currentPage.value, pageRef.value)
    }
    currentPage.value--
  }
}

const finishScenario = () => {
  if (pageRef.value) {
    screenshotTracker.capturePageState(currentPage.value, pageRef.value)
  }
  router.push('/touch-heatmap')
}

watch(currentPage, (newPage, oldPage) => {
  if (oldPage && pageRef.value) {
    screenshotTracker.capturePageState(oldPage, pageRef.value)
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 1rem;
}
</style>
