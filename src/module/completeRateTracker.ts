/**
 * Enum representing the completion status of a task.
 */
export enum TaskCompletionStatus {
  /** Success without a guide */
  SUCCESS_WITHOUT_GUIDE = 'SUCCESS_WITHOUT_GUIDE',
  /** Success after using a guide */
  SUCCESS_WITH_GUIDE = 'SUCCESS_WITH_GUIDE',
  /** Failure after using a guide */
  FAILURE_WITH_GUIDE = 'FAILURE_WITH_GUIDE',
}

/**
 * Interface representing the completion data of an individual task.
 */
export interface TaskCompletionData {
  /** Task ID */
  taskId: string
  /** Completion status */
  status: TaskCompletionStatus
  /** Time spent (in milliseconds) */
  timeSpent: number
  /** Whether a guide was shown */
  guideShown: boolean
  /** Timestamp of completion */
  timestamp: number
}

/**
 * Interface representing statistics of task completion rates.
 */
export interface CompletionStats {
  /** Number of successes without a guide */
  successWithoutGuide: number
  /** Number of successes with a guide */
  successWithGuide: number
  /** Number of failures with a guide */
  failureWithGuide: number
  /** Total number of attempts */
  totalAttempts: number
  /** Self-completion rate (%) */
  selfCompletionRate: number
}

/**
 * Class for tracking task completion rates.
 */
export class CompleteRateTracker {
  private taskData: Map<string, TaskCompletionData> = new Map()
  private currentTaskId: string | null = null
  private taskStartTime: number = 0
  private guideShownTime: number | null = null
  private static localStoragePrefix = 'completion-stats'

  /**
   * Starts tracking a new task.
   * @param taskId Task identifier
   */
  public startTask(taskId: string): void {
    this.currentTaskId = taskId
    this.taskStartTime = Date.now()
    this.guideShownTime = null
  }

  /**
   * Records that a guide has been shown.
   */
  public markGuideShown(): void {
    if (!this.currentTaskId) return

    this.guideShownTime = Date.now()
  }

  /**
   * Records the completion of a task.
   * @param successful Whether the task was successfully completed
   */
  public completeTask(successful: boolean): void {
    if (!this.currentTaskId) return

    const now = Date.now()
    const timeSpent = now - this.taskStartTime
    let status: TaskCompletionStatus

    if (!this.guideShownTime) {
      status = TaskCompletionStatus.SUCCESS_WITHOUT_GUIDE
    } else if (successful) {
      status = TaskCompletionStatus.SUCCESS_WITH_GUIDE
    } else {
      status = TaskCompletionStatus.FAILURE_WITH_GUIDE
    }

    this.taskData.set(this.currentTaskId, {
      taskId: this.currentTaskId,
      status,
      timeSpent,
      guideShown: !!this.guideShownTime,
      timestamp: now,
    })

    this.currentTaskId = null
    this.taskStartTime = 0
    this.guideShownTime = null
  }

  /**
   * Calculates statistics based on completed tasks.
   */
  public getStats(): CompletionStats {
    let successWithoutGuide = 0
    let successWithGuide = 0
    let failureWithGuide = 0

    this.taskData.forEach((data) => {
      switch (data.status) {
        case TaskCompletionStatus.SUCCESS_WITHOUT_GUIDE:
          successWithoutGuide++
          break
        case TaskCompletionStatus.SUCCESS_WITH_GUIDE:
          successWithGuide++
          break
        case TaskCompletionStatus.FAILURE_WITH_GUIDE:
          failureWithGuide++
          break
      }
    })

    const totalAttempts = this.taskData.size
    const selfCompletionRate =
      totalAttempts > 0 ? (successWithoutGuide / totalAttempts) * 100 : 0

    // Save raw data to localStorage
    this.saveToLocalStorage()

    return {
      successWithoutGuide,
      successWithGuide,
      failureWithGuide,
      totalAttempts,
      selfCompletionRate,
    }
  }

  /**
   * Returns all collected raw data.
   */
  private getRawData(): TaskCompletionData[] {
    return Array.from(this.taskData.values())
  }

  /**
   * Saves the data to localStorage.
   */
  private saveToLocalStorage(): void {
    const rawData = this.getRawData()
    const localStorageKeys = Object.keys(localStorage)
    const nextIndex =
      localStorageKeys.filter((key) =>
        key.startsWith(CompleteRateTracker.localStoragePrefix),
      ).length + 1
    const storageKey = `${CompleteRateTracker.localStoragePrefix}-${nextIndex}`

    localStorage.setItem(storageKey, JSON.stringify(rawData))
  }

  /**
   * Resets all data.
   */
  public reset(): void {
    this.taskData.clear()
    this.currentTaskId = null
    this.taskStartTime = 0
    this.guideShownTime = null

    // Remove all localStorage data related to stats
    const localStorageKeys = Object.keys(localStorage)
    localStorageKeys.forEach((key) => {
      if (key.startsWith(CompleteRateTracker.localStoragePrefix)) {
        localStorage.removeItem(key)
      }
    })
  }
}
