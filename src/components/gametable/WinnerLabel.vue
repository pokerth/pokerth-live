<template>
  <div
    v-if="visible"
    class="absolute text-center z-20 animate-bounce"
    :style="labelStyle"
    style="text-shadow: -5px 0 5px yellow, 0 5px 5px yellow, 5px 0 5px yellow, 0 -4px 4px yellow;"
  >
    <span class="text-black font-bold" :style="{ fontSize: fontSize + 'px' }">Winner</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  seatX: { type: Number, required: true },
  seatY: { type: Number, required: true },
  seatIndex: { type: Number, required: true },
  canvasHeight: { type: Number, required: true },
  visible: { type: Boolean, default: false },
})

const isTopSeat = computed(() => props.seatIndex >= 3 && props.seatIndex <= 7)
const fontSize = computed(() => parseInt(props.canvasHeight * 3.5 / 100))
const topOffset = computed(() => isTopSeat.value ? 5 : 0)

const labelStyle = computed(() => ({
  left: parseInt(props.seatX + props.canvasHeight * 11 / 100) + 'px',
  top: parseInt(props.seatY + props.canvasHeight * (10 + topOffset.value) / 100) + 'px',
}))
</script>
