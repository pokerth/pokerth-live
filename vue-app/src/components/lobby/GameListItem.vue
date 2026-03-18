<template>
  <div class="border border-pth-border-subtle rounded mb-2 overflow-hidden">
    <!-- Header row -->
    <div
      class="grid grid-cols-[1fr_3.5rem_2.5rem_2.5rem_2.5rem_4rem_5rem_1rem] items-center gap-1 px-3 py-2 bg-pth-surface cursor-pointer hover:bg-pth-surface-hover transition-colors"
      @click="expanded = !expanded"
    >
      <span class="min-w-0 text-pth-text text-sm font-semibold truncate">{{ gameName }}</span>
      <span class="text-pth-text-secondary text-xs text-center">{{ playerCount }}/{{ maxPlayers }}</span>
      <GameModeIcon :game-mode="gameData.gameMode" />
      <GameTypeIcon :game-type="gameData.gameInfo?.netGameType" />
      <PrivateIcon :is-private="gameData.isPrivate" />
      <SpectatorIcon :allow-spectators="gameData.gameInfo?.allowSpectators" :count="spectatorCount" />
      <span class="text-pth-muted text-xs text-center">
        {{ gameData.gameInfo?.playerActionTimeout }}s/{{ gameData.gameInfo?.delayBetweenHands }}s
      </span>
      <svg
        class="w-4 h-4 text-pth-muted transition-transform justify-self-center"
        :class="{ 'rotate-180': expanded }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>

    <!-- Expanded details -->
    <div v-if="expanded" class="bg-pth-elevated px-3 py-2 space-y-2">
      <ul class="space-y-1">
        <li v-for="pid in gameData.playerIds" :key="pid" class="flex items-center gap-2">
          <PlayerAvatar :player-id="pid" />
          <span class="text-pth-text text-sm truncate">{{ playerName(pid) }}</span>
        </li>
      </ul>
      <GameInfoTable :game-info="gameData.gameInfo" />
      <button
        class="mt-2 px-4 py-1.5 rounded bg-pth-accent hover:bg-pth-accent-hover text-white text-sm font-semibold"
        @click="$emit('spectate', gameId)"
      >
        Spectate
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useGameCacheStore } from '@/stores'
import PlayerAvatar from './PlayerAvatar.vue'
import GameInfoTable from './GameInfoTable.vue'
import GameModeIcon from './icons/GameModeIcon.vue'
import GameTypeIcon from './icons/GameTypeIcon.vue'
import PrivateIcon from './icons/PrivateIcon.vue'
import SpectatorIcon from './icons/SpectatorIcon.vue'

const props = defineProps({
  gameId: { type: Number, required: true },
  gameData: { type: Object, required: true }
})

defineEmits(['spectate'])

const store = useGameCacheStore()
const expanded = ref(false)

const gameName = computed(() =>
  (props.gameData.gameInfo?.gameName || '').replace(/<[^>]*>/g, '')
)
const playerCount = computed(() => props.gameData.playerIds?.length || 0)
const maxPlayers = computed(() => props.gameData.gameInfo?.maxNumPlayers || 0)
const spectatorCount = computed(() => props.gameData.spectatorIds?.length || 0)

function playerName(pid) {
  const pd = store.getPlayerData(pid)
  return pd?.playerInfoData?.playerName || `id${pid}`
}
</script>
