interface TouchDistanceObserver {
  onPointsUpdated?(points: Point[]): void
  onLinesUpdated?(lines: Line[]): void
  onTotalDistanceUpdated?(totalDistance: number): void
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
  private observers: TouchDistanceObserver[] = []
  private storageKey: string
  private touchLogKey: string

  constructor(dpi: number = 96, customKey?: string) {
    this.dpi = dpi
    this.storageKey = customKey || this.generateDefaultStorageKey()
    this.touchLogKey = `${this.storageKey}-touch-log`
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

  public addObserver(observer: TouchDistanceObserver): void {
    this.observers.push(observer)
  }

  public removeObserver(observer: TouchDistanceObserver): void {
    this.observers = this.observers.filter((obs) => obs !== observer)
  }

  private notifyObservers(): void {
    this.observers.forEach((observer) => {
      if (observer.onPointsUpdated) {
        observer.onPointsUpdated([...this.points])
      }
      if (observer.onLinesUpdated) {
        observer.onLinesUpdated([...this.lines])
      }
      if (observer.onTotalDistanceUpdated) {
        observer.onTotalDistanceUpdated(this.totalDistance)
      }
    })
  }

  private saveTotalDistance(): void {
    localStorage.setItem(this.storageKey, this.totalDistance.toString())
  }

  private loadTotalDistance(): void {
    const savedDistance = localStorage.getItem(this.storageKey)
    if (savedDistance) {
      this.totalDistance = parseFloat(savedDistance)
    }
  }

  public removeStorage(): void {
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.touchLogKey)
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
    const existingLog = localStorage.getItem(this.touchLogKey)
    const log = existingLog ? JSON.parse(existingLog) : []
    log.push(touchData)
    localStorage.setItem(this.touchLogKey, JSON.stringify(log))
  }

  public handleTouch(event: PointerEvent): void {
    const x = event.clientX
    const y = event.clientY
    const time_millis = Date.now()
    const newPoint = { x, y }

    // 로컬스토리지에 터치 로그 저장
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
    this.notifyObservers()
  }

  public reset(): void {
    this.lastTouchPosition = null
    this.totalDistance = 0
    this.points = []
    this.lines = []
    this.saveTotalDistance()
    localStorage.removeItem(this.touchLogKey)
    this.notifyObservers()
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
    const log = localStorage.getItem(this.touchLogKey)
    return log ? JSON.parse(log) : []
  }
}
