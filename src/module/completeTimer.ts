/**
 * CompleteTimer module for measuring task completion time
 * Provides functionality to start, pause, stop and reset timer
 * Includes real-time updates and local storage integration
 */

export interface TimerRecord {
  startTime: number | null
  currentTime: number
  pausedTime: number | null
  stopTime?: number
  name: string
}

export class CompleteTimer {
  private startTime: number | null = null
  private currentTime: number = 0
  private pausedTime: number | null = null
  private timerInterval: ReturnType<typeof setTimeout> | null = null
  private readonly storageKey: string = 'completeTimerData'
  private readonly recordsKey: string = 'completeTimerRecords'
  private subscribers: ((time: number) => void)[] = []

  /**
   * Starts the timer and begins real-time updates
   * @returns {void}
   */
  public start(): void {
    if (this.startTime === null) {
      this.startTime = Date.now()
      this.currentTime = this.startTime
      this.saveToLocalStorage()
      this.startUpdates()
    } else if (this.pausedTime !== null) {
      const pauseDuration = Date.now() - this.pausedTime
      this.startTime += pauseDuration
      this.pausedTime = null
      this.startUpdates()
    }
  }

  /**
   * Pauses the timer while maintaining the current elapsed time
   * @returns {void}
   */
  public pause(): void {
    if (
      this.timerInterval &&
      this.startTime !== null &&
      this.pausedTime === null
    ) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
      this.pausedTime = Date.now()
      this.saveToLocalStorage()
    }
  }

  /**
   * Stops the timer and returns the final elapsed time
   * @returns {number} The total elapsed time in milliseconds
   */
  public stop(): number {
    if (this.startTime === null) return 0

    const endTime = Date.now()
    const elapsedTime =
      this.pausedTime !== null
        ? this.pausedTime - this.startTime
        : endTime - this.startTime

    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }

    // Save record with stopTime
    const records = this.getRecordsFromStorage()
    const newRecord: TimerRecord = {
      startTime: this.startTime,
      currentTime: endTime,
      pausedTime: this.pausedTime,
      stopTime: endTime,
      name: `Task ${records.length + 1}`,
    }
    records.push(newRecord)
    localStorage.setItem(this.recordsKey, JSON.stringify(records))

    // Reset state
    this.startTime = null
    this.currentTime = 0
    this.pausedTime = null

    this.notifySubscribers()

    return elapsedTime
  }

  /**
   * Resets the timer and clears local storage data
   * @returns {void}
   */
  public reset(): void {
    this.startTime = null
    this.currentTime = 0
    this.pausedTime = null
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.recordsKey)
    this.notifySubscribers()
  }

  /**
   * Converts the given time in milliseconds to a "mm:ss.mmm" formatted string.
   *
   * @param {number} ms - The time in milliseconds to be converted.
   * @returns {string} - The time formatted as "mm:ss.mmm".
   */
  public formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    const milliseconds = ms % 1000

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`
  }

  /**
   * Gets all timer records from storage
   * @returns {TimerRecord[]} Array of timer records
   */
  public getRecords(): TimerRecord[] {
    return this.getRecordsFromStorage()
  }

  private getRecordsFromStorage(): TimerRecord[] {
    const records = localStorage.getItem(this.recordsKey)
    return records ? JSON.parse(records) : []
  }

  /**
   * Subscribes to timer updates
   * @param {function} callback - Function to be called on each timer update
   * @returns {void}
   */
  public subscribe(callback: (time: number) => void): void {
    this.subscribers.push(callback)
  }

  /**
   * Unsubscribes from timer updates
   * @param {function} callback - Function to be removed from subscribers
   * @returns {void}
   */
  public unsubscribe(callback: (time: number) => void): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== callback)
  }

  /**
   * Returns the current elapsed time
   * @returns {number} Current elapsed time in milliseconds
   */
  private getCurrentTime(): number {
    if (this.startTime === null) return 0
    return this.pausedTime !== null
      ? this.pausedTime - this.startTime
      : this.currentTime - this.startTime
  }

  private startUpdates(): void {
    if (this.timerInterval) return

    this.timerInterval = setInterval(() => {
      if (this.startTime === null || this.pausedTime !== null) return

      this.currentTime = Date.now()
      this.saveToLocalStorage()
      this.notifySubscribers()
    }, 10)
  }

  private saveToLocalStorage(): void {
    const data = {
      startTime: this.startTime,
      currentTime: this.currentTime,
      pausedTime: this.pausedTime,
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }

  private notifySubscribers(): void {
    const currentTime = this.getCurrentTime()
    this.subscribers.forEach((callback) => callback(currentTime))
  }
}
