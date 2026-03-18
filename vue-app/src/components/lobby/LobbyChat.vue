<template>
  <div class="flex flex-col h-full">
    <div ref="chatArea" class="flex-1 overflow-y-auto bg-pth-elevated rounded">
      <ChatMessage
        v-for="(msg, idx) in messages"
        :key="idx"
        :type="msg.type"
        :player-id="msg.playerId"
        :text="msg.text"
      />
      <div v-if="messages.length === 0" class="p-4 text-pth-dimmed text-sm italic">
        No messages yet.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, nextTick } from 'vue'
import { useGameCacheStore } from '@/stores'
import ChatMessage from './ChatMessage.vue'

const store = useGameCacheStore()
const chatArea = ref(null)

const messages = computed(() => store.chatMessages)

watch(messages, async () => {
  await nextTick()
  if (chatArea.value) {
    chatArea.value.scrollTop = chatArea.value.scrollHeight
  }
}, { deep: true })
</script>
