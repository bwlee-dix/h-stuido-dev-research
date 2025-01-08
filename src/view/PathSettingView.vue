<template>
  <div v-if="taskIndex === 'task1'" class="image-container">
    <div class="info">1. 목적지 설정</div>
    <img :src="imagePath1" alt="path setting" @click="clickBtn" />
  </div>
  <div v-if="taskIndex === 'task2'" class="image-container">
    <div class="info">2. 경로 탐색</div>
    <img :src="imagePath2" alt="path setting" @click="clickBtn" />
  </div>
  <div v-if="taskIndex === 'task3'" class="image-container">
    <div class="info">3. 경로 안내 시작</div>
    <img :src="imagePath3" alt="path setting" @click="clickBtn" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import TouchCountTracker, { type TouchEventData } from '@/module/touchCountTracker';
import { CompleteTimer, type TimerRecord } from '@/module/completeTimer'

const imagePath1 = new URL('@/asset/path-setting-01.png', import.meta.url).href;
const imagePath2 = new URL('@/asset/path-setting-02.png', import.meta.url).href;
const imagePath3 = new URL('@/asset/path-setting-03.png', import.meta.url).href;

const router = useRouter();

const tracker = new TouchCountTracker({
  onTouchEnd: (data) => {
    touchData.value = { ...data }
  },
})

const timer = new CompleteTimer()

const taskIndex = ref<'task1' | 'task2' | 'task3' | 'chart'>('task1');
const records = ref<TimerRecord[]>()
const touchData = ref<TouchEventData>({
  touchStartCount: 0,
  touchEndCount: 0,
  touchCancelCount: 0,
  totalTouches: 0,
  activeTouches: 0,
  touchCoordinates: [
    {
      x: 0,
      y: 0,
      time_millis: 0,
    }
  ]
})

const updateRecords = () => {
  records.value = timer.getRecords()
}

const clickBtn = () => {
  switch (taskIndex.value) {
    case 'task1':
      taskIndex.value = 'task2';
      break;
    case 'task2':
      taskIndex.value = 'task3';
      break;
    case 'task3':
      clickBtnLast();
      break;
  }
};

const clickBtnLast = () => {
  tracker.stopTracking()
  timer.stop();
  updateRecords();
  router.push('/path-setting-stat');
}

onMounted(() => {
  tracker.resetData();
  timer.reset()
  tracker.startTracking()
  timer.start();
})
</script>

<style scoped>
.image-container {
  height: 100%;
  width: 100%;

  .info {
    font-size: 18px;
    font-weight: 700;
    padding: 16px 32px;
    background-color: white;
    border: 1px solid #d0d1d2;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 20px;
    right: 20px;
    border-radius: 8px;
  }

  img {
    height: 100%;
    width: 100%;
  }
}
</style>
