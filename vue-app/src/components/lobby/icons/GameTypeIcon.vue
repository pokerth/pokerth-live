<template>
  <span class="w-6 text-center" :title="title">
    <img v-if="src" :src="src" :alt="title" class="w-5 h-5 inline-block" />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameType: { type: Number, default: 0 }
})

const map = {
  1: { src: '/gfx/lobby/gametype_standard.png', title: 'Standard game' },
  2: { src: '/gfx/lobby/gametype_registered.png', title: 'Registered game' },
  3: { src: '/gfx/lobby/gametype_inviteonly.png', title: 'Invite only game' },
  4: { src: '/gfx/lobby/gametype_ranking.png', title: 'Ranking game' },
}

const src = computed(() => map[props.gameType]?.src || '')
const title = computed(() => map[props.gameType]?.title || '')
</script>
