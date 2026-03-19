<template>
  <div
    class="absolute"
    :style="positionStyle"
  >
    <div class="relative" :style="{ width: seatW + 'px', height: seatH + 'px' }">
      <!-- Avatar -->
      <img
        v-if="showSeat"
        :src="avatarUrl"
        :style="avatarStyle"
        class="absolute object-cover rounded"
        :class="{ 'opacity-40': dimmed }"
      />
      <!-- Nickname -->
      <span
        v-if="showSeat"
        class="absolute text-xs font-bold truncate"
        :class="{ 'opacity-40': dimmed }"
        :style="nickStyle"
        style="color: #fff; text-shadow: -1px 0 2px rgba(0,0,0,0.9), 1px 0 2px rgba(0,0,0,0.9), 0 -1px 2px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9);"
      >
        {{ nickName }}
      </span>
      <!-- Cash -->
      <span
        v-if="showCash"
        class="absolute text-xs font-bold"
        :class="{ 'opacity-40': dimmed }"
        :style="cashStyle"
        style="color: #00ff00; text-shadow: -1px 0 2px rgba(0,0,0,0.9), 1px 0 2px rgba(0,0,0,0.9), 0 -1px 2px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9);"
      >
        ${{ playerData?.gameValues?.myCash }}
      </span>
      <!-- Set (bet) -->
      <span
        v-if="showSet"
        class="absolute text-yellow-300 text-xs font-bold"
        :style="setStyle"
      >
        ${{ playerData?.gameValues?.mySet }}
      </span>
      <!-- Action label -->
      <span
        v-if="actionText"
        class="absolute text-2xl font-extrabold text-white drop-shadow-lg"
        :style="actionStyle"
        style="text-shadow: -2px 0 4px rgba(0,0,0,0.8), 2px 0 4px rgba(0,0,0,0.8), 0 -2px 4px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.8);"
      >
        {{ actionText }}
      </span>
      <!-- Dealer button -->
      <DealerButton v-if="isDealer" :seat-index="seatIndex" :seat-w="seatW" :seat-h="seatH" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameCacheStore } from '@/stores'
import { AVATAR_SERVER_URL } from '@/constants'
import { getSeatState, SEAT_STATE, ACTION_STRINGS } from './seatLayout'
import DealerButton from './DealerButton.vue'

const props = defineProps({
  playerId: { type: Number, required: true },
  seatIndex: { type: Number, required: true },
  seatX: { type: Number, required: true },
  seatY: { type: Number, required: true },
  seatW: { type: Number, required: true },
  seatH: { type: Number, required: true },
  canvasHeight: { type: Number, required: true },
  dealerId: { type: Number, default: 0 },
})

const store = useGameCacheStore()

const playerData = computed(() => store.getPlayerData(props.playerId))
const seatState = computed(() => getSeatState(playerData.value))
const showSeat = computed(() => seatState.value !== SEAT_STATE.CLEAR)
const dimmed = computed(() =>
  seatState.value === SEAT_STATE.AUTOFOLD || seatState.value === SEAT_STATE.STAYONTABLE
)
const isDealer = computed(() => props.dealerId === props.playerId)
const isTopSeat = computed(() => props.seatIndex >= 3 && props.seatIndex <= 7)

const avatarUrl = computed(() => {
  const fn = playerData.value?.avatarFileName
  if (fn) return AVATAR_SERVER_URL + fn
  return 'gfx/pokerth.png'
})

const nickName = computed(() =>
  playerData.value?.playerInfoData?.playerName || `${props.playerId}`
)

const actionText = computed(() => {
  const action = playerData.value?.gameValues?.myAction || 0
  return ACTION_STRINGS[action] || ''
})

const showCash = computed(() =>
  showSeat.value && seatState.value !== SEAT_STATE.STAYONTABLE &&
  playerData.value?.gameValues?.myCash != null
)

const showSet = computed(() => {
  const s = playerData.value?.gameValues?.mySet
  return s != null && s !== 0
})

const positionStyle = computed(() => ({
  left: props.seatX + 'px',
  top: props.seatY + 'px',
  zIndex: 8,
}))

const avatarSize = computed(() => parseInt(props.canvasHeight * 8 / 100))

const avatarStyle = computed(() => {
  const s = avatarSize.value
  const topOffset = isTopSeat.value
    ? parseInt(props.canvasHeight * 0.5 / 100)
    : props.seatH - s - parseInt(props.canvasHeight * 0.5 / 100)
  return {
    width: s + 'px',
    height: s + 'px',
    left: parseInt(props.canvasHeight * 0.5 / 100) + 'px',
    top: topOffset + 'px',
  }
})

const nickStyle = computed(() => {
  const topOffset = isTopSeat.value ? 17 : 0
  return {
    left: parseInt(props.canvasHeight * 9.3 / 100) + 'px',
    bottom: parseInt(props.canvasHeight * (0.1 + topOffset) / 100) + 'px',
    fontSize: parseInt(props.canvasHeight * 2.3 / 100) + 'px',
    maxWidth: (props.seatW - parseInt(props.canvasHeight * 10 / 100)) + 'px',
  }
})

const cashStyle = computed(() => {
  const topOffset = isTopSeat.value ? 12 : 0
  return {
    left: parseInt(props.canvasHeight * 9.3 / 100) + 'px',
    bottom: parseInt(props.canvasHeight * (2.5 + topOffset) / 100) + 'px',
    fontSize: parseInt(props.canvasHeight * 2.3 / 100) + 'px',
  }
})

const setStyle = computed(() => {
  const topOffset = isTopSeat.value ? 21 : 0
  return {
    left: parseInt(props.canvasHeight * 14 / 100) + 'px',
    top: parseInt(props.canvasHeight * (1 + topOffset) / 100) - parseInt(props.canvasHeight * 2 / 100) + 'px',
    fontSize: parseInt(props.canvasHeight * 2.3 / 100) + 'px',
  }
})

const actionStyle = computed(() => {
  const topOffset = isTopSeat.value ? 5 : 0
  return {
    left: '50%',
    transform: 'translateX(-50%)',
    top: parseInt(props.canvasHeight * (10.2 + topOffset) / 100) + 'px',
    fontSize: parseInt(props.canvasHeight * 3.2 / 100) + 'px',
  }
})
</script>
