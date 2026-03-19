<template>
  <div>
    <button
      class="absolute top-0 right-0 z-50 px-3 py-1 bg-pth-surface hover:bg-pth-surface-hover text-pth-text text-sm rounded-bl"
      @click="showMenu = !showMenu"
    >
      ⚙ Settings
    </button>

    <div
      v-if="showMenu"
      class="absolute top-8 right-0 z-50 bg-pth-elevated border border-pth-border-subtle rounded-lg shadow-xl p-4 w-64 space-y-3"
    >
      <button
        class="w-full px-3 py-2 rounded bg-pth-accent hover:bg-pth-accent-hover text-white text-sm"
        @click="goToLobby"
      >
        ← Back to the lobby
      </button>
      <label class="flex items-center gap-2 text-pth-text text-sm cursor-pointer">
        <input type="checkbox" v-model="soundOn" class="accent-pth-gold" />
        Sound on
      </label>
      <label class="flex items-center gap-2 text-pth-text text-sm cursor-pointer">
        <input type="checkbox" v-model="lightTheme" class="accent-pth-gold" />
        Light Theme
      </label>
      <button
        class="w-full px-3 py-1 rounded bg-pth-surface-alt hover:bg-pth-surface-hover text-pth-text-secondary text-xs"
        @click="showMenu = false"
      >
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useConfigStore } from '@/stores'

const emit = defineEmits(['leaveGame'])

const config = useConfigStore()
const showMenu = ref(false)
const soundOn = ref(config.get('PlaySoundEvents', true))
const lightTheme = ref(false)

onMounted(() => {
  lightTheme.value = localStorage.getItem('pth-theme') === 'light'
})

watch(soundOn, (val) => {
  config.set('PlaySoundEvents', val)
})

watch(lightTheme, (val) => {
  const theme = val ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('pth-theme', theme)
})

function goToLobby() {
  showMenu.value = false
  emit('leaveGame')
}
</script>
