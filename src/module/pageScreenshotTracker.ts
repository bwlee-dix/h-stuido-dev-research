export interface PageScreenshot {
  pageNumber: number
  html: string
  touchPositions: TouchPosition[]
}

export interface TouchPosition {
  x: number
  y: number
  count: number
  pageNumber: number
}

export default class PageScreenshotTracker {
  private screenshots: Map<number, PageScreenshot>
  private touchPositions: Map<string, TouchPosition>

  constructor() {
    this.screenshots = new Map()
    this.touchPositions = new Map()
  }

  capturePageState(pageNumber: number, element: HTMLElement): void {
    const clonedHtml = element.cloneNode(true) as HTMLElement

    const inputs = clonedHtml.getElementsByTagName('input')
    for (let input of Array.from(inputs)) {
      input.value = ''
    }

    this.screenshots.set(pageNumber, {
      pageNumber,
      html: clonedHtml.outerHTML,
      touchPositions: this.getTouchPositionsForPage(pageNumber),
    })

    this.saveToLocalStorage()
  }

  trackTouch(x: number, y: number, pageNumber: number): void {
    const key = `${pageNumber}-${x}-${y}`
    const existing = this.touchPositions.get(key)

    if (existing) {
      existing.count++
      this.touchPositions.set(key, existing)
    } else {
      this.touchPositions.set(key, { x, y, count: 1, pageNumber })
    }

    this.saveToLocalStorage()
  }

  private getTouchPositionsForPage(pageNumber: number): TouchPosition[] {
    return Array.from(this.touchPositions.values()).filter(
      (pos) => pos.pageNumber === pageNumber,
    )
  }

  getAllScreenshots(): PageScreenshot[] {
    return Array.from(this.screenshots.values())
  }

  getAllTouchPositions(): TouchPosition[] {
    return Array.from(this.touchPositions.values())
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      'pageScreenshots',
      JSON.stringify({
        screenshots: Array.from(this.screenshots.entries()),
        touchPositions: Array.from(this.touchPositions.entries()),
      }),
    )
  }

  loadFromLocalStorage(): void {
    const savedData = localStorage.getItem('pageScreenshots')
    if (savedData) {
      const data = JSON.parse(savedData)
      this.screenshots = new Map(data.screenshots)
      this.touchPositions = new Map(data.touchPositions)
    }
  }

  clear(): void {
    this.screenshots.clear()
    this.touchPositions.clear()
    localStorage.removeItem('pageScreenshots')
  }
}
