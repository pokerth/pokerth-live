<template>
  <div>
    <button
      class="absolute top-0 right-0 z-50 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded-bl"
      @click="showMenu = !showMenu"
    >
      ⚙ Settings
    </button>

    <div
      v-if="showMenu"
      class="absolute top-8 right-0 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 w-64 space-y-3"
    >
      <button
        class="w-full px-3 py-2 rounded bg-poker-border hover:bg-poker-border-light text-white text-sm"
        @click="goToLobby"
      >
        ← Back to the lobby
      </button>
      <label class="flex items-center gap-2 text-white text-sm cursor-pointer">
        <input type="checkbox" v-model="soundOn" class="accent-poker-gold" />
        Sound on
      </label>
      <button
        class="w-full px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs"
        @click="showMenu = false"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useConfigStore } from '@/stores'

const emit = defineEmits(['leaveGame'])

const config = useConfigStore()
const showMenu = ref(false)
const soundOn = ref(config.get('PlaySoundEvents', true))

watch(soundOn, (val) => {
  config.set('PlaySoundEvents', val)
})

function goToLobby() {
  showMenu.value = false
  emit('leaveGame')
}
</script>
