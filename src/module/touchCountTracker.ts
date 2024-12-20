export interface TouchEventData {
  touchStartCount: number
  touchEndCount: number
  touchCancelCount: number
  totalTouches: number
  activeTouches: number
}

export interface TouchCountTrackerConfig {
  onTouchEnd?: (data: TouchEventData) => void
  onTouchCancel?: (data: TouchEventData) => void
}

export default class PointerCountTracker {
  private touchData: TouchEventData
  private config: TouchCountTrackerConfig
  private isTracking: boolean

  constructor(config: TouchCountTrackerConfig) {
    this.touchData = {
      touchStartCount: 0,
      touchEndCount: 0,
      touchCancelCount: 0,
      totalTouches: 0,
      activeTouches: 0,
    }
    this.config = config
    this.isTracking = false
  }

  startTracking(): void {
    if (this.isTracking) return

    this.isTracking = true
    document.addEventListener('pointerdown', this.handlePointerDown)
    document.addEventListener('pointerup', this.handlePointerUp)
    document.addEventListener('pointercancel', this.handlePointerCancel)
  }

  stopTracking(): void {
    if (!this.isTracking) return

    this.isTracking = false
    document.removeEventListener('pointerdown', this.handlePointerDown)
    document.removeEventListener('pointerup', this.handlePointerUp)
    document.removeEventListener('pointercancel', this.handlePointerCancel)
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (event.isPrimary) {
      this.touchData.touchStartCount++
      this.touchData.activeTouches++
    }
  }

  private handlePointerUp = (event: PointerEvent): void => {
    if (this.touchData.activeTouches > 0) {
      this.touchData.touchEndCount++
      this.touchData.totalTouches++
      this.touchData.activeTouches = 0
    }

    if (this.config.onTouchEnd) {
      this.config.onTouchEnd(this.touchData)
    }
  }

  private handlePointerCancel = (event: PointerEvent): void => {
    this.touchData.touchCancelCount++

    if (this.config.onTouchCancel) {
      this.config.onTouchCancel(this.touchData)
    }
  }

  getData(): TouchEventData {
    return { ...this.touchData }
  }

  resetData(): void {
    this.touchData = {
      touchStartCount: 0,
      touchEndCount: 0,
      touchCancelCount: 0,
      totalTouches: 0,
      activeTouches: 0,
    }
  }
}
