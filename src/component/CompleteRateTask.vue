<template>
  <div class="task-wrapper">
    <div class="task-content">
      <slot :isGuideVisible="isGuideVisible" />
    </div>
    <GuideTooltip
      v-if="isGuideVisible"
      :message="guideMessage"
      :remainingSeconds="remainingTime"
      :totalSeconds="timeLimit / 1000"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import GuideTooltip from '@/component/GuideTooltip.vue'

const props = defineProps<{
  taskId: string
  guideDelay: number
  timeLimit: number
  guideMessage: string
}>()

const emit = defineEmits<{
  (e: 'complete', successful: boolean): void
  (e: 'guideShown'): void
}>()

const isGuideVisible = ref(false)
const remainingTime = ref(props.timeLimit / 1000)
const progressInterval = ref<number | null>(null)

onMounted(() => {
  setTimeout(() => {
    isGuideVisible.value = true
    emit('guideShown')
    startProgressBar()
  }, props.guideDelay)
})

function startProgressBar() {
  const updateInterval = 100
  const startTime = Date.now()

  progressInterval.value = setInterval(() => {
    const elapsed = Date.now() - startTime
    const remaining = props.timeLimit - elapsed

    if (remaining <= 0) {
      stopProgressBar()
      emit('complete', false)
    } else {
      remainingTime.value = Math.ceil(remaining / 1000)
    }
  }, updateInterval)
}

function stopProgressBar() {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
}

onBeforeUnmount(() => {
  stopProgressBar()
})
</script>

<style scoped>
.task-wrapper {
  position: relative;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 200px;
}

.task-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
