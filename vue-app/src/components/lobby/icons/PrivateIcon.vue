<template>
  <span class="w-6 text-center" :title="title">
    <img v-if="isPrivate" :src="'gfx/lobby/gameprivate_locked.png'" :alt="title" class="w-5 h-5 inline-block" />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isPrivate: { type: Boolean, default: false }
})

const title = computed(() => props.isPrivate ? 'Private game' : '')
</script>
