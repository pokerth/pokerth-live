<template>
  <div class="flex flex-col h-full bg-poker-dark">
    <LobbyStatusBar />
    <LobbyTabs v-model:active-tab="activeTab" class="px-4 pt-3" />
    <div class="flex-1 overflow-hidden px-4 py-3">
      <GameList
        v-show="activeTab === 'games'"
        @spectate="onSpectate"
      />
      <PlayerList
        v-show="activeTab === 'players'"
        @spectate="onSpectate"
      />
      <LobbyChat
        v-show="activeTab === 'chat'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LobbyStatusBar from './LobbyStatusBar.vue'
import LobbyTabs from './LobbyTabs.vue'
import GameList from './GameList.vue'
import PlayerList from './PlayerList.vue'
import LobbyChat from './LobbyChat.vue'
import { spectateGame } from '@/services/netEventHandler'

const activeTab = ref('games')

function onSpectate(gameId) {
  spectateGame(gameId)
}
</script>
