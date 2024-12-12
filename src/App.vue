<script setup lang="ts">
import { RouterView } from 'vue-router'
import GNB from './component/GNB.vue'

import VideoModal from './component/VideoModal.vue'
import CommonModal from './component/CommonModal.vue'
import ScreenModal from './component/ScreenModal.vue'
</script>

<template>
  <RouterView />
  <GNB />
  <ScreenModal :modal-name="'결제 완료'" :button-label="'충전 시작'">
    <template v-slot:body>
      <div class="flex w-full justify-start">
        <ul class="flex w-full flex-col gap-[8px] text-xl">
          <li class="flex w-full justify-between">
            <span>거래처</span>
            <span>현대자동차그룹</span>
          </li>
          <li class="flex w-full justify-between">
            <span>거래 일자</span>
            <span>2024.09.01</span>
          </li>
          <div class="my-8 h-[1px] w-full bg-black"></div>
          <li class="flex w-full justify-between">
            <span>거래 금액</span>
            <span>15,721원</span>
          </li>
        </ul>
      </div>
    </template>
  </ScreenModal>
  <VideoModal />
  <CommonModal />
</template>

<style scoped></style>
