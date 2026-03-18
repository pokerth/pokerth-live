<template>
  <div class="absolute bottom-1 right-1 flex flex-col items-center text-white z-20" :style="containerStyle">
    <img :src="'gfx/gametable/spectator.svg'" :style="{ width: iconSize + 'px', height: iconSize + 'px' }" alt="Spectators" />
    <span class="font-bold" :style="{ fontSize: labelSize + 'px' }">{{ count }}</span>
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

const count = computed(() => store.netGame?.gameData?.spectatorSeats?.length || 0)
const iconSize = computed(() => parseInt(props.canvasWidth * 3.5 / 100))
const labelSize = computed(() => parseInt(props.canvasHeight * 2.3 / 100))
const containerStyle = computed(() => ({
  bottom: parseInt(props.canvasHeight * 0.3 / 100) + 'px',
  right: parseInt(props.canvasWidth * 0.3 / 100) + 'px',
}))
</script>
