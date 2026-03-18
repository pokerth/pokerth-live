<template>
  <!-- Hole cards for a single player seat -->
  <div v-if="visible">
    <CardImage
      :card-value="card1Value"
      :face-up="card1FaceUp"
      :x="card1X"
      :y="card1Y"
      :width="cardWidth"
      :height="cardHeight"
      :visible="visible"
      :transparent="card1Transparent"
    />
    <CardImage
      :card-value="card2Value"
      :face-up="card2FaceUp"
      :x="card2X"
      :y="card2Y"
      :width="cardWidth"
      :height="cardHeight"
      :visible="visible"
      :transparent="card2Transparent"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import { getSeatState, SEAT_STATE } from './seatLayout'
import CardImage from './CardImage.vue'

const props = defineProps({
  playerId: { type: Number, required: true },
  seatIndex: { type: Number, required: true },
  seatX: { type: Number, required: true },
  seatY: { type: Number, required: true },
  seatW: { type: Number, required: true },
  seatH: { type: Number, required: true },
  canvasWidth: { type: Number, required: true },
  canvasHeight: { type: Number, required: true },
})

const store = useGameCacheStore()

const playerData = computed(() => store.getPlayerData(props.playerId))
const seatState = computed(() => getSeatState(playerData.value))
const isTopSeat = computed(() => props.seatIndex >= 3 && props.seatIndex <= 7)

const visible = computed(() =>
  seatState.value === SEAT_STATE.ACTIVE || seatState.value === SEAT_STATE.AUTOFOLD
)

const cardWidth = computed(() => parseInt(props.canvasHeight * 8 / 100))
const cardHeight = computed(() => parseInt(props.canvasHeight * 13.7 / 100))

const card1X = computed(() => {
  const offset = isTopSeat.value
    ? props.seatX + props.seatW - cardWidth.value * 2 - parseInt(props.canvasHeight * 1 / 100)
    : props.seatX + props.seatW - cardWidth.value * 2 - parseInt(props.canvasHeight * 1 / 100)
  return offset
})

const card2X = computed(() => card1X.value + cardWidth.value + 2)

const card1Y = computed(() => {
  if (isTopSeat.value) {
    return props.seatY + parseInt(props.canvasHeight * 0.5 / 100)
  }
  return props.seatY + props.seatH - cardHeight.value - parseInt(props.canvasHeight * 0.5 / 100)
})

const card2Y = computed(() => card1Y.value)

const gv = computed(() => playerData.value?.gameValues)

const card1Value = computed(() => gv.value?.myCard1)
const card2Value = computed(() => gv.value?.myCard2)

const card1FaceUp = computed(() => card1Value.value != null && card1Value.value !== -1)
const card2FaceUp = computed(() => card2Value.value != null && card2Value.value !== -1)

const folded = computed(() => gv.value?.myAction === 1)
const card1Transparent = computed(() => folded.value)
const card2Transparent = computed(() => folded.value)
</script>
