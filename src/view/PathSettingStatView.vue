<template>
  <div class="stat-container">
    <div class="content">
      <div class="stats-panel">
        <h2>📊 경로 설정 성공률 통계</h2>
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-label">총 소요시간</div>
            <div class="stat-value">{{ formattedTotalTime }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">총 조작 횟수</div>
            <div class="stat-value">{{ touchData.totalTouches }}회</div>
          </div>
        </div>
        <div class="stats-row">
          <TouchDataAccordion :touchData="touchData" :isFull="false" />
        </div>
        <div class="stats-actions">
          <button class="action-button" @click="restartTask">한번 더 하기</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import type { TouchEventData } from '@/module/touchCountTracker'
import type { TimerRecord } from '@/module/completeTimer'

import TouchDataAccordion from '@/component/TouchDataAccordion.vue'

const router = useRouter()

const rawTouchData = localStorage.getItem('touchData')
const rawTimerRecord = localStorage.getItem('completeTimerRecords')

const createDefaultTouchData = (): TouchEventData => ({
  touchStartCount: 0,
  touchEndCount: 0,
  touchCancelCount: 0,
  totalTouches: 0,
  activeTouches: 0,
  touchCoordinates: [],
})

const createDefaultTimerRecords = (): TimerRecord => ({
  startTime: 0,
  stopTime: 0,
})

const timerRecord = ref<TimerRecord[]>([])
const touchData = ref<TouchEventData>(
  rawTouchData ? (JSON.parse(rawTouchData) as TouchEventData) : createDefaultTouchData()
);

if (rawTimerRecord) {
  const parsedRecord = JSON.parse(rawTimerRecord)
  if (Array.isArray(parsedRecord)) {
    timerRecord.value = parsedRecord as TimerRecord[]
  } else {
    timerRecord.value = [parsedRecord as TimerRecord]
  }
} else {
  timerRecord.value = [createDefaultTimerRecords()]
}

const formattedTotalTime = computed(() => {
  if (timerRecord.value.length > 0) {
    const { startTime, stopTime } = timerRecord.value[0]
    if (!startTime || !stopTime) return '시간 없음'

    const totalMilliseconds = stopTime - startTime
    const totalSeconds = Math.floor(totalMilliseconds / 1000)

    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    const result = []
    if (hours > 0) result.push(`${hours}시`)
    if (minutes > 0 || hours > 0) result.push(`${minutes}분`)
    result.push(`${seconds}초`)

    return result.join(' ')
  }
  return '시간 없음'
})

const restartTask = () => {
  router.push('/path-setting')
}
</script>

<style scoped>
.stat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .content {
    padding-top: 48px;
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .stats-panel {
      margin-bottom: 20px;
      padding: 20px;
      background-color: #f5f5f5;
      border-radius: 8px;
      width: 100%;

      h2 {
        font-size: 18px;
        font-weight: 500;
        text-align: center;
      }

      .stats-row {
        display: flex;
        flex-direction: row;
        justify-content: center;
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
  }
}
</style>
