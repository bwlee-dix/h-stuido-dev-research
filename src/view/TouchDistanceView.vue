<script lang="ts" setup>
import TouchDistanceTracker, {
  type Line,
  type Point,
} from '@/module/touchDistanceTracker'
import { ref } from 'vue'

const tracker = new TouchDistanceTracker()
const points = ref<Point[]>([])
const lines = ref<Line[]>([])
const totalDistance = ref<number>(0)

const handleTouch = (event: PointerEvent) => {
  tracker.handleTouch(event)

  points.value = tracker.getPoints()
  lines.value = tracker.getLines()
  totalDistance.value = tracker.getTotalDistance()
}

const removeLocalStorage = () => {
  tracker.reset()
  points.value = []
  lines.value = []
  totalDistance.value = 0
}
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

    <div class="controller-wrapper">
      <button
        class="clear-button"
        @click="removeLocalStorage"
        @pointerdown.stop
      >
        Clear Local Storage
      </button>
      <div class="total">
        <span class="label">총 거리:</span>
        <span class="value"> {{ totalDistance.toFixed(2) }} mm </span>
      </div>
    </div>
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

.controller-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 24px;
  background-color: white;
  box-shadow: 8px 8px 24px rgba(0, 0, 0, 0.04);
  border: 1px solid #d0d1d2;
  border-radius: 8px;

  .total {
    display: flex;
    flex-direction: row;
    gap: 4px;

    .value {
      font-weight: 600;
    }
  }

  .clear-button {
    padding: 10px 20px;
    background-color: #ff5555;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #ff3333;
    }
  }
}
</style>
