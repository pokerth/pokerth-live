<template>
  <div class="flex items-center justify-between px-4 py-2 border-b border-pth-border" style="background: linear-gradient(to right, var(--pth-grad-start), var(--pth-grad-end));">
    <div class="flex items-center gap-2 text-sm">
      <span class="text-white/80">Logged in as:</span>
      <span
        class="font-semibold text-white"
      >
        {{ connected ? nickName : 'offline' }}
      </span>
    </div>
    <div class="flex items-center gap-3">
      <button
        class="text-white/70 hover:text-white text-sm transition-colors"
        title="Toggle Dark/Light Theme"
        @click="toggleTheme"
      >
        {{ isDark ? '☀️' : '🌙' }}
      </button>
      <span class="text-white/50 text-xs">v{{ versionString }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useGameCacheStore } from '@/stores'
import { POKERTH_VERSION_MAJOR, POKERTH_VERSION_MINOR, POKERTH_VERSION_PATCH } from '@/constants'

const store = useGameCacheStore()

const connected = computed(() => store.connected)
const nickName = computed(() => store.nickName)
const versionString = `${POKERTH_VERSION_MAJOR}.${POKERTH_VERSION_MINOR}.${POKERTH_VERSION_PATCH}`

const isDark = ref(true)

onMounted(() => {
  const saved = localStorage.getItem('pth-theme')
  if (saved) {
    isDark.value = saved === 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }
})

function toggleTheme() {
  isDark.value = !isDark.value
  const theme = isDark.value ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('pth-theme', theme)
}
</script>
