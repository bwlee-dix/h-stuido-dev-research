<template>
  <div class="heatmap-container">
    <h2>터치 데이터 시각화 결과</h2>
    <div class="grid-container">
      <div v-for="page in pages" :key="page.pageNumber" class="grid-item">
        <div class="page-container">
          <div class="page-content" v-html="page.html"></div>
          <canvas
            :ref="
              (el) =>
                setCanvasRef(el as HTMLCanvasElement | null, page.pageNumber)
            "
            class="heatmap-overlay"
          ></canvas>
        </div>
        <div class="page-title">페이지 {{ page.pageNumber }}</div>
      </div>
    </div>
    <div class="legend">
      <div class="legend-item">
        <div
          class="legend-color"
          style="background-color: rgba(255, 0, 0, 0.2)"
        ></div>
        <span>낮은 빈도</span>
      </div>
      <div class="legend-item">
        <div
          class="legend-color"
          style="background-color: rgba(255, 0, 0, 0.8)"
        ></div>
        <span>높은 빈도</span>
      </div>
    </div>
    <button class="reset-button" @click="resetData">데이터 초기화</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { PageScreenshot } from '@/module/pageScreenshotTracker'

const pages = ref<PageScreenshot[]>([])
const canvasRefs = new Map<number, HTMLCanvasElement>()

const setCanvasRef = (el: HTMLCanvasElement | null, pageNumber: number) => {
  if (el) {
    canvasRefs.set(pageNumber, el)
    drawHeatmap(pageNumber)
  }
}

const drawHeatmap = (pageNumber: number) => {
  const canvas = canvasRefs.get(pageNumber)
  if (!canvas) return

  const container = canvas.parentElement
  if (!container) return

  // 캔버스 크기를 컨테이너에 맞춤
  canvas.width = container.clientWidth
  canvas.height = container.clientHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const pagePositions =
    pages.value.find((p) => p.pageNumber === pageNumber)?.touchPositions || []

  const maxCount = Math.max(...pagePositions.map((p) => p.count))

  pagePositions.forEach((pos) => {
    const intensity = pos.count / (maxCount || 1)
    const radius = 20 + intensity * 30

    const gradient = ctx.createRadialGradient(
      pos.x,
      pos.y,
      0,
      pos.x,
      pos.y,
      radius,
    )

    gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity * 0.8})`)
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2)
    ctx.fill()
  })
}

const resetData = () => {
  if (confirm('정말로 모든 터치 데이터를 초기화하시겠습니까?')) {
    localStorage.removeItem('pageScreenshots')
    localStorage.removeItem('touchData')
    pages.value = []
    canvasRefs.clear()
  }
}

onMounted(() => {
  const savedData = localStorage.getItem('pageScreenshots')
  if (savedData) {
    const data = JSON.parse(savedData) as {
      screenshots: [number, PageScreenshot][]
    }
    pages.value = Array.from(new Map(data.screenshots).values())
  }
})

let resizeTimeout: number
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = window.setTimeout(() => {
    pages.value.forEach((page) => drawHeatmap(page.pageNumber))
  }, 200)
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.heatmap-container {
  padding: 2rem;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.grid-item {
  position: relative;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background: #f5f5f5;
}

.page-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
}

.heatmap-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.page-title {
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  background: #f8f9fa;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.reset-button {
  display: block;
  margin: 0 auto;
  padding: 0.5rem 2rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.reset-button:hover {
  background-color: #c82333;
}
</style>
