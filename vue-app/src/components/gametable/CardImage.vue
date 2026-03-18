<template>
  <div class="absolute" :style="cardStyle">
    <div class="relative w-full h-full card-flip-container">
      <img
        :src="cardSrc"
        class="w-full h-full object-contain rounded-sm shadow-md"
        :class="{ 'opacity-50': transparent }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
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
  canvasHeight: { type: Number, default: 0 },
})

const flipping = ref(false)
const flipPhase = ref('idle') // 'idle' | 'shrink' | 'grow'
const pendingCardSrc = ref(null)

const baseSrc = computed(() => {
  if (props.faceUp && props.cardValue != null) return getCardSrcPath(props.cardValue, props.canvasHeight)
  return getCardSrcPath('flipside')
})

const cardSrc = ref(baseSrc.value)

watch(baseSrc, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc && oldSrc && oldSrc.includes('flipside') && !newSrc.includes('flipside')) {
    // Flip animation: flipside -> face
    flipPhase.value = 'shrink'
    pendingCardSrc.value = newSrc
    setTimeout(() => {
      cardSrc.value = pendingCardSrc.value
      flipPhase.value = 'grow'
      setTimeout(() => {
        flipPhase.value = 'idle'
      }, 300)
    }, 300)
  } else {
    cardSrc.value = newSrc
  }
}, { immediate: true })

const cardStyle = computed(() => ({
  left: props.x + 'px',
  top: props.y + 'px',
  width: props.width + 'px',
  height: props.height + 'px',
  zIndex: props.zIndex,
  display: props.visible ? 'block' : 'none',
  transition: 'left 0.6s ease, top 0.6s ease, opacity 0.3s ease',
}))
</script>

<style scoped>
.card-flip-container img {
  transition: transform 0.3s ease;
}
.card-flip-container img.flip-shrink {
  transform: scaleX(0);
}
</style>
