<script setup lang="ts">
import { RouterView } from 'vue-router'
import GNB from './component/GNB.vue'

import VideoModal from './component/VideoModal.vue'
import CommonModal from './component/CommonModal.vue'
</script>

<template>
  <RouterView />

  <GNB />
  <VideoModal />
  <CommonModal />
</template>

<style scoped></style>
