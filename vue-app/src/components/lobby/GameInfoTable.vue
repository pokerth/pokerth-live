<template>
  <table class="w-full text-xs text-gray-300">
    <tr>
      <td class="text-right pr-2 whitespace-nowrap">Start cash:</td>
      <td class="font-bold">${{ gameInfo.startMoney }}</td>
      <td class="text-right pr-2 whitespace-nowrap">First small blind:</td>
      <td class="font-bold">${{ gameInfo.firstSmallBlind }}</td>
    </tr>
    <tr>
      <td class="text-right pr-2 whitespace-nowrap">Blinds raise interval:</td>
      <td class="font-bold">{{ blindsRaiseInterval }}</td>
      <td class="text-right pr-2 whitespace-nowrap">Blinds raise mode:</td>
      <td class="font-bold">{{ blindsRaiseMode }}</td>
    </tr>
  </table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  gameInfo: { type: Object, required: true }
})

const blindsRaiseInterval = computed(() => {
  const gi = props.gameInfo
  if (gi.raiseIntervalMode === 1) return `${gi.raiseEveryHands} hands`
  if (gi.raiseIntervalMode === 2) return `${gi.raiseEveryMinutes} minutes`
  return ''
})

const blindsRaiseMode = computed(() => {
  const gi = props.gameInfo
  if (!gi.manualBlinds || gi.manualBlinds.length === 0) return 'double blinds'
  return gi.manualBlinds.map(b => `$${b}`).join(', ')
})
</script>
