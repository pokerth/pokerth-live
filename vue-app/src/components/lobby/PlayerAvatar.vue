<template>
  <div class="flex items-center gap-3 px-3 py-2">
    <img
      :src="avatarUrl"
      :alt="playerName"
      class="w-8 h-8 rounded-full object-cover bg-gray-700"
    />
    <span class="text-white text-sm truncate">{{ playerName }}</span>
  </div>
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
  return '/gfx/pokerTH_50x50_alpha50.png'
})
</script>
