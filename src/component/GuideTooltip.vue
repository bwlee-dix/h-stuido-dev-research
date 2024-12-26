<template>
  <div class="guide-tooltip">
    <div class="guide-content">
      <div class="guide-message">{{ message }}</div>
      <div class="progress-container">
        <div class="progress-bar" :style="progressBarStyle"></div>
        <div class="countdown">{{ remainingSeconds }}초</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  message: string
  remainingSeconds: number
  totalSeconds: number
}>()

const progressBarStyle = computed(() => ({
  width: `${(props.remainingSeconds / props.totalSeconds) * 100}%`,
}))
</script>

<style scoped>
.guide-tooltip {
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #333;
  color: white;
  border-radius: 8px;
  padding: 12px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.guide-message {
  font-size: 14px;
  margin-bottom: 8px;
}

.progress-container {
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  position: relative;
}

.progress-bar {
  height: 100%;
  background-color: #fff;
  border-radius: 2px;
  transition: width 0.1s linear;
}

.countdown {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 12px;
  opacity: 0.8;
}
</style>
