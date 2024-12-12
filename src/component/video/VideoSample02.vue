<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  brightness: {
    type: Number,
    default: 1,
  },
  volume: {
    type: Number,
    default: 0.5,
  },
})

const videoElement = ref<HTMLVideoElement | null>(null)

watch(
  () => props.volume,
  (newVolume) => {
    if (videoElement.value) {
      videoElement.value.volume = newVolume
    }
  },
)

watch(
  () => props.brightness,
  (newBrightness) => {
    if (videoElement.value) {
      videoElement.value.style.filter = `brightness(${newBrightness})`
    }
  },
)
</script>

<template>
  <div class="relative h-full w-full">
    <video
      ref="videoElement"
      :autoplay="true"
      loop
      :controls="false"
      class="h-full w-full object-cover"
    >
      <source src="../../asset/video-sample-03.mp4" type="video/mp4" />
    </video>
  </div>
</template>
