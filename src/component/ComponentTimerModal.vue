<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { CompleteTimer, TimerRecord } from '@/module/completeTimer'

const props = defineProps<{
  timer: CompleteTimer
}>()

const currentTime = ref<number>(0)
const records = ref<TimerRecord[]>([])

const updateTime = (time: number) => {
  currentTime.value = time
}

const updateRecords = () => {
  records.value = props.timer.getRecords()
}

const handleStart = () => {
  props.timer.start()
}

const handleStop = () => {
  props.timer.stop()
  updateRecords()
}

const handleReset = () => {
  props.timer.reset()
  records.value = []
}

onMounted(() => {
  props.timer.subscribe(updateTime)
  updateRecords()
})

onUnmounted(() => {
  props.timer.unsubscribe(updateTime)
})
</script>

<template>
  <div class="modal-container">
    <div class="title">Scenario Complete Timer</div>
    <div class="timer-display">
      {{ props.timer.formatTime(currentTime) }}
    </div>
    <div class="timer-controls">
      <button @click="handleStart" class="btn-control">Start</button>
      <button @click="props.timer.pause()" class="btn-control">Pause</button>
      <button @click="handleStop" class="btn-control">Stop</button>
      <button @click="handleReset" class="btn-control">Reset</button>
    </div>
    <div v-if="records.length > 0" class="records-list">
      <h3>Completion Times:</h3>
      <ul>
        <li v-for="record in records" :key="record.stopTime">
          <span class="label">{{ record.name }}:</span>
          <span class="value">{{
            props.timer.formatTime(record.stopTime! - record.startTime!)
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.modal-container {
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* width: fit-content; */

  .title {
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #525252;
    margin-bottom: 16px;
  }

  .timer-display {
    font-size: 2rem;
    font-family: monospace;
    padding: 1rem;
    background-color: #f0f0f0;
    border-radius: 0.5rem;
    text-align: center;
    margin-bottom: 1rem;
  }

  .timer-controls {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    width: 100%;

    .btn-control {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      background-color: #2196f3;
      color: white;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.2s;

      &:hover {
        background-color: #1b86de;
      }
    }
  }

  .records-list {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f5f5f5;
    border-radius: 0.5rem;

    h3 {
      font-size: 18px;
      font-weight: 600;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 12px 0;
        border-bottom: 1px solid #ddd;
        display: flex;
        flex-direction: row;
        gap: 4px;

        .label {
          font-weight: 600;
        }
      }
    }
  }
}
</style>
