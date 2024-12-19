import { ref } from 'vue'

export const useDragHandler = () => {
  const modalVisible = ref(false)
  const startY = ref(0)
  const currentY = ref(0)
  const isDragging = ref(false)
  const threshold = 100

  const handlePointerDown = (event: PointerEvent) => {
    console.log('Pointer Down:', event.clientY)
    if (!modalVisible.value && event.clientY < 50) {
      startY.value = event.clientY
      isDragging.value = true
    } else if (modalVisible.value) {
      startY.value = event.clientY
      isDragging.value = true
    }
  }

  const handlePointerMove = (event: PointerEvent) => {
    if (!isDragging.value) return

    currentY.value = event.clientY
    const deltaY = currentY.value - startY.value
    console.log('Pointer Move:', deltaY)

    if (!modalVisible.value && deltaY > threshold) {
      modalVisible.value = true
      console.log('Modal Opened')
      resetDragState()
    } else if (modalVisible.value && -deltaY > threshold) {
      modalVisible.value = false
      console.log('Modal Closed')
      resetDragState()
    }
  }

  const handlePointerUp = () => {
    console.log('Pointer Up')
    resetDragState()
  }

  const resetDragState = () => {
    startY.value = 0
    currentY.value = 0
    isDragging.value = false
  }

  return {
    modalVisible,
    startY,
    currentY,
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
