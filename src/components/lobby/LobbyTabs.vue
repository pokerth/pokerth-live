<template>
  <nav class="flex gap-1 bg-pth-elevated p-1 rounded">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="px-4 py-2 rounded text-sm font-semibold transition-colors"
      :class="activeTab === tab.id
        ? 'bg-pth-accent text-white'
        : 'text-pth-text-secondary hover:text-pth-text hover:bg-pth-surface'"
      @click="$emit('update:activeTab', tab.id)"
    >
      {{ tab.label }}
      <span v-if="tab.count != null" class="ml-1 text-xs opacity-75">({{ tab.count }})</span>
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'

defineProps({
  activeTab: { type: String, required: true }
})

defineEmits(['update:activeTab'])

const store = useGameCacheStore()

const tabs = computed(() => [
  { id: 'games', label: 'Games', count: store.gameList.length },
  { id: 'players', label: 'Players', count: store.playerList.length },
  { id: 'chat', label: 'Chat', count: null }
])
</script>
