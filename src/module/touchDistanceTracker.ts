export interface StorageConfig {
  storageKey?: string
  touchLogKey?: string
}

export interface Point {
  x: number
  y: number
}

export interface Line {
  x1: number
  y1: number
  x2: number
  y2: number
  distance: number
}

export default class TouchDistanceTracker {
  private lastTouchPosition: Point | null = null
  private dpi: number
  private totalDistance = 0
  private points: Point[] = []
  private lines: Line[] = []
  private storageConfig: StorageConfig

  constructor(
    config: {
      dpi?: number
      storageConfig?: StorageConfig
    } = {},
  ) {
    this.dpi = config.dpi || 96

    const defaultStorageKey = this.generateDefaultStorageKey()

    this.storageConfig = {
      storageKey: config.storageConfig?.storageKey || defaultStorageKey,
      touchLogKey:
        config.storageConfig?.touchLogKey || `${defaultStorageKey}-touch-log`,
    }

    this.loadTotalDistance()
  }

  private generateDefaultStorageKey(): string {
    let index = 1
    while (
      localStorage.getItem(`totalDistance-${String(index).padStart(2, '0')}`)
    ) {
      index++
    }
    return `totalDistance-${String(index).padStart(2, '0')}`
  }

  private saveTotalDistance(): void {
    if (!this.storageConfig.storageKey) return

    localStorage.setItem(
      this.storageConfig.storageKey,
      this.totalDistance.toString(),
    )
  }

  private loadTotalDistance(): void {
    if (!this.storageConfig.storageKey) return

    const savedDistance = localStorage.getItem(this.storageConfig.storageKey)
    if (!savedDistance) return

    this.totalDistance = parseFloat(savedDistance)
  }

  private calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  private convertToMM(distanceInPixels: number): number {
    const mmPerPixel = 25.4 / this.dpi
    return distanceInPixels * mmPerPixel
  }

  private saveTouchLog(touchData: {
    x: number
    y: number
    time_millis: number
  }): void {
    if (!this.storageConfig.touchLogKey) return

    const existingLog = localStorage.getItem(this.storageConfig.touchLogKey)
    const log = existingLog ? JSON.parse(existingLog) : []
    log.push(touchData)
    localStorage.setItem(this.storageConfig.touchLogKey, JSON.stringify(log))
  }

  public handleTouch(event: PointerEvent): void {
    const x = event.clientX
    const y = event.clientY
    const time_millis = Date.now()
    const newPoint = { x, y }

    this.saveTouchLog({ x, y, time_millis })

    if (this.lastTouchPosition) {
      const distanceInPixels = this.calculateDistance(
        this.lastTouchPosition.x,
        this.lastTouchPosition.y,
        x,
        y,
      )
      const distanceInMM = this.convertToMM(distanceInPixels)

      this.totalDistance += distanceInMM

      const newLine = {
        x1: this.lastTouchPosition.x,
        y1: this.lastTouchPosition.y,
        x2: x,
        y2: y,
        distance: distanceInMM,
      }

      this.lines.push(newLine)
      this.saveTotalDistance()
    }

    this.points.push(newPoint)
    this.lastTouchPosition = newPoint
  }

  public reset(): void {
    this.lastTouchPosition = null
    this.totalDistance = 0
    this.points = []
    this.lines = []

    if (!this.storageConfig.storageKey) return
    localStorage.removeItem(this.storageConfig.storageKey)

    if (!this.storageConfig.touchLogKey) return
    localStorage.removeItem(this.storageConfig.touchLogKey)
  }

  public getTotalDistance(): number {
    return this.totalDistance
  }

  public getPoints(): Point[] {
    return [...this.points]
  }

  public getLines(): Line[] {
    return [...this.lines]
  }

  public getTouchLog(): { x: number; y: number; time_millis: number }[] {
    if (!this.storageConfig.touchLogKey) return []

    const log = localStorage.getItem(this.storageConfig.touchLogKey)
    return log ? JSON.parse(log) : []
  }
}
