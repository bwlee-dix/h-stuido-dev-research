/**
 * 태스크 완료 상태를 나타내는 enum
 */
export enum TaskCompletionStatus {
  /** 가이드 없이 성공 */
  SUCCESS_WITHOUT_GUIDE = 'SUCCESS_WITHOUT_GUIDE',
  /** 가이드 후 성공 */
  SUCCESS_WITH_GUIDE = 'SUCCESS_WITH_GUIDE',
  /** 가이드 후 실패 */
  FAILURE_WITH_GUIDE = 'FAILURE_WITH_GUIDE',
}

/**
 * 개별 태스크의 완료 데이터를 나타내는 인터페이스
 */
export interface TaskCompletionData {
  /** 태스크 ID */
  taskId: string
  /** 완료 상태 */
  status: TaskCompletionStatus
  /** 소요 시간 (ms) */
  timeSpent: number
  /** 가이드 표시 여부 */
  guideShown: boolean
  /** 타임스탬프 */
  timestamp: number
}

/**
 * 태스크 완료율 통계를 나타내는 인터페이스
 */
export interface CompletionStats {
  /** 가이드 없이 성공한 횟수 */
  successWithoutGuide: number
  /** 가이드 후 성공한 횟수 */
  successWithGuide: number
  /** 가이드 후 실패한 횟수 */
  failureWithGuide: number
  /** 전체 시도 횟수 */
  totalAttempts: number
  /** 자체 완수율 (%) */
  selfCompletionRate: number
}

/**
 * 태스크 완료율을 추적하는 클래스
 */
export class CompleteRateTracker {
  private taskData: Map<string, TaskCompletionData> = new Map()
  private currentTaskId: string | null = null
  private taskStartTime: number = 0
  private guideShownTime: number | null = null

  /**
   * 새로운 태스크 추적을 시작합니다
   * @param taskId 태스크 식별자
   */
  startTask(taskId: string): void {
    this.currentTaskId = taskId
    this.taskStartTime = Date.now()
    this.guideShownTime = null
  }

  /**
   * 가이드가 표시되었음을 기록합니다
   */
  markGuideShown(): void {
    if (this.currentTaskId) {
      this.guideShownTime = Date.now()
    }
  }

  /**
   * 태스크 완료를 기록합니다
   * @param successful 성공 여부
   */
  completeTask(successful: boolean): void {
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
   * 현재까지의 통계를 계산합니다
   */
  getStats(): CompletionStats {
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

    return {
      successWithoutGuide,
      successWithGuide,
      failureWithGuide,
      totalAttempts,
      selfCompletionRate,
    }
  }

  /**
   * 수집된 모든 raw 데이터를 반환합니다
   */
  getRawData(): TaskCompletionData[] {
    return Array.from(this.taskData.values())
  }

  /**
   * 모든 데이터를 초기화합니다
   */
  reset(): void {
    this.taskData.clear()
    this.currentTaskId = null
    this.taskStartTime = 0
    this.guideShownTime = null
  }
}
