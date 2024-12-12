import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    modals: {
      video: false,
      common: false,
    } as Record<string, boolean>,
  }),
  actions: {
    showModal(modalId: string) {
      this.modals[modalId] = true
    },

    hideModal(modalId: string) {
      this.modals[modalId] = false
    },
  },
})
