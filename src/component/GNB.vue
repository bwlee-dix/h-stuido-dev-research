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
</script>

<template>
  <div class="w-full bg-black text-white absolute bottom-0 h-20 flex flex-col justify-center">
    <div class="max-w-[1000px] mx-auto w-full flex flex-row gap-8 justify-center">
      <div @click="openCommonModal" class="button-tel cursor-pointer">
        <IconTelephone />
      </div>

      <IconMap />
      <div @click="openVideoModal" class="button-wavve cursor-pointer">
        <IconWavve />
      </div>
      <IconSetting />
    </div>
  </div>
</template>
