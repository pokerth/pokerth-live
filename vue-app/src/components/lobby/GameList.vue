<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-400 text-xs font-semibold rounded-t">
      <span class="flex-1">Name</span>
      <span class="w-16 text-center">Players</span>
      <span class="w-6 text-center">Status</span>
      <span class="w-6 text-center">Type</span>
      <span class="w-6 text-center">Private</span>
      <span class="w-10 text-center">Spectators</span>
      <span class="w-20 text-center">Timeouts</span>
      <span class="w-4"></span>
    </div>
    <!-- List -->
    <div class="flex-1 overflow-y-auto">
      <GameListItem
        v-for="game in gameList"
        :key="game.gameId"
        :game-id="game.gameId"
        :game-data="game"
        @spectate="$emit('spectate', $event)"
      />
      <div v-if="gameList.length === 0" class="p-4 text-gray-500 text-sm italic">
        No games available.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import GameListItem from './GameListItem.vue'

defineEmits(['spectate'])

const store = useGameCacheStore()

const gameList = computed(() => store.gameList)
</script>
