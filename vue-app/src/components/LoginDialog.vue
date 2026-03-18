<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div class="bg-poker-dark border border-poker-border rounded-lg shadow-xl w-full max-w-md">
      <div class="bg-poker-border rounded-t-lg px-6 py-3">
        <h1 class="text-white text-lg font-bold">Login</h1>
      </div>
      <div class="p-6 space-y-4">
        <div class="flex gap-4">
          <label class="flex items-center gap-2 text-white cursor-pointer">
            <input type="radio" v-model="loginMode" value="guest" class="accent-poker-gold" />
            Guest
          </label>
          <label class="flex items-center gap-2 text-white cursor-pointer">
            <input type="radio" v-model="loginMode" value="registered" class="accent-poker-gold" />
            Registered
          </label>
        </div>

        <div v-if="loginMode === 'registered'" class="space-y-3">
          <input
            v-model="username"
            type="text"
            placeholder="Username"
            class="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-poker-gold focus:outline-none"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            autocomplete="off"
            class="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:border-poker-gold focus:outline-none"
            @keydown.enter="doLogin"
          />
        </div>

        <p class="text-gray-400 text-sm italic">Login may take some time, please be patient ...</p>

        <div class="flex items-center gap-4">
          <button
            :disabled="connecting"
            class="px-6 py-2 rounded bg-poker-border hover:bg-poker-border-light text-white font-semibold disabled:opacity-50"
            @click="doLogin"
          >
            Login
          </button>
        </div>

        <a
          href="https://pokerth.net/ucp.php?mode=register"
          target="_blank"
          rel="noopener"
          class="block text-poker-gold text-sm hover:underline"
        >
          Create your PokerTH gaming account ...
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { connect } from '@/services/netEventHandler'

defineProps({
  visible: { type: Boolean, default: true }
})

const emit = defineEmits(['loggedIn'])

const loginMode = ref('guest')
const username = ref('')
const password = ref('')
const connecting = ref(false)

function doLogin() {
  if (connecting.value) return
  connecting.value = true
  if (loginMode.value === 'registered' && username.value) {
    connect(username.value, password.value)
  } else {
    connect()
  }
  // NetEventHandler will update store.connected and emit events
}
</script>
