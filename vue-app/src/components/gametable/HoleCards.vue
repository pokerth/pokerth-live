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
      :canvas-height="canvasHeight"
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
      :canvas-height="canvasHeight"
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

const cardWidth = computed(() => parseInt(props.canvasWidth * 4.7 / 100))
const cardHeight = computed(() => parseInt(props.canvasHeight * 12.67 / 100))

const cardAOffsetX = computed(() => parseInt(props.canvasHeight * 10.8 / 100))
const cardBOffsetX = computed(() => parseInt(props.canvasHeight * 15 / 100))

const card1X = computed(() => parseInt(props.seatX + cardAOffsetX.value))
const card2X = computed(() => parseInt(props.seatX + cardBOffsetX.value))

const cardOffsetY = computed(() => {
  if (isTopSeat.value) return parseInt(props.canvasHeight * 6.4 / 100)
  return parseInt(props.canvasHeight * 1.4 / 100)
})

const card1Y = computed(() => parseInt(props.seatY + cardOffsetY.value))
const card2Y = computed(() => card1Y.value)

const gv = computed(() => playerData.value?.gameValues)

const card1Value = computed(() => gv.value?.myCard1)
const card2Value = computed(() => gv.value?.myCard2)

// Cards are face up only when player has been dealt real cards (not both 0/equal)
const hasCards = computed(() => card1Value.value !== card2Value.value)
const card1FaceUp = computed(() => hasCards.value && card1Value.value != null)
const card2FaceUp = computed(() => hasCards.value && card2Value.value != null)

const folded = computed(() => gv.value?.myAction === 1)
const card1Transparent = computed(() => folded.value)
const card2Transparent = computed(() => folded.value)
</script>
