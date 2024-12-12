<template>
  <div class="relative w-full h-full">
    <video
      ref="videoElement"
      :autoplay="true"
      loop
      :controls="false"
      class="h-full w-full object-cover"
    >
      <source src="../../asset/video-sample-03.mp4" type="video/mp4" />
    </video>
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      v-model="volume"
      @input="updateVolume"
      class="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1/2 z-10"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const videoElement = ref<HTMLVideoElement | null>(null)
const volume = ref(0.5) // 기본 볼륨 50%

// 볼륨을 업데이트하는 메서드
const updateVolume = () => {
  if (videoElement.value) {
    videoElement.value.volume = volume.value
  }
}

// 컴포넌트가 로드되었을 때 볼륨 초기화
watch(volume, (newVolume) => {
  if (videoElement.value) {
    videoElement.value.volume = newVolume
  }
})
</script>

<style scoped>
/* 슬라이더 스타일 */
input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
  background: #ddd;
  border-radius: 10px;
  height: 5px;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #4caf50;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb {
  background: #4caf50;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
