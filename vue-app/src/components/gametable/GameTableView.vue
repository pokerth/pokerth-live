<template>
  <div class="flex flex-col h-full bg-black">
    <!-- Game title -->
    <div class="px-4 py-1 bg-gray-900 text-white text-sm font-semibold truncate">
      {{ gameTitleName }}
    </div>

    <!-- Game area container -->
    <div ref="gameAreaContainer" class="flex-1 flex items-center justify-center overflow-hidden">
      <div
        ref="gameArea"
        class="relative"
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
      >
        <!-- Layer 1: Floor & Table (canvas) -->
        <canvas ref="canvasFloor" class="absolute inset-0" :width="canvasWidth" :height="canvasHeight" />

        <!-- Table cards -->
        <TableCards :canvas-width="canvasWidth" :canvas-height="canvasHeight" />

        <!-- Player seats -->
        <PlayerSeat
          v-for="(seat, idx) in seatPositions"
          :key="'seat-' + idx"
          :player-id="playerAtSeat(idx)"
          :seat-index="idx"
          :seat-x="seat.x"
          :seat-y="seat.y"
          :seat-w="seat.w"
          :seat-h="seat.h"
          :canvas-height="canvasHeight"
          :dealer-id="dealerId"
        />

        <!-- Hole cards per player -->
        <HoleCards
          v-for="(seat, idx) in seatPositions"
          :key="'cards-' + idx"
          :player-id="playerAtSeat(idx)"
          :seat-index="idx"
          :seat-x="seat.x"
          :seat-y="seat.y"
          :seat-w="seat.w"
          :seat-h="seat.h"
          :canvas-width="canvasWidth"
          :canvas-height="canvasHeight"
        />

        <!-- Active player glow -->
        <ActivePlayerGlow
          v-if="activeGlow"
          :x="activeGlow.x"
          :y="activeGlow.y"
          :size="activeGlow.size"
          :visible="true"
        />

        <!-- Winner labels -->
        <WinnerLabel
          v-for="(seat, idx) in seatPositions"
          :key="'winner-' + idx"
          :seat-x="seat.x"
          :seat-y="seat.y"
          :seat-index="idx"
          :canvas-height="canvasHeight"
          :visible="isWinner(playerAtSeat(idx))"
        />

        <!-- Money won labels -->
        <MoneyWonLabel
          v-for="(seat, idx) in seatPositions"
          :key="'money-' + idx"
          :money-won="moneyWonBy(playerAtSeat(idx))"
          :seat-x="seat.x"
          :seat-y="seat.y"
          :seat-index="idx"
          :canvas-height="canvasHeight"
          :visible="moneyWonBy(playerAtSeat(idx)) > 0"
        />

        <!-- Pot display -->
        <PotDisplay :canvas-width="canvasWidth" :canvas-height="canvasHeight" />

        <!-- Spectator label -->
        <SpectatorLabel :canvas-width="canvasWidth" :canvas-height="canvasHeight" />

        <!-- Settings popup -->
        <SettingsPopup @leave-game="onLeaveGame" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useGameCacheStore } from '@/stores'
import { leaveGame, on, off } from '@/services/netEventHandler'
import { computeSeats } from './seatLayout'
import PlayerSeat from './PlayerSeat.vue'
import HoleCards from './HoleCards.vue'
import TableCards from './TableCards.vue'
import ActivePlayerGlow from './ActivePlayerGlow.vue'
import WinnerLabel from './WinnerLabel.vue'
import MoneyWonLabel from './MoneyWonLabel.vue'
import PotDisplay from './PotDisplay.vue'
import SpectatorLabel from './SpectatorLabel.vue'
import SettingsPopup from './SettingsPopup.vue'

const store = useGameCacheStore()

const gameAreaContainer = ref(null)
const gameArea = ref(null)
const canvasFloor = ref(null)
const canvasWidth = ref(1024)
const canvasHeight = ref(600)

const ASPECT_RATIO = 1024 / 600

const ng = computed(() => store.netGame)

const gameTitleName = computed(() =>
  (ng.value?.gameData?.gameInfo?.gameName || '').replace(/<[^>]*>/g, '')
)

const dealerId = computed(() => ng.value?.hand?.dealerId || 0)

const seatPositions = computed(() => computeSeats(canvasWidth.value, canvasHeight.value))

function playerAtSeat(idx) {
  return ng.value?.gameData?.playerSeats?.[idx] || 0
}

const currentPlayerId = computed(() => ng.value?.hand?.currentPlayerId || 0)

const activeGlow = computed(() => {
  const pid = currentPlayerId.value
  if (!pid) return null
  const seats = ng.value?.gameData?.playerSeats
  if (!seats) return null
  const idx = seats.indexOf(pid)
  if (idx < 0) return null
  const seat = seatPositions.value[idx]
  if (!seat) return null
  const avatarSize = parseInt(canvasHeight.value * 8 / 100)
  const isTop = idx >= 3 && idx <= 7
  return {
    x: seat.x + parseInt(canvasHeight.value * 0.5 / 100) - 4,
    y: isTop
      ? seat.y + parseInt(canvasHeight.value * 0.5 / 100) - 4
      : seat.y + seat.h - avatarSize - parseInt(canvasHeight.value * 0.5 / 100) - 4,
    size: avatarSize + 8,
  }
})

function isWinner(playerId) {
  if (!playerId) return false
  const pd = store.getPlayerData(playerId)
  if (!pd?.gameValues) return false
  const gv = pd.gameValues
  return gv.moneyWon > 0 && gv.cardsValue === ng.value?.hand?.highestCardsValue
}

function moneyWonBy(playerId) {
  if (!playerId) return 0
  const pd = store.getPlayerData(playerId)
  return pd?.gameValues?.moneyWon || 0
}

function resize() {
  if (!gameAreaContainer.value) return
  const containerW = gameAreaContainer.value.clientWidth
  const containerH = gameAreaContainer.value.clientHeight
  let w = containerW
  let h = parseInt(w / ASPECT_RATIO)
  if (h > containerH) {
    h = containerH
    w = parseInt(h * ASPECT_RATIO)
  }
  // Minimum size
  if (w < 669) { w = 669; h = 392 }
  if (h < 392) { w = 669; h = 392 }
  canvasWidth.value = w
  canvasHeight.value = h
  nextTick(() => drawFloorAndTable())
}

function drawFloorAndTable() {
  const ctx = canvasFloor.value?.getContext('2d')
  if (!ctx) return
  const w = canvasWidth.value
  const h = canvasHeight.value

  // Floor
  const floorImg = new Image()
  floorImg.onload = () => {
    const ptrn = ctx.createPattern(floorImg, 'repeat')
    ctx.fillStyle = ptrn
    ctx.fillRect(0, 0, w, h)
    drawTable(ctx, w, h)
  }
  floorImg.src = '/gfx/gametable/floor.jpg'
}

function drawTable(ctx, w, h) {
  const tableColor = '#056F05'
  const leftCX = w * 25 / 100
  const centerY = h * 40 / 100
  const radius = h * 30 / 100
  const rectLeft = w * 25 / 100
  const rectTop = centerY - radius
  const rectRight = w * 75 / 100
  const rightCX = rectRight
  const rectBottom = centerY + radius
  const borderW = h * 4 / 100

  // Table fill
  ctx.beginPath()
  ctx.arc(leftCX, centerY, radius, Math.PI * 0.5, Math.PI * 1.5, false)
  ctx.rect(rectLeft, rectTop, rectRight - rectLeft, rectBottom - rectTop)
  ctx.arc(rightCX, centerY, radius, Math.PI * 1.5, Math.PI * 0.5, false)
  ctx.closePath()
  ctx.fillStyle = tableColor
  ctx.fill()

  // Gradients for lighting effect
  const gradients = [
    { cx: leftCX + w * 2 / 100, cy: centerY + centerY * 1 / 100, r: radius * 90 / 100, alpha: 0.12 },
    { cx: (leftCX + rightCX) / 2, cy: centerY, r: radius * 60 / 100, alpha: 0.08 },
    { cx: rightCX - w * 2 / 100, cy: centerY - centerY * 2 / 100, r: radius * 80 / 100, alpha: 0.10 },
  ]
  for (const g of gradients) {
    const grd = ctx.createRadialGradient(g.cx, g.cy, 1, g.cx, g.cy, g.r)
    grd.addColorStop(0, `rgba(255,255,255,${g.alpha})`)
    grd.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grd
    ctx.fill()
  }

  // Borders
  function drawBorder(lineWidth, color) {
    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.arc(leftCX, centerY, radius, Math.PI * 0.5, Math.PI * 1.5, false)
    ctx.moveTo(rectLeft, rectTop)
    ctx.lineTo(rectRight, rectTop)
    ctx.arc(rightCX, centerY, radius, Math.PI * 1.5, Math.PI * 0.5, false)
    ctx.moveTo(rectRight, rectBottom)
    ctx.lineTo(rectLeft, rectBottom)
    ctx.closePath()
    ctx.strokeStyle = color
    ctx.stroke()
  }
  drawBorder(borderW * 1.3, '#431907')
  drawBorder(borderW * 1.15, '#67270B')

  // Wood texture border
  const woodImg = new Image()
  woodImg.onload = () => {
    ctx.beginPath()
    ctx.lineWidth = borderW
    ctx.arc(leftCX, centerY, radius, Math.PI * 0.5, Math.PI * 1.5, false)
    ctx.moveTo(rectLeft, rectTop)
    ctx.lineTo(rectRight, rectTop)
    ctx.arc(rightCX, centerY, radius, Math.PI * 1.5, Math.PI * 0.5, false)
    ctx.moveTo(rectRight, rectBottom)
    ctx.lineTo(rectLeft, rectBottom)
    ctx.closePath()
    const ptrn = ctx.createPattern(woodImg, 'repeat')
    ctx.strokeStyle = ptrn
    ctx.stroke()
  }
  woodImg.src = '/gfx/gametable/wood-texture-small.jpg'
}

function onLeaveGame() {
  const gameId = ng.value?.gameData?.gameId
  if (gameId) leaveGame(gameId)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('orientationchange', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('orientationchange', resize)
})
</script>
