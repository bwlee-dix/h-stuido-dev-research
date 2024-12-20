<template>
  <div>
    <h2>{{ pageTitle }}</h2>
    <button :disabled="isFirstPage" @click="goToPreviousPage">
      이전 페이지
    </button>
    <button :disabled="isLastPage" @click="goToNextPage">다음 페이지</button>
    <button v-if="isLastPage" @click="finishScenario">시나리오 종료</button>
    <pre>{{ touchData }}</pre>
  </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { TouchEventData } from '@/module/touchCountTracker'

const props = defineProps({
  pageTitle: {
    type: String,
    required: true,
  },
  isFirstPage: {
    type: Boolean,
    required: false,
  },
  isLastPage: {
    type: Boolean,
    required: false,
  },
  goToPreviousPage: {
    type: Function as PropType<() => void>,
  },
  goToNextPage: {
    type: Function as PropType<() => void>,
  },
  finishScenario: {
    type: Function as PropType<() => void>,
  },
  touchData: {
    type: Object as PropType<TouchEventData>,
    required: true,
  },
})
</script>

<style scoped>
h2 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}
button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
}
pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 5px;
  border: 1px solid #ddd;
}
</style>
