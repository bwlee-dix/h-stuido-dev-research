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
  private accuracyElement: HTMLDivElement
  private touchAreaRadius: number
  private isVisibleArea: boolean

  constructor(
    buttonElement: HTMLElement,
    options: Partial<TouchAccuracyTrackerOptions> = {},
  ) {
    this.button = buttonElement
    this.touchArea = options.touchAreaElement || document.createElement('div')
    this.overlapArea =
      options.overlapAreaElement || document.createElement('div')
    this.accuracyElement =
      options.accuracyElement || document.createElement('div')
    this.touchAreaRadius = options.touchAreaRadius || 20
    this.isVisibleArea = options.isVisibleArea || false

    this.initStyles()
    this.bindEvents()
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

  private calculateOverlap(buttonArea: Rect, touchArea: Rect): number {
    const overlapWidth = Math.max(
      0,
      Math.min(buttonArea.right, touchArea.right) -
        Math.max(buttonArea.left, touchArea.left),
    )
    const overlapHeight = Math.max(
      0,
      Math.min(buttonArea.bottom, touchArea.bottom) -
        Math.max(buttonArea.top, touchArea.top),
    )
    return overlapWidth * overlapHeight
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

    const overlapAreaSize = this.calculateOverlap(buttonArea, touchAreaPosition)
    const touchAreaSize = touchAreaPosition.width * touchAreaPosition.height

    const accuracy = ((overlapAreaSize / touchAreaSize) * 100).toFixed(2)

    this.updateUI(touchAreaPosition, overlapAreaSize, accuracy)
  }

  private updateUI(
    touchAreaPosition: Rect,
    overlapAreaSize: number,
    accuracy: string,
  ): void {
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
        width: ${Math.max(0, Math.min(buttonRect.right, touchAreaPosition.right) - Math.max(buttonRect.left, touchAreaPosition.left))}px;
        height: ${Math.max(0, Math.min(buttonRect.bottom, touchAreaPosition.bottom) - Math.max(buttonRect.top, touchAreaPosition.top))}px;
        background-color: rgba(0, 255, 0, 0.5);
        pointer-events: none;
      `
    } else {
      this.touchArea.style.display = 'none'
      this.overlapArea.style.display = 'none'
    }

    this.accuracyElement.textContent = `${accuracy}%`
    localStorage.setItem('touchAccuracy', accuracy)
  }
}
