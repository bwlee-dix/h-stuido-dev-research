<script setup lang="ts">
import { ref } from 'vue'

import { CompleteTimer } from '@/module/completeTimer'
import CompleteTimerModal from '@/component/ComponentTimerModal.vue'

const currentPage = ref(1)
const timer = new CompleteTimer()

const tasks = {
  1: 'Click all blue circles',
  2: 'Sort the numbers in ascending order',
  3: 'Match the pairs of cards',
}

const goToNextPage = () => {
  if (currentPage.value < 3) {
    currentPage.value++
  }
}

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const numbers = ref([5, 2, 8, 1, 4])
</script>

<template>
  <div class="container">
    <CompleteTimerModal :timer="timer" />

    <div class="page-container">
      <div class="page-content">
        <div class="page-header">
          <div class="page-title">
            <h2>Task {{ currentPage }}</h2>
            <p>{{ tasks[currentPage as keyof typeof tasks] }}</p>
          </div>
          <div class="navigation-buttons">
            <button
              @click="goToPrevPage"
              :disabled="currentPage === 1"
              class="nav-btn"
            >
              Previous
            </button>
            <span class="page-indicator">{{ currentPage }} / 3</span>
            <button
              @click="goToNextPage"
              :disabled="currentPage === 3"
              class="nav-btn"
            >
              Next
            </button>
          </div>
        </div>

        <div v-if="currentPage === 1" class="task-content">
          <div class="circle-container">
            <div v-for="i in 5" :key="i" class="circle" @click="() => {}"></div>
          </div>
        </div>

        <div v-if="currentPage === 2" class="task-content">
          <div class="number-container">
            <div v-for="(num, i) in numbers" :key="i" class="number-card">
              {{ num }}
            </div>
          </div>
        </div>

        <div v-if="currentPage === 3" class="task-content">
          <div class="card-container">
            <div v-for="i in 6" :key="i" class="memory-card"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 2rem;
  padding-bottom: 120px;
  max-width: 800px;
  min-width: 400px;
  height: 100%;
  margin: 0 auto;

  .page-container {
    margin-top: 2rem;
    padding: 2rem;
    height: 100%;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    .page-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 100%;
      justify-content: space-between;

      .page-title {
        h2 {
          font-size: 20px;
          font-weight: 700;
        }
      }

      .navigation-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        .page-indicator {
          width: 40px;
        }
      }
    }
  }
  .nav-btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    background-color: #2196f3;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;

    &:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  }

  .page-indicator {
    font-size: 1.1rem;
    font-weight: bold;
  }

  .task-content {
    margin: 2rem 0;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 8px;

    .circle-container {
      display: flex;
      gap: 1rem;
      justify-content: center;

      .circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #2196f3;
        cursor: pointer;
        transition: transform 0.2s;
      }
    }

    .number-container {
      display: flex;
      gap: 1rem;
      justify-content: center;

      .number-card {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: move;
      }
    }

    .card-container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      max-width: 400px;
      margin: 0 auto;

      .memory-card {
        aspect-ratio: 3/4;
        background: #2196f3;
        border-radius: 4px;
        cursor: pointer;
        transition: transform 0.2s;

        &:hover {
          transform: scale(1.05);
        }

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .container {
    .page-container {
      .page-header {
        flex-direction: column;
        align-items: start;
        gap: 24px;

        .navigation-buttons {
          width: 100%;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>
