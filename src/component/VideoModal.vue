<script setup lang="ts">
import { useModalStore } from '../store/modal'
import { computed, ref } from 'vue'
import VideoSample02 from './video/VideoSample02.vue'

const modalStore = useModalStore()
const modalVisible = computed(() => modalStore.modals.video)

const brightness = ref(1)
const volume = ref(0.5)

const hideModal = () => {
  modalStore.hideModal('video')
}

const beforeEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.transform = 'translateY(100%)'
  element.style.opacity = '0'
}

const enter = (el: Element, done: Function) => {
  const element = el as HTMLElement
  element.offsetHeight
  element.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease'
  element.style.transform = 'translateY(0)'
  element.style.opacity = '1'
  element.addEventListener(
    'transitionend',
    () => {
      done()
    },
    { once: true },
  )
}

const leave = (el: Element, done: Function) => {
  const element = el as HTMLElement
  element.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease'
  element.style.transform = 'translateY(100%)'
  element.style.opacity = '0'
  element.addEventListener(
    'transitionend',
    () => {
      done()
    },
    { once: true },
  )
}
</script>

<template>
  <transition
    name="slide-up"
    @before-enter="beforeEnter"
    @enter="enter"
    @leave="leave"
  >
    <div
      v-if="modalVisible"
      class="dim absolute left-0 top-0 z-[9999] flex h-dvh w-dvw items-center justify-center bg-black/20"
    >
      <div
        @click="hideModal"
        class="absolute right-[32px] top-[32px] z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-[100px] bg-black/60 text-[24px] text-white"
      >
        X
      </div>
      <div
        class="modal relative z-[999999] h-[90vh] overflow-hidden rounded-lg"
      >
        <VideoSample02 :brightness="brightness" :volume="volume" />
        <div
          class="absolute bottom-8 left-1/2 flex w-[80%] -translate-x-1/2 transform flex-col items-center gap-4"
        >
          <div class="w-full text-center">
            <label for="brightness" class="block text-white">밝기</label>
            <input
              id="brightness"
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model="brightness"
              class="w-full"
            />
          </div>
          <div class="w-full text-center">
            <label for="volume" class="block text-white">음량</label>
            <input
              id="volume"
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model="volume"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}
</style>
