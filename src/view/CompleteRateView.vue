<template>
  <div class="complete-rate-container">
    <div class="stats-panel" v-if="stats">
      <h2>태스크 완료율 통계</h2>
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-label">자체 완수율</div>
          <div class="stat-value">
            {{ stats.selfCompletionRate.toFixed(1) }}%
          </div>
        </div>
        <div class="stat-item">
          <div class="stat-label">가이드 없이 성공</div>
          <div class="stat-value">{{ stats.successWithoutGuide }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">가이드 후 성공</div>
          <div class="stat-value">{{ stats.successWithGuide }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">가이드 후 실패</div>
          <div class="stat-value">{{ stats.failureWithGuide }}</div>
        </div>
      </div>
    </div>

    <div class="task-container">
      <CompleteRateTask
        v-if="currentTaskIndex === 0"
        :task-id="'task1'"
        :guide-delay="3000"
        :time-limit="5000"
        :guide-message="'첫 번째 버튼을 클릭하세요'"
        @guide-shown="handleGuideShown"
        @complete="handleTaskComplete"
      >
        <template #default>
          <button class="task-button" @click="handleTaskButtonClick(0, true)">
            Task 1 버튼
          </button>
        </template>
      </CompleteRateTask>

      <CompleteRateTask
        v-if="currentTaskIndex === 1"
        :task-id="'task2'"
        :guide-delay="3000"
        :time-limit="5000"
        :guide-message="'두 번째 버튼을 클릭하세요'"
        @guide-shown="handleGuideShown"
        @complete="handleTaskComplete"
      >
        <template #default>
          <button class="task-button" @click="handleTaskButtonClick(1, true)">
            Task 2 버튼
          </button>
        </template>
      </CompleteRateTask>

      <CompleteRateTask
        v-if="currentTaskIndex === 2 && !stats"
        :task-id="'task3'"
        :guide-delay="3000"
        :time-limit="5000"
        :guide-message="'세 번째 버튼을 클릭하세요'"
        @guide-shown="handleGuideShown"
        @complete="handleTaskComplete"
      >
        <template #default>
          <button class="task-button" @click="handleTaskButtonClick(2, true)">
            Task 3 버튼
          </button>
        </template>
      </CompleteRateTask>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CompleteRateTask from '@/component/CompleteRateTask.vue'
import {
  CompleteRateTracker,
  type CompletionStats,
} from '@/module/completeRateTracker'

const tracker = new CompleteRateTracker()
const currentTaskIndex = ref(0)
const stats = ref<CompletionStats | null>(null)
const guideShown = ref(false)

onMounted(() => {
  tracker.reset()
  startCurrentTask()
})

function startCurrentTask() {
  if (currentTaskIndex.value < 3) {
    guideShown.value = false
    tracker.startTask(`task${currentTaskIndex.value + 1}`)
  }
}

function handleGuideShown() {
  guideShown.value = true
  tracker.markGuideShown()
}

function handleTaskButtonClick(taskIndex: number, successful: boolean) {
  if (taskIndex === currentTaskIndex.value) {
    if (guideShown.value) {
      tracker.completeTask(successful)
    } else {
      tracker.completeTask(true)
    }
    moveToNextTask()
  }
}

function handleTaskComplete(successful: boolean) {
  tracker.completeTask(successful)
  moveToNextTask()
}

function moveToNextTask() {
  if (currentTaskIndex.value < 2) {
    currentTaskIndex.value++
    startCurrentTask()
  } else {
    stats.value = tracker.getStats()
  }
}
</script>

<style scoped>
.complete-rate-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.stats-panel {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;

  h2 {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.task-container {
  position: relative;
  min-height: 200px;
}

.task-button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.task-button:hover {
  background-color: #0056b3;
}
</style>
