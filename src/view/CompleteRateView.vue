<template>
  <div class="complete-rate-container">
    <div class="complete-rate-title">Complete Rate Measurement Demo</div>
    <div class="stats-panel" v-if="stats">
      <h2>📊 자체 태스크 완수율 통계</h2>
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

      <div class="stats-actions">
        <button class="action-button" @click="resetStats">통계 초기화</button>
        <button class="action-button" @click="restartDemo">한번 더 하기</button>
      </div>
      <div class="info-container">
        <div class="info">
          📌 자체 완수율 =
          <span class="fraction"
            >가이드 없이 성공 횟수 <span class="divider">/</span> 전체 태스크
            횟수</span
          >
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
        v-if="currentTaskIndex === 2"
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
      <CompleteRateTask
        v-if="currentTaskIndex === 3 && !stats"
        :task-id="'task4'"
        :guide-delay="3000"
        :time-limit="5000"
        :guide-message="'네 번째 버튼을 클릭하세요'"
        @guide-shown="handleGuideShown"
        @complete="handleTaskComplete"
      >
        <template #default>
          <button class="task-button" @click="handleTaskButtonClick(3, true)">
            Task 4 버튼
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
  startCurrentTask()
})

const startCurrentTask = () => {
  if (currentTaskIndex.value > 3) return

  guideShown.value = false
  tracker.startTask(`task${currentTaskIndex.value + 1}`)
}

const resetStats = () => {
  stats.value = {
    selfCompletionRate: 0,
    successWithoutGuide: 0,
    successWithGuide: 0,
    failureWithGuide: 0,
    totalAttempts: 0,
  }
  tracker.reset()
}

const restartDemo = () => {
  stats.value = null
  currentTaskIndex.value = 0
  startCurrentTask()
}

const handleGuideShown = () => {
  guideShown.value = true
  tracker.markGuideShown()
}

const handleTaskButtonClick = (taskIndex: number, successful: boolean) => {
  if (taskIndex !== currentTaskIndex.value) return

  if (guideShown.value) {
    tracker.completeTask(successful)
  } else {
    tracker.completeTask(true)
  }

  moveToNextTask()
}

const handleTaskComplete = (successful: boolean) => {
  tracker.completeTask(successful)
  moveToNextTask()
}

const moveToNextTask = () => {
  if (currentTaskIndex.value < 3) {
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

  .complete-rate-title {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 24px;
  }

  .stats-panel {
    margin-bottom: 20px;
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;

    h2 {
      font-size: 18px;
      font-weight: 500;
      text-align: center;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 20px;

      .stat-item {
        text-align: center;

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
      }
    }

    .info-container {
      margin-top: 24px;
      display: flex;
      justify-content: center;
      .info {
        width: fit-content;
        font-size: 14px;
        color: #8b8b8b;
      }
    }
    .stats-actions {
      margin-top: 20px;
      display: flex;
      justify-content: center;
      gap: 10px;

      .action-button {
        padding: 10px 15px;
        font-size: 16px;
        background-color: #121212;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
          background-color: #363636;
        }

        &:nth-child(2) {
          background-color: #007bff;

          &:hover {
            background-color: #0056b3;
          }
        }
      }
    }
  }

  .task-container {
    position: relative;
    min-height: 200px;

    .task-button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }
    }
  }
}
</style>
