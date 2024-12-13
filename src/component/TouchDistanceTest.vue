<template>
  <div class="touch-container" @pointerdown="handleTouch">
    <svg class="line-container">
      <!-- 원을 그리기 -->
      <circle
        v-for="(point, index) in points"
        :key="'circle-' + index"
        :cx="point.x"
        :cy="point.y"
        r="15"
        fill="blue"
      />

      <!-- 거리 계산을 위한 선 그리기 -->
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

      <!-- 거리 텍스트 -->
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

      <!-- 원 안에 번호 표시 -->
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

    <div class="output">
      <p>총 이동 거리: {{ totalDistance }} mm</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const points = ref<{ x: number; y: number }[]>([])
const lines = ref<
  { x1: number; y1: number; x2: number; y2: number; distance: number }[]
>([])
const totalDistance = ref(0)

const handleTouch = (event: PointerEvent) => {
  // 클릭된 좌표 계산
  const newPoint = { x: event.clientX, y: event.clientY }

  // 첫 번째 클릭일 경우
  if (points.value.length === 0) {
    points.value.push(newPoint)
    return
  }

  // 두 번째 클릭부터는 선과 거리 계산
  const lastPoint = points.value[points.value.length - 1]
  const distance = calculateDistance(lastPoint, newPoint)
  lines.value.push({
    x1: lastPoint.x,
    y1: lastPoint.y,
    x2: newPoint.x,
    y2: newPoint.y,
    distance,
  })

  points.value.push(newPoint)

  // 총 이동 거리 계산
  totalDistance.value = lines.value.reduce(
    (acc, line) => acc + line.distance,
    0,
  )
}

// 두 점 간의 거리 계산
const calculateDistance = (
  point1: { x: number; y: number },
  point2: { x: number; y: number },
) => {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy) // 피타고라스 정리
}
</script>

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
