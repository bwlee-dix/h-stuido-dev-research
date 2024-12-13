import { ref } from 'vue'

export default class TouchDistanceTracker {
  private lastTouchPosition: { x: number; y: number } | null = null
  private dpi: number
  private totalDistance = ref(0)
  private points = ref<{ x: number; y: number }[]>([])
  private lines = ref<
    { x1: number; y1: number; x2: number; y2: number; distance: number }[]
  >([])

  constructor(dpi: number = 96) {
    this.dpi = dpi
    this.loadTotalDistance()
  }

  // 로컬스토리지에 총 이동 거리 저장
  private saveTotalDistance(): void {
    localStorage.setItem('totalDistance', this.totalDistance.value.toString())
  }

  // 로컬스토리지에서 총 이동 거리 불러오기
  private loadTotalDistance(): void {
    const savedDistance = localStorage.getItem('totalDistance')
    if (savedDistance) {
      this.totalDistance.value = parseFloat(savedDistance)
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
      this.totalDistance.value += distanceInMM

      // 선 정보 저장
      this.lines.value.push({
        x1: this.lastTouchPosition.x,
        y1: this.lastTouchPosition.y,
        x2: x,
        y2: y,
        distance: distanceInMM,
      })

      // 로컬스토리지에 저장
      this.saveTotalDistance()
    }

    // 새로운 터치 포인트 저장
    this.points.value.push(newPoint)
    this.lastTouchPosition = newPoint
  }

  // 거리 데이터 초기화
  public reset(): void {
    this.lastTouchPosition = null
    this.totalDistance.value = 0
    this.points.value = []
    this.lines.value = []
    this.saveTotalDistance()
  }

  // 데이터 반환 함수들
  public getTotalDistance(): number {
    return this.totalDistance.value
  }

  public getPoints(): { x: number; y: number }[] {
    return this.points.value
  }

  public getLines(): {
    x1: number
    y1: number
    x2: number
    y2: number
    distance: number
  }[] {
    return this.lines.value
  }
}
