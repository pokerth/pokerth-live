<template>
  <div class="absolute" :style="{ left: x + 'px', top: y + 'px', zIndex: 9 }">
    <div class="rounded-full bg-red-600 opacity-40" :style="glowStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  size: { type: Number, required: true },
  visible: { type: Boolean, default: false },
})

const glowStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
  boxShadow: `0 0 ${props.size / 4}px ${props.size / 4}px rgba(255, 0, 0, 0.5)`,
}))
</script>
