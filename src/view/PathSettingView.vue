<template>
  <div v-if="taskIndex === 'task1'" class="image-container">
    <img :src="imagePath1" alt="path setting" @click="clickBtn" />
  </div>
  <div v-if="taskIndex === 'task2'" class="image-container">
    <img :src="imagePath2" alt="path setting" @click="clickBtn" />
  </div>
  <div v-if="taskIndex === 'task3'" class="image-container">
    <img :src="imagePath3" alt="path setting" @click="clickBtn" />
  </div>
  <div v-if="taskIndex === 'chart'" class="image-container">
    <div>오호호호</div>
    <button @click="restartTask">다시 시작</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imagePath1 = new URL('@/asset/path-setting-01.png', import.meta.url).href;
const imagePath2 = new URL('@/asset/path-setting-02.png', import.meta.url).href;
const imagePath3 = new URL('@/asset/path-setting-03.png', import.meta.url).href;

const taskIndex = ref<'task1' | 'task2' | 'task3' | 'chart'>('task1');

const clickBtn = () => {
  switch (taskIndex.value) {
    case 'task1':
      taskIndex.value = 'task2';
      break;
    case 'task2':
      taskIndex.value = 'task3';
      break;
    case 'task3':
      taskIndex.value = 'chart';
      break;
    case 'chart':
      taskIndex.value = 'task1';
      break;
  }
};

const restartTask = () => {
  taskIndex.value = 'task1';
};
</script>

<style scoped>
.image-container {
  height: 100%;
  width: 100%;

  img {
    height: 100%;
    width: 100%;
  }

  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #45a049;
  }
}
</style>
