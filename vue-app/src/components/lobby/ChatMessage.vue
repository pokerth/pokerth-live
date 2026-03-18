<template>
  <div class="p-3 text-sm">
    <span v-if="type === 'lobby'" class="text-white">
      <b>{{ senderName }}:</b> {{ sanitizedText }}
    </span>
    <span v-else-if="type === 'private'" class="italic text-gray-300">
      {{ senderName }}(pm): {{ sanitizedText }}
    </span>
    <span v-else-if="type === 'global'" class="font-bold text-white">
      (global notice) {{ sanitizedText }}
    </span>
    <span v-else-if="type === 'bot'" class="text-red-400">
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
