<template>
  <div class="relative inline-block">
    <canvas ref="canvas" class="block" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  width: { type: Number, default: 1024 },
  height: { type: Number, default: 600 },
  layerIndex: { type: Number, required: true },
})

const canvas = ref(null)

function getContext() {
  return canvas.value?.getContext('2d') || null
}

function clear() {
  const ctx = getContext()
  if (ctx) ctx.clearRect(0, 0, props.width, props.height)
}

onMounted(() => {
  if (canvas.value) {
    canvas.value.width = props.width
    canvas.value.height = props.height
  }
})

defineExpose({ getContext, clear, canvas })
</script>
