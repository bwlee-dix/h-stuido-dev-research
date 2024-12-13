<script lang="ts" setup>
import TouchDistanceTracker from '@/module/touchDistanceTracker'
import { ref } from 'vue'

const tracker = new TouchDistanceTracker(227)

const handleTouch = (event: PointerEvent) => {
  tracker.handleTouch(event)
  points.value = tracker.getPoints()
  lines.value = tracker.getLines()
}

const points = ref<{ x: number; y: number }[]>([])

const lines = ref<
  { x1: number; y1: number; x2: number; y2: number; distance: number }[]
>([])
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
</style>
