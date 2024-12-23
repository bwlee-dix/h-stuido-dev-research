/**
 * Interface for storing touch event data
 * @interface TouchEventData
 */
export interface TouchEventData {
  /** Number of touch start events occurred */
  touchStartCount: number
  /** Number of touch end events occurred */
  touchEndCount: number
  /** Number of touch cancel events occurred */
  touchCancelCount: number
  /** Total number of touch gestures */
  totalTouches: number
  /** Current number of active touch points */
  activeTouches: number
}

/**
 * Interface for TouchCountTracker configuration
 * @interface TouchCountTrackerConfig
 */
export interface TouchCountTrackerConfig {
  /** Callback function to be called on touch end */
  onTouchEnd?: (data: TouchEventData) => void
  /** Callback function to be called on touch cancel */
  onTouchCancel?: (data: TouchEventData) => void
}

/**
 * Class for tracking and managing user touch events
 * Handles multi-touch gestures (e.g., pinch zoom) as a single touch event
 */
export default class TouchCountTracker {
  private touchData: TouchEventData
  private config: TouchCountTrackerConfig
  private isTracking: boolean
  private isMultiTouchActive: boolean
  private currentTouchIdentifiers: Set<number>

  /**
   * Creates a TouchCountTracker instance
   * @param config - Touch event callback configuration
   */
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
    this.isMultiTouchActive = false
    this.currentTouchIdentifiers = new Set()
  }

  /**
   * Starts tracking touch events
   * Does nothing if already tracking
   */
  startTracking(): void {
    if (this.isTracking) return

    this.isTracking = true
    document.addEventListener('touchstart', this.handleTouchStart)
    document.addEventListener('touchend', this.handleTouchEnd)
    document.addEventListener('touchcancel', this.handleTouchCancel)
  }

  /**
   * Stops tracking touch events
   * Does nothing if not tracking
   */
  stopTracking(): void {
    if (!this.isTracking) return

    this.isTracking = false
    document.removeEventListener('touchstart', this.handleTouchStart)
    document.removeEventListener('touchend', this.handleTouchEnd)
    document.removeEventListener('touchcancel', this.handleTouchCancel)
  }

  /**
   * Handles touch start events
   * For multi-touch, only counts the first touch
   * @param event - Touch event object
   * @private
   */
  private handleTouchStart = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach((touch) => {
      this.currentTouchIdentifiers.add(touch.identifier)
    })

    if (this.currentTouchIdentifiers.size === 1) {
      this.touchData.touchStartCount++
    }

    this.touchData.activeTouches = event.touches.length

    if (event.touches.length > 1) {
      this.isMultiTouchActive = true
      console.log('Multi-touch active:', this.isMultiTouchActive)
    }
  }

  /**
   * Handles touch end events
   * Only counts as a touch end when all touches are released
   * @param event - Touch event object
   * @private
   */
  private handleTouchEnd = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach((touch) => {
      this.currentTouchIdentifiers.delete(touch.identifier)
    })

    this.touchData.activeTouches = event.touches.length

    if (this.currentTouchIdentifiers.size === 0) {
      this.touchData.touchEndCount++
      this.touchData.totalTouches++
      this.isMultiTouchActive = false
    }

    if (this.config.onTouchEnd) {
      this.config.onTouchEnd(this.touchData)
    }
  }

  /**
   * Handles touch cancel events
   * @param event - Touch event object
   * @private
   */
  private handleTouchCancel = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach((touch) => {
      this.currentTouchIdentifiers.delete(touch.identifier)
    })

    this.touchData.touchCancelCount++

    if (this.currentTouchIdentifiers.size === 0) {
      this.isMultiTouchActive = false
    }

    if (this.config.onTouchCancel) {
      this.config.onTouchCancel(this.touchData)
    }
  }

  /**
   * Returns a copy of the collected touch event data
   * @returns {TouchEventData} Touch event data
   */
  getData(): TouchEventData {
    return { ...this.touchData }
  }

  /**
   * Resets all touch event data and states
   */
  resetData(): void {
    this.touchData = {
      touchStartCount: 0,
      touchEndCount: 0,
      touchCancelCount: 0,
      totalTouches: 0,
      activeTouches: 0,
    }
    this.isMultiTouchActive = false
    this.currentTouchIdentifiers.clear()
  }
}
