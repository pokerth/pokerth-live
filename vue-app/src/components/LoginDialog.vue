<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div class="bg-pth-surface border border-pth-border rounded-lg shadow-xl w-full max-w-md">
      <div class="rounded-t-lg px-6 py-3" style="background: linear-gradient(to right, var(--pth-grad-start), var(--pth-grad-end));">
        <h1 class="text-white text-lg font-bold">Login</h1>
      </div>
      <div class="p-6 space-y-4">
        <!-- Guest-only mode: set GUEST_ONLY to false to show registered login -->
        <template v-if="!GUEST_ONLY">
          <div class="flex gap-4">
            <label class="flex items-center gap-2 text-pth-text cursor-pointer">
              <input type="radio" v-model="loginMode" value="guest" class="accent-pth-gold" />
              Guest
            </label>
            <label class="flex items-center gap-2 text-pth-text cursor-pointer">
              <input type="radio" v-model="loginMode" value="registered" class="accent-pth-gold" />
              Registered
            </label>
          </div>

          <div v-if="loginMode === 'registered'" class="space-y-3">
            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full px-3 py-2 rounded bg-pth-surface text-pth-text border border-pth-border focus:border-pth-gold focus:outline-none"
            />
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              autocomplete="off"
              class="w-full px-3 py-2 rounded bg-pth-surface text-pth-text border border-pth-border focus:border-pth-gold focus:outline-none"
              @keydown.enter="doLogin"
            />
          </div>
        </template>

        <p class="text-pth-muted text-sm italic">Login may take some time, please be patient ...</p>

        <div class="flex items-center gap-4">
          <button
            :disabled="connecting"
            class="px-6 py-2 rounded bg-pth-accent hover:bg-pth-accent-hover text-white font-semibold disabled:opacity-50"
            @click="doLogin"
          >
            Login
          </button>
        </div>

        <a
          v-if="!GUEST_ONLY"
          href="https://pokerth.net/ucp.php?mode=register"
          target="_blank"
          rel="noopener"
          class="block text-pth-accent text-sm hover:underline"
        >
          Create your PokerTH gaming account ...
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { connect } from '@/services/netEventHandler'
import { useGameCacheStore } from '@/stores'

defineProps({
  visible: { type: Boolean, default: true }
})

const emit = defineEmits(['loggedIn'])
const store = useGameCacheStore()

// Set to false to show Guest/Registered radio + username/password fields
const GUEST_ONLY = true

const loginMode = ref('guest')
const username = ref('')
const password = ref('')
const connecting = ref(false)

// Reset login button when connection fails (popup appears) or disconnects
watch(() => store.popup, (p) => {
  if (p && (p.type === 'disconnect' || p.type === 'error')) {
    connecting.value = false
  }
})

watch(() => store.connected, (val) => {
  if (!val) connecting.value = false
})

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
