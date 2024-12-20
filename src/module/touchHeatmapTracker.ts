export interface TouchPosition {
  x: number
  y: number
  count: number
}

export interface HeatmapData {
  positions: TouchPosition[]
  maxCount: number
}

export default class TouchHeatmapTracker {
  private positions: Map<string, TouchPosition>
  private isTracking: boolean

  constructor() {
    this.positions = new Map()
    this.isTracking = false
  }

  startTracking(): void {
    if (this.isTracking) return

    this.isTracking = true
    document.addEventListener('pointerdown', this.handlePointerDown)
  }

  stopTracking(): void {
    if (!this.isTracking) return

    this.isTracking = false
    document.removeEventListener('pointerdown', this.handlePointerDown)
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const x = Math.round(event.clientX)
    const y = Math.round(event.clientY)
    const key = `${x}-${y}`

    const existingPosition = this.positions.get(key)
    if (existingPosition) {
      existingPosition.count++
      this.positions.set(key, existingPosition)
    } else {
      this.positions.set(key, { x, y, count: 1 })
    }

    this.saveToLocalStorage()
  }

  getData(): HeatmapData {
    const positions = Array.from(this.positions.values())
    const maxCount = Math.max(...positions.map((p) => p.count))
    return { positions, maxCount }
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('heatmapData', JSON.stringify(this.getData()))
  }

  loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('heatmapData')
    if (savedData) {
      const data: HeatmapData = JSON.parse(savedData)
      this.positions = new Map(
        data.positions.map((pos) => [`${pos.x}-${pos.y}`, pos]),
      )
    }
  }

  resetData(): void {
    this.positions.clear()
    localStorage.removeItem('heatmapData')
  }
}
