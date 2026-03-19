import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const defaults = {
    PlaySoundEvents: true,
  }

  function get(key) {
    try {
      const value = localStorage.getItem(key)
      if (value !== null) {
        return JSON.parse(value)
      }
    } catch {
      // ignore parse errors
    }
    return defaults[key]
  }

  function set(key, value) {
    if (value === defaults[key]) {
      localStorage.removeItem(key)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }

  const playSoundEvents = ref(get('PlaySoundEvents'))

  function setPlaySoundEvents(value) {
    playSoundEvents.value = value
    set('PlaySoundEvents', value)
  }

  return {
    playSoundEvents,
    setPlaySoundEvents,
    get,
    set,
  }
})
