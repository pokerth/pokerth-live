<template>
  <span class="w-10 text-center flex items-center gap-1" :title="title">
    <img :src="src" :alt="title" class="w-5 h-5 inline-block" />
    <span class="text-gray-300 text-xs">{{ count }}</span>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  allowSpectators: { type: Boolean, default: true },
  count: { type: Number, default: 0 }
})

const src = computed(() =>
  props.allowSpectators ? 'gfx/lobby/spectator.png' : 'gfx/lobby/no_spectator.png'
)
const title = computed(() =>
  props.allowSpectators ? 'Allow spectators' : 'No spectators allowed'
)
</script>
