<template>
  <div
    class="absolute rounded-full bg-black flex items-center justify-center"
    :style="buttonStyle"
  >
    <div
      class="rounded-full bg-white flex items-center justify-center text-black font-bold"
      :style="innerStyle"
    >
      D
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  seatIndex: { type: Number, required: true },
  seatW: { type: Number, required: true },
  seatH: { type: Number, required: true },
})

const isTopSeat = computed(() => props.seatIndex >= 3 && props.seatIndex <= 7)
const radius = computed(() => Math.max(16, props.seatH * 0.14))

const buttonStyle = computed(() => {
  const r = radius.value
  const y = isTopSeat.value ? props.seatH - r - 2 : 2
  return {
    width: r * 2 + 'px',
    height: r * 2 + 'px',
    left: (props.seatW * 0.15) + 'px',
    top: y + 'px',
    zIndex: 9,
  }
})

const innerStyle = computed(() => {
  const r = radius.value
  const inner = r * 0.82
  return {
    width: inner * 2 + 'px',
    height: inner * 2 + 'px',
    fontSize: r * 0.9 + 'px',
  }
})
</script>
