<template>
  <Transition name="fade">
    <div v-if="popup" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div class="bg-pth-surface border border-pth-border rounded-lg shadow-xl w-full max-w-sm">
        <div class="rounded-t-lg px-6 py-3" style="background: linear-gradient(to right, var(--pth-grad-start), var(--pth-grad-end));">
          <h1 class="text-white text-lg font-bold">{{ popup.title }}</h1>
        </div>
        <div class="p-6 space-y-4">
          <div class="text-pth-text text-sm" v-html="popup.message" />
          <div v-if="popup.type === 'loading'" class="flex justify-center">
            <div class="w-8 h-8 border-4 border-pth-gold border-t-transparent rounded-full animate-spin" />
          </div>
          <button
            v-if="popup.buttonText"
            class="px-4 py-2 rounded bg-pth-accent hover:bg-pth-accent-hover text-white text-sm font-semibold"
            @click="onButton"
          >
            {{ popup.buttonText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import { resetServerTimeout } from '@/services/netEventHandler'

const store = useGameCacheStore()

const popup = computed(() => store.popup)

function onButton() {
  if (popup.value.type === 'timeout') {
    resetServerTimeout()
  }
  store.hidePopup()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
