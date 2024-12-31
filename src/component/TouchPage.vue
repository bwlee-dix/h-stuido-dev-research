<template>
  <div class="title-container">
    <h2>{{ pageTitle }}</h2>
    <div class="button-wrapper">
      <button :disabled="isFirstPage" @click="goToPreviousPage">
        이전 페이지
      </button>
      <button :disabled="isLastPage" @click="goToNextPage">다음 페이지</button>
    </div>
  </div>
  <TouchDataAccordion :touchData="touchData" />

</template>

<script setup lang="ts">
import { type PropType } from 'vue'
import type { TouchEventData } from '@/module/touchCountTracker'
import TouchDataAccordion from './TouchDataAccordion.vue'

defineProps({
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
  touchData: {
    type: Object as PropType<TouchEventData>,
    required: true,
  },
})
</script>

<style scoped>
.title-container {
  padding: 24px;

  h2 {
    width: 100%;
    text-align: center;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 8px;

    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;

      &:hover {
        background-color: #0056b3;
      }

      &:disabled {
        background-color: #aaa;
        cursor: not-allowed;
      }

    }
  }

}
</style>
