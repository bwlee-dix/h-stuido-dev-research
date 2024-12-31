/**
 * CompleteTimer module for measuring task completion time
 * Provides functionality to start, pause, stop and reset timer
 * Includes real-time updates and local storage integration
 */

export interface TimerRecord {
  startTime: number | null
  stopTime?: number
}

export class CompleteTimer {
  private startTime: number | null = null
  private readonly recordsKey: string = 'completeTimerRecords'

  /**
   * Starts the timer and begins real-time updates
   * @returns {void}
   */
  public start(): void {
    if (!this.startTime === null) return

    this.startTime = Date.now()
  }

  /**
   * Stops the timer and returns the final elapsed time
   * @returns {number} The total elapsed time in milliseconds
   */
  public stop(): number {
    if (this.startTime === null) return 0

    const endTime = Date.now()

    const elapsedTime = endTime - this.startTime

    const records = this.getRecordsFromStorage()
    const newRecord: TimerRecord = {
      startTime: this.startTime,
      stopTime: endTime,
    }
    records.push(newRecord)
    localStorage.setItem(this.recordsKey, JSON.stringify(records))

    this.startTime = null

    return elapsedTime
  }

  /**
   * Resets the timer and clears local storage data
   * @returns {void}
   */
  public reset(): void {
    localStorage.removeItem(this.recordsKey)
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

  /**
   * Gets the start time of the current timer session.
   *
   * @returns {number | null} The start time of the current timer, or null if the timer is not running.
   */
  public getStartTime(): number | null {
    return this.startTime
  }

  private getRecordsFromStorage(): TimerRecord[] {
    const records = localStorage.getItem(this.recordsKey)
    return records ? JSON.parse(records) : []
  }
}
