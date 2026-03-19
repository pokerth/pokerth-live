<template>
  <div
    v-if="visible"
    class="absolute z-20 font-bold text-yellow-300 transition-all duration-1000"
    :style="labelStyle"
  >
    ${{ moneyWon }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  moneyWon: { type: Number, default: 0 },
  seatX: { type: Number, required: true },
  seatY: { type: Number, required: true },
  seatIndex: { type: Number, required: true },
  canvasHeight: { type: Number, required: true },
  visible: { type: Boolean, default: false },
})

const isTopSeat = computed(() => props.seatIndex >= 3 && props.seatIndex <= 7)
const topOffset = computed(() => isTopSeat.value ? 11 : 0)

const labelStyle = computed(() => ({
  left: parseInt(props.seatX + props.canvasHeight * 11 / 100) + 'px',
  top: parseInt(props.seatY + props.canvasHeight * (15 - topOffset.value) / 100) + 'px',
  fontSize: parseInt(props.canvasHeight * 2.3 / 100) + 'px',
}))
</script>
