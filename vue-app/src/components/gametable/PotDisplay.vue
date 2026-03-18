<template>
  <div class="absolute" :style="positionStyle">
    <span class="text-poker-pot font-bold" :style="{ fontSize: fontSize + 'px' }">
      Bets: ${{ betsSum }}
    </span>
    <span class="ml-6 text-poker-pot font-bold" :style="{ fontSize: fontSize + 'px' }">
      Total: ${{ totalPot }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'

const props = defineProps({
  canvasWidth: { type: Number, required: true },
  canvasHeight: { type: Number, required: true },
})

const store = useGameCacheStore()

const betsSum = computed(() => {
  const ng = store.netGame
  if (!ng?.gameData?.playerSeats) return 0
  let sum = 0
  for (const pid of ng.gameData.playerSeats) {
    const pd = store.getPlayerData(pid)
    if (pd?.gameValues?.mySet) sum += pd.gameValues.mySet
  }
  return sum
})

const totalPot = computed(() => store.netGame?.hand?.pot || 0)

const fontSize = computed(() => parseInt(props.canvasHeight * 3.2 / 100))

const positionStyle = computed(() => ({
  left: parseInt(props.canvasHeight * 55 / 100) + 'px',
  top: parseInt(props.canvasHeight * 48 / 100) + 'px',
  zIndex: 12,
}))
</script>
