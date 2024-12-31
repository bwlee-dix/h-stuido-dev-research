interface Rect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

interface TouchAccuracyTrackerOptions {
  touchAreaElement: HTMLDivElement
  overlapAreaElement: HTMLDivElement
  accuracyElement: HTMLDivElement
  touchAreaRadius: number
  isVisibleArea: boolean
}

export default class TouchAccuracyTracker {
  private button: HTMLElement
  private touchArea: HTMLDivElement
  private overlapArea: HTMLDivElement
  private touchAreaRadius: number
  private isVisibleArea: boolean
  private overlapWidth: number = 0
  private overlapHeight: number = 0
  private accuracy: string = '0'

  constructor(
    buttonElement: HTMLElement,
    options: Partial<TouchAccuracyTrackerOptions> = {},
  ) {
    this.button = buttonElement
    this.touchArea = options.touchAreaElement || document.createElement('div')
    this.overlapArea =
      options.overlapAreaElement || document.createElement('div')
    this.touchAreaRadius = options.touchAreaRadius || 20
    this.isVisibleArea = options.isVisibleArea || false

    this.initStyles()
    this.bindEvents()
  }

  public getTouchAccuracyDetails(): {
    overlapWidth: number
    overlapHeight: number
    accuracy: string
  } {
    return {
      overlapWidth: Math.floor(this.overlapWidth),
      overlapHeight: Math.floor(this.overlapHeight),
      accuracy: this.accuracy,
    }
  }

  private initStyles(): void {
    this.touchArea.className = 'touch-area'
    this.overlapArea.className = 'overlap-area'
    document.body.append(this.touchArea, this.overlapArea)

    this.touchArea.style.display = 'none'
    this.overlapArea.style.display = 'none'
  }

  private bindEvents(): void {
    this.button.addEventListener('pointerdown', (event) =>
      this.handleTouch(event),
    )
  }

  private calculateOverlap(buttonArea: Rect, touchArea: Rect): void {
    this.overlapWidth = Math.max(
      0,
      Math.min(buttonArea.right, touchArea.right) -
        Math.max(buttonArea.left, touchArea.left),
    )
    this.overlapHeight = Math.max(
      0,
      Math.min(buttonArea.bottom, touchArea.bottom) -
        Math.max(buttonArea.top, touchArea.top),
    )
  }

  private handleTouch(event: PointerEvent): void {
    const buttonRect = this.button.getBoundingClientRect()
    const buttonArea: Rect = {
      left: buttonRect.left,
      top: buttonRect.top,
      right: buttonRect.right,
      bottom: buttonRect.bottom,
      width: buttonRect.width,
      height: buttonRect.height,
    }

    const touchAreaPosition: Rect = {
      left: event.clientX - this.touchAreaRadius,
      top: event.clientY - this.touchAreaRadius,
      right: event.clientX + this.touchAreaRadius,
      bottom: event.clientY + this.touchAreaRadius,
      width: this.touchAreaRadius * 2,
      height: this.touchAreaRadius * 2,
    }

    this.calculateOverlap(buttonArea, touchAreaPosition)
    const touchAreaSize = touchAreaPosition.width * touchAreaPosition.height

    this.accuracy = (
      ((this.overlapWidth * this.overlapHeight) / touchAreaSize) *
      100
    ).toFixed(2)

    this.updateUI(touchAreaPosition)
  }

  private updateUI(touchAreaPosition: Rect): void {
    if (this.isVisibleArea) {
      this.touchArea.style.cssText = `
        display: block;
        position: absolute;
        left: ${touchAreaPosition.left}px;
        top: ${touchAreaPosition.top}px;
        width: ${touchAreaPosition.width}px;
        height: ${touchAreaPosition.height}px;
        border: 2px dashed red;
        border-radius: 50%;
        pointer-events: none;
      `

      const buttonRect = this.button.getBoundingClientRect()

      this.overlapArea.style.cssText = `
        display: block;
        position: absolute;
        left: ${Math.max(buttonRect.left, touchAreaPosition.left)}px;
        top: ${Math.max(buttonRect.top, touchAreaPosition.top)}px;
        width: ${this.overlapWidth}px;
        height: ${this.overlapHeight}px;
        background-color: rgba(0, 255, 0, 0.5);
        pointer-events: none;
      `
    } else {
      this.touchArea.style.display = 'none'
      this.overlapArea.style.display = 'none'
    }

    localStorage.setItem('touchAccuracy', this.accuracy)
  }
}
