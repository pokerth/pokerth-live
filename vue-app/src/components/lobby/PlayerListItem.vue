<template>
  <li class="flex items-center gap-3 py-2 px-3 hover:bg-gray-800 rounded">
    <PlayerAvatar :player-id="playerId" />
    <div class="flex-1 min-w-0">
      <h3 class="text-white text-sm font-semibold truncate">{{ playerName }}</h3>
      <p class="text-gray-400 text-xs truncate">
        <template v-if="gameInfo">
          {{ isSpectator ? 'Watching' : 'Playing at' }}: {{ gameInfo.gameName }}
        </template>
        <template v-else>
          <i>Currently idle</i>
        </template>
      </p>
    </div>
    <button
      v-if="gameInfo && !isSpectator"
      class="px-3 py-1 text-xs rounded bg-poker-border hover:bg-poker-border-light text-white whitespace-nowrap"
      @click="$emit('spectate', spectateGameId)"
    >
      Spectate
    </button>
  </li>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import PlayerAvatar from './PlayerAvatar.vue'

const props = defineProps({
  playerId: { type: Number, required: true }
})

defineEmits(['spectate'])

const store = useGameCacheStore()

const playerData = computed(() => store.getPlayerData(props.playerId))

const playerName = computed(() =>
  playerData.value?.playerInfoData?.playerName || `id${props.playerId}`
)

const gameInfo = computed(() => {
  for (const [gameId, gd] of store.gameDataMap.entries()) {
    if (gd.playerIds?.includes(props.playerId) || gd.spectatorIds?.includes(props.playerId)) {
      return { gameName: gd.gameInfo?.gameName?.replace(/<[^>]*>/g, '') || `Game ${gameId}`, gameId }
    }
  }
  return null
})

const isSpectator = computed(() => {
  if (!gameInfo.value) return false
  const gd = store.getGameData(gameInfo.value.gameId)
  return gd?.spectatorIds?.includes(props.playerId)
})

const spectateGameId = computed(() => gameInfo.value?.gameId)
</script>
