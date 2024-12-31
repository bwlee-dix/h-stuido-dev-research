/**
 * Interface for storing individual touch event details
 */
interface TouchCoordinate {
  x: number
  y: number
  time_millis: number
}

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
  /** List of touch coordinates */
  touchCoordinates: TouchCoordinate[]
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
  private readonly storageKey = 'touchData'

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
      touchCoordinates: [],
    }
    this.config = config
    this.isTracking = false
    this.isMultiTouchActive = false
    this.currentTouchIdentifiers = new Set()
    this.loadFromStorage()
  }

  /**
   * Load saved touch data from localStorage
   * @private
   */
  private loadFromStorage(): void {
    const savedData = localStorage.getItem(this.storageKey)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        this.touchData = parsedData
      } catch (error) {
        console.error('Failed to parse saved touch data:', error)
      }
    }
  }

  /**
   * Save current touch data to localStorage
   * @private
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.touchData))
    } catch (error) {
      console.error('Failed to save touch data:', error)
    }
  }

  private handleTouchStart = (event: TouchEvent): void => {
    Array.from(event.changedTouches).forEach((touch) => {
      this.currentTouchIdentifiers.add(touch.identifier)
      this.touchData.touchCoordinates.push({
        x: touch.clientX,
        y: touch.clientY,
        time_millis: Date.now(),
      })
    })

    if (this.currentTouchIdentifiers.size === 1) {
      this.touchData.touchStartCount++
    }

    this.touchData.activeTouches = event.touches.length

    if (event.touches.length > 1) {
      this.isMultiTouchActive = true
    }

    this.saveToStorage()
  }

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

    this.saveToStorage()
  }

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

    this.saveToStorage()
  }

  public startTracking(): void {
    if (this.isTracking) return

    this.isTracking = true
    document.addEventListener('touchstart', this.handleTouchStart)
    document.addEventListener('touchend', this.handleTouchEnd)
    document.addEventListener('touchcancel', this.handleTouchCancel)
  }

  public stopTracking(): void {
    if (!this.isTracking) return

    this.isTracking = false
    document.removeEventListener('touchstart', this.handleTouchStart)
    document.removeEventListener('touchend', this.handleTouchEnd)
    document.removeEventListener('touchcancel', this.handleTouchCancel)
  }

  public getData(): TouchEventData {
    return { ...this.touchData }
  }

  resetData(): void {
    this.touchData = {
      touchStartCount: 0,
      touchEndCount: 0,
      touchCancelCount: 0,
      totalTouches: 0,
      activeTouches: 0,
      touchCoordinates: [],
    }
    this.isMultiTouchActive = false
    this.currentTouchIdentifiers.clear()
    this.saveToStorage()
  }
}
