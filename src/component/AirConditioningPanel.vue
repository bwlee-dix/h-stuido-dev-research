<template>
  <div class="drag-area" @touchstart="handleTouchStart" @touchmove="handleTouchMove" @touchend="handleTouchEnd">
    <div class="dim" v-if="modalVisible" @touchstart="handleDimTouch">
    </div>

    <div class="air-conditioning-panel" :style="{ transform: `translateY(${translateY}px)` }">
      <div class="drag-handle"></div>
      <div class="content">Air Conditioning Panel</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSwipeUpGesture } from '@/composable/useSwipeUpGesture'


const props = defineProps({
  isDismissible: {
    type: Boolean,
    default: false,
  }
})

const { translateY, modalVisible, handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeUpGesture()

const handleDimTouch = (): void => {

  if (props.isDismissible) {
    translateY.value = 300
    modalVisible.value = false
  }
}
</script>

<style>
.drag-area {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 40px;
  z-index: 20;

  .dim {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 1;
  }

  .air-conditioning-panel {
    position: fixed;
    z-index: 20;
    bottom: 0;
    width: 100%;
    height: 300px;
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.2s ease-out;

    .content {
      width: 100%;
      height: 100%;
      font-size: 16px;
      font-weight: 600;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .drag-handle {
      width: 40px;
      height: 4px;
      background-color: gray;
      border-radius: 2px;
      margin: 10px 0;
    }
  }
}
</style>
