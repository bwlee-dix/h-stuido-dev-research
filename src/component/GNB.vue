<script setup lang="ts">
import { useModalStore } from '@/store/modal'
import IconMap from './icon/IconMap.vue'
import IconSetting from './icon/IconSetting.vue'
import IconTelephone from './icon/IconTelephone.vue'
import IconWavve from './icon/IconWavve.vue'

const modalStore = useModalStore()

const openVideoModal = () => {
  modalStore.showModal('video')
}

const openCommonModal = () => {
  modalStore.showModal('common')
}
const openScreenModal = () => {
  modalStore.showModal('screen')
}
</script>

<template>
  <div
    class="absolute bottom-0 flex h-20 w-full flex-col justify-center bg-black text-white"
  >
    <div
      class="mx-auto flex w-full max-w-[1000px] flex-row justify-center gap-8"
    >
      <div @click="openCommonModal" class="button-tel cursor-pointer">
        <IconTelephone />
      </div>

      <div @click="openScreenModal" class="button-wavve cursor-pointer">
        <IconMap />
      </div>
      <div @click="openVideoModal" class="button-wavve cursor-pointer">
        <IconWavve />
      </div>
      <IconSetting />
    </div>
  </div>
</template>
