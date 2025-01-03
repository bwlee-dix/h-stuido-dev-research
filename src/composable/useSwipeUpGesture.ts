import { ref } from 'vue'

export const useSwipeUpGesture = () => {
  const modalVisible = ref<boolean>(false)
  const startY = ref<number>(0)
  const currentY = ref<number>(0)
  const isDragging = ref<boolean>(false)
  const translateY = ref<number>(300)
  const upwardThreshold = ref<number>(100)
  const downwardThreshold = ref<number>(10)
  const minDragDistance = ref<number>(20)

  const handleTouchStart = (event: TouchEvent): void => {
    const clientY: number = event.touches[0].clientY
    startY.value = clientY
    currentY.value = clientY

    if (modalVisible.value || clientY > window.innerHeight * 0.8) {
      isDragging.value = true
    } else {
      isDragging.value = false
    }
  }

  const handleTouchMove = (event: TouchEvent): void => {
    if (!isDragging.value) return

    const clientY: number = event.touches[0].clientY
    currentY.value = clientY
    const deltaY: number = startY.value - currentY.value

    if (Math.abs(deltaY) > minDragDistance.value) {
      if (modalVisible.value) {
        translateY.value = Math.max(0, Math.min(300, -deltaY))
      } else {
        translateY.value = Math.max(0, Math.min(300, 300 - deltaY))
      }
    }
  }

  const handleTouchEnd = (): void => {
    if (!isDragging.value) {
      resetDragState()
      return
    }

    const deltaY: number = startY.value - currentY.value

    if (Math.abs(deltaY) <= minDragDistance.value) {
      translateY.value = modalVisible.value ? 0 : 300
      resetDragState()
      return
    }

    if (modalVisible.value) {
      if (-deltaY > downwardThreshold.value) {
        translateY.value = 300
        modalVisible.value = false
      } else {
        translateY.value = 0
      }
    } else {
      if (deltaY > upwardThreshold.value) {
        translateY.value = 0
        modalVisible.value = true
      } else {
        translateY.value = 300
      }
    }

    resetDragState()
  }

  const resetDragState = (): void => {
    startY.value = 0
    currentY.value = 0
    isDragging.value = false
  }

  return {
    modalVisible,
    translateY,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
