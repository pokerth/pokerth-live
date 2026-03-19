<template>
  <img
    :src="avatarUrl"
    :alt="playerName"
    class="w-8 h-8 shrink-0 rounded-full object-cover bg-pth-surface-alt"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import { AVATAR_SERVER_URL } from '@/constants'

const props = defineProps({
  playerId: { type: Number, required: true }
})

const store = useGameCacheStore()

const playerData = computed(() => store.getPlayerData(props.playerId))

const playerName = computed(() =>
  playerData.value?.playerInfoData?.playerName || `id${props.playerId}`
)

const avatarUrl = computed(() => {
  const fn = playerData.value?.avatarFileName
  if (fn) return AVATAR_SERVER_URL + fn
  return 'gfx/pokerTH_50x50_alpha50.png'
})
</script>
