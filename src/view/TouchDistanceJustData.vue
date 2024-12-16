<script lang="ts" setup>
import TouchDistanceTracker from '@/module/touchDistanceTracker'

const tracker = new TouchDistanceTracker(227)

// 터치 핸들러
const handleTouch = (event: PointerEvent) => {
  tracker.handleTouch(event)
}

// 로컬스토리지 데이터 삭제
const removeLocalStorage = () => {
  tracker.removeStorage()
  tracker.reset()
  points.value = []
  lines.value = []
}
</script>

<template>
  <div class="touch-container" @pointerdown="handleTouch">
    <button class="clear-button" @click="removeLocalStorage" @pointerdown.stop>
      Clear Local Storage
    </button>
  </div>
</template>

<style scoped>
.touch-container {
  position: relative;
  height: 100vh;
}

.line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.output {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 18px;
  font-weight: bold;
}

circle {
  fill: blue;
}

line {
  stroke: black;
  stroke-width: 2;
}

text {
  font-family: Arial, sans-serif;
}

.clear-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #ff5555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #ff3333;
}
</style>
