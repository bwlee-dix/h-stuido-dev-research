<script lang="ts" setup>
import TouchDistanceTracker from '@/module/touchDistanceTracker'
import type { Point, Line } from '@/module/touchDistanceTracker'
import { ref, onMounted, onUnmounted } from 'vue'

const tracker = new TouchDistanceTracker(227)

const points = ref<Point[]>([])
const lines = ref<Line[]>([])

// 옵저버 객체 생성
const observer = {
  onPointsUpdated(updatedPoints: Point[]) {
    points.value = updatedPoints
  },
  onLinesUpdated(updatedLines: Line[]) {
    lines.value = updatedLines
  },
}

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

// 컴포넌트 생명주기에 맞춰 옵저버 관리
onMounted(() => {
  tracker.addObserver(observer)
})

onUnmounted(() => {
  tracker.removeObserver(observer)
})
</script>

<template>
  <div class="touch-container" @pointerdown="handleTouch">
    <svg class="line-container">
      <circle
        v-for="(point, index) in points"
        :key="'circle-' + index"
        :cx="point.x"
        :cy="point.y"
        r="15"
        fill="blue"
      />

      <line
        v-for="(line, index) in lines"
        :key="'line-' + index"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        stroke="black"
        stroke-width="2"
      />

      <text
        v-for="(line, index) in lines"
        :key="'text-' + index"
        :x="(line.x1 + line.x2) / 2"
        :y="(line.y1 + line.y2) / 2"
        fill="black"
        font-size="14"
      >
        {{ line.distance.toFixed(2) }} mm
      </text>

      <text
        v-for="(point, index) in points"
        :key="'number-' + index"
        :x="point.x"
        :y="point.y"
        fill="white"
        font-size="14"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ index + 1 }}
      </text>
    </svg>

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
