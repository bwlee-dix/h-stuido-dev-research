// module/TouchDistanceTracker.ts
export default class TouchDistanceTracker {
  private lastTouchPosition: { x: number; y: number } | null = null
  private totalDistance: number = 0
  private dpi: number
  private distances: number[] = [] // 각 구간의 거리 저장
  public isVisible: boolean = true // 원, 선, 텍스트 표시 여부

  constructor(dpi: number = 96) {
    this.dpi = dpi
    this.loadTotalDistance()
  }

  // 총 이동 거리 로컬스토리지에 저장
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

  public handleTouch(event: PointerEvent): void {
    const x = event.clientX
    const y = event.clientY

    if (this.lastTouchPosition) {
      const distanceInPixels = this.calculateDistance(
        this.lastTouchPosition.x,
        this.lastTouchPosition.y,
        x,
        y,
      )
      const distanceInMM = this.convertToMM(distanceInPixels)
      this.totalDistance += distanceInMM
      this.distances.push(distanceInMM) // 각 선의 거리 저장
      this.saveTotalDistance() // 총 이동 거리 저장
    }

    this.lastTouchPosition = { x, y }
  }

  public getTotalDistance(): number {
    return this.totalDistance
  }

  public getDistances(): number[] {
    return this.distances
  }

  public reset(): void {
    this.lastTouchPosition = null
    this.totalDistance = 0
    this.distances = [] // 거리 초기화
    this.saveTotalDistance() // 초기화된 총 이동 거리 저장
  }
}
