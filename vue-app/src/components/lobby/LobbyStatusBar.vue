<template>
  <div class="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700">
    <div class="flex items-center gap-2 text-sm">
      <span class="text-gray-400">Logged in as:</span>
      <span
        class="font-semibold"
        :class="connected ? 'text-poker-gold' : 'text-red-400'"
      >
        {{ connected ? nickName : 'offline' }}
      </span>
    </div>
    <span class="text-gray-500 text-xs">v{{ versionString }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import { POKERTH_VERSION_MAJOR, POKERTH_VERSION_MINOR, POKERTH_VERSION_PATCH } from '@/constants'

const store = useGameCacheStore()

const connected = computed(() => store.connected)
const nickName = computed(() => store.nickName)
const versionString = `${POKERTH_VERSION_MAJOR}.${POKERTH_VERSION_MINOR}.${POKERTH_VERSION_PATCH}`
</script>
