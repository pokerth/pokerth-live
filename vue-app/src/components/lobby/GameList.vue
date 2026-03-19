<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="hidden md:grid grid-cols-[1fr_3.5rem_2.5rem_2.5rem_2.5rem_4rem_5rem_1rem] items-center gap-1 px-3 py-2 bg-pth-surface text-pth-muted text-xs font-semibold rounded-t">
      <span class="min-w-0">Name</span>
      <span class="text-center">Players</span>
      <span class="text-center">Status</span>
      <span class="text-center">Type</span>
      <span class="text-center">Private</span>
      <span class="text-center">Spectators</span>
      <span class="text-center">Timeouts</span>
      <span></span>
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
      <div v-if="gameList.length === 0" class="p-4 text-pth-dimmed text-sm italic">
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
