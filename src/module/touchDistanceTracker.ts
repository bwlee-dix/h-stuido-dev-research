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

  constructor(dpi: number = 96) {
    this.dpi = dpi
    this.loadTotalDistance()
  }

  // Observer 패턴 메서드
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

  // 로컬스토리지에 총 이동 거리 저장
  private saveTotalDistance(): void {
    localStorage.setItem('totalDistance', this.totalDistance.toString())
  }

  // 로컬스토리지에서 총 이동 거리 불러오기
  private loadTotalDistance(): void {
    const savedDistance = localStorage.getItem('totalDistance')
    if (savedDistance) {
      this.totalDistance = parseFloat(savedDistance)
    }
  }

  // 두 점 간의 거리 계산
  private calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // 픽셀 단위 거리를 mm로 변환
  private convertToMM(distanceInPixels: number): number {
    const mmPerPixel = 25.4 / this.dpi
    return distanceInPixels * mmPerPixel
  }

  // 터치 이벤트 처리
  public handleTouch(event: PointerEvent): void {
    const x = event.clientX
    const y = event.clientY
    const newPoint = { x, y }

    // 터치 위치 기록
    if (this.lastTouchPosition) {
      const distanceInPixels = this.calculateDistance(
        this.lastTouchPosition.x,
        this.lastTouchPosition.y,
        x,
        y,
      )
      const distanceInMM = this.convertToMM(distanceInPixels)

      // 총 이동 거리 업데이트
      this.totalDistance += distanceInMM

      // 선 정보 저장
      const newLine = {
        x1: this.lastTouchPosition.x,
        y1: this.lastTouchPosition.y,
        x2: x,
        y2: y,
        distance: distanceInMM,
      }
      this.lines.push(newLine)

      // 로컬스토리지에 저장
      this.saveTotalDistance()
    }

    // 새로운 터치 포인트 저장
    this.points.push(newPoint)
    this.lastTouchPosition = newPoint

    // 옵저버에게 상태 변경 알림
    this.notifyObservers()
  }

  // 거리 데이터 초기화
  public reset(): void {
    this.lastTouchPosition = null
    this.totalDistance = 0
    this.points = []
    this.lines = []
    this.saveTotalDistance()
    this.notifyObservers()
  }

  // 데이터 반환 함수들
  public getTotalDistance(): number {
    return this.totalDistance
  }

  public getPoints(): Point[] {
    return [...this.points]
  }

  public getLines(): Line[] {
    return [...this.lines]
  }
}
