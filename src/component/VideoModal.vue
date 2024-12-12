<script setup lang="ts">
import { useModalStore } from '../store/modal'
import { computed } from 'vue'
import VideoSample02 from './video/VideoSample02.vue'

const modalStore = useModalStore()
const modalVisible = computed(() => modalStore.modals.video)

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
  done()
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
  <div
    v-if="modalVisible"
    class="fixed left-0 top-0 z-10 flex h-dvh w-dvw items-center justify-center bg-black/20"
  >
    <transition
      name="slide-up"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div
        class="z-100 absolute bottom-0 z-20 flex h-[96%] w-[100%] items-center justify-center"
      >
        <div
          @click="hideModal"
          class="absolute right-[32px] top-[32px] z-30 flex h-14 w-14 cursor-pointer items-center justify-center rounded-[100px] bg-black/60 text-[24px] text-white"
        >
          X
        </div>
        <div class="h-full overflow-hidden rounded-lg">
          <VideoSample02 />
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease-in-out,
    opacity 0.3s ease-in-out;
}
</style>
