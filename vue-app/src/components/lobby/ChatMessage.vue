<template>
  <div class="p-3 text-sm">
    <span v-if="type === 'lobby'" class="text-pth-text">
      <b>{{ senderName }}:</b> {{ sanitizedText }}
    </span>
    <span v-else-if="type === 'private'" class="italic text-pth-text-secondary">
      {{ senderName }}(pm): {{ sanitizedText }}
    </span>
    <span v-else-if="type === 'global'" class="font-bold text-pth-text">
      (global notice) {{ sanitizedText }}
    </span>
    <span v-else-if="type === 'bot'" class="text-pth-text-danger">
      (chat bot) {{ sanitizedText }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'

const props = defineProps({
  type: { type: String, required: true },
  playerId: { type: Number, default: 0 },
  text: { type: String, default: '' }
})

const store = useGameCacheStore()

const senderName = computed(() => {
  if (!props.playerId) return ''
  const pd = store.getPlayerData(props.playerId)
  return pd?.playerInfoData?.playerName || `id${props.playerId}`
})

const sanitizedText = computed(() => props.text.replace(/<[^>]*>/g, ''))
</script>
