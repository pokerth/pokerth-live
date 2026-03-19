<template>
  <div class="flex flex-col h-full">
    <div class="px-3 py-2">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search players ..."
        class="w-full px-3 py-2 rounded bg-pth-surface text-pth-text border border-pth-border focus:border-pth-gold focus:outline-none text-sm"
      />
    </div>
    <ul class="flex-1 overflow-y-auto">
      <PlayerListItem
        v-for="player in filteredPlayers"
        :key="player.playerId"
        :player-id="player.playerId"
        @spectate="$emit('spectate', $event)"
      />
      <li v-if="filteredPlayers.length === 0" class="p-4 text-pth-dimmed text-sm italic">
        No players found.
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameCacheStore } from '@/stores'
import PlayerListItem from './PlayerListItem.vue'

defineEmits(['spectate'])

const store = useGameCacheStore()
const searchQuery = ref('')

const filteredPlayers = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return store.playerList.filter(p => {
    if (!q) return true
    const name = p.playerInfoData?.playerName || ''
    return name.toLowerCase().includes(q)
  })
})
</script>
