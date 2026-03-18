<template>
  <div>
    <CardImage
      v-for="(card, idx) in tableCards"
      :key="idx"
      :card-value="card.value"
      :face-up="card.value != null"
      :x="card.x"
      :y="cardY"
      :width="cardWidth"
      :height="cardHeight"
      :visible="card.visible"
    />
    <!-- Card holder placeholders on canvas layer 5 -->
    <div
      v-for="(pos, idx) in holderPositions"
      :key="'holder-' + idx"
      class="absolute rounded border border-white/5 bg-white/5"
      :style="{
        left: pos + 'px',
        top: cardY + 'px',
        width: cardWidth + 'px',
        height: cardHeight + 'px',
        zIndex: 5,
      }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import CardImage from './CardImage.vue'

const props = defineProps({
  canvasWidth: { type: Number, required: true },
  canvasHeight: { type: Number, required: true },
})

const store = useGameCacheStore()

const midX = computed(() => props.canvasWidth * 50 / 100)
const midY = computed(() => props.canvasHeight * 40 / 100)
const cardWidth = computed(() => parseInt(props.canvasWidth * 5.3 / 100))
const cardHeight = computed(() => parseInt(props.canvasHeight * 13.7 / 100))
const cardY = computed(() => midY.value - cardHeight.value / 2)
const offset = computed(() => props.canvasWidth * 1 / 100)

const holderPositions = computed(() => {
  const cw = cardWidth.value
  const o = offset.value
  const mx = midX.value
  return [
    mx - 5 * (cw / 2) - 2 * o,  // flop1
    mx - 3 * (cw / 2) - o,       // flop2
    mx - cw / 2,                  // flop3
    mx + cw / 2 + o,             // turn
    mx + 3 * (cw / 2) + 2 * o,  // river
  ]
})

const tableCards = computed(() => {
  const ng = store.netGame
  const cards = ng?.hand?.tableCards || []
  return holderPositions.value.map((x, idx) => ({
    x,
    value: cards[idx] ?? null,
    visible: cards[idx] != null,
  }))
})
</script>
