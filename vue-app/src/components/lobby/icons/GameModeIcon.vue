<template>
  <span class="w-14 text-center" :title="title">
    <img v-if="src" :src="src" :alt="title" class="w-5 h-5 inline-block" />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameMode: { type: Number, default: 0 }
})

const src = computed(() => {
  if (props.gameMode === 1) return 'gfx/lobby/open_game.png'
  if (props.gameMode === 2) return 'gfx/lobby/running_game.png'
  return ''
})

const title = computed(() => {
  if (props.gameMode === 1) return 'Open game'
  if (props.gameMode === 2) return 'Running game'
  return ''
})
</script>
