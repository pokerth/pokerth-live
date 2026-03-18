<template>
  <div class="absolute transition-all duration-500" :style="cardStyle">
    <img
      :src="cardSrc"
      class="w-full h-full object-contain"
      :class="{ 'opacity-50': transparent }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCardSrcPath } from './cardUtils'

const props = defineProps({
  cardValue: { type: [Number, String, null], default: null },
  faceUp: { type: Boolean, default: false },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  width: { type: Number, default: 50 },
  height: { type: Number, default: 70 },
  visible: { type: Boolean, default: true },
  transparent: { type: Boolean, default: false },
  zIndex: { type: Number, default: 6 },
})

const cardSrc = computed(() => {
  if (props.faceUp && props.cardValue != null) return getCardSrcPath(props.cardValue)
  return getCardSrcPath('flipside')
})

const cardStyle = computed(() => ({
  left: props.x + 'px',
  top: props.y + 'px',
  width: props.width + 'px',
  height: props.height + 'px',
  zIndex: props.zIndex,
  display: props.visible ? 'block' : 'none',
}))
</script>
