import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { NetAvatarType } from '@/constants'

function convertBytesToHexString(bytesArray) {
  const hexArray = []
  for (let pos = 0; pos < bytesArray.length; pos++) {
    hexArray.push((bytesArray[pos] >>> 4).toString(16))
    hexArray.push((bytesArray[pos] & 0x0f).toString(16))
  }
  return hexArray.join('')
}

function convertAvatarTypeToString(avatarType) {
  switch (avatarType) {
    case NetAvatarType.netAvatarImagePng: return '.png'
    case NetAvatarType.netAvatarImageJpg: return '.jpg'
    case NetAvatarType.netAvatarImageGif: return '.gif'
    default: return ''
  }
}

function buildAvatarFileName(playerInfoData) {
  if (!playerInfoData?.avatarData) return ''
  const { avatarHash, avatarType } = playerInfoData.avatarData
  return convertBytesToHexString(avatarHash) + convertAvatarTypeToString(avatarType)
}

export const useGameCacheStore = defineStore('gameCache', () => {
  // Helper: convert protobuf repeated fields to real JS arrays
  function toArray(val) {
    if (!val) return []
    if (Array.isArray(val)) return val
    const arr = []
    for (let i = 0; i < val.length; i++) arr.push(val[i])
    return arr
  }

  // --- Game data ---
  const gameDataMap = reactive({})
  // --- Player data ---
  const playerDataMap = reactive({})
  // --- Current active game ---
  const netGame = ref(null)
  // --- Connection state ---
  const connected = ref(false)
  const nickName = ref('')
  const playerId = ref(0)
  // --- UI state ---
  const lobbyActive = ref(true)
  const gameTableActive = ref(false)
  const currentView = ref('gamelist') // 'gamelist' | 'playerlist' | 'chat'
  const currentWaitingGameId = ref(0)
  // --- Chat messages ---
  const chatMessages = ref([])
  // --- Popups ---
  const popup = ref(null) // { type, title, message, buttonText }

  // --- Game data methods ---
  function addGameData(data) {
    // Extract into plain JS object — protobuf objects don't play well
    // with Vue reactivity and property mutation
    gameDataMap[data.gameId] = {
      gameId: data.gameId,
      gameMode: data.gameMode,
      isPrivate: data.isPrivate,
      adminPlayerId: data.adminPlayerId,
      gameInfo: {
        gameName: data.gameInfo?.gameName,
        netGameType: data.gameInfo?.netGameType,
        maxNumPlayers: data.gameInfo?.maxNumPlayers,
        raiseIntervalMode: data.gameInfo?.raiseIntervalMode,
        raiseEveryHands: data.gameInfo?.raiseEveryHands,
        raiseEveryMinutes: data.gameInfo?.raiseEveryMinutes,
        endRaiseMode: data.gameInfo?.endRaiseMode,
        endRaiseSmallBlindValue: data.gameInfo?.endRaiseSmallBlindValue,
        proposedGuiSpeed: data.gameInfo?.proposedGuiSpeed,
        delayBetweenHands: data.gameInfo?.delayBetweenHands,
        playerActionTimeout: data.gameInfo?.playerActionTimeout,
        firstSmallBlind: data.gameInfo?.firstSmallBlind,
        startMoney: data.gameInfo?.startMoney,
        allowSpectators: data.gameInfo?.allowSpectators,
      },
      playerIds: toArray(data.playerIds),
      spectatorIds: toArray(data.spectatorIds),
      playerSeats: [],
      spectatorSeats: [],
    }
  }

  function getGameData(gameId) {
    return gameDataMap[gameId]
  }

  function removeGameData(gameId) {
    delete gameDataMap[gameId]
  }

  // --- Player data methods ---
  function addPlayerData(data) {
    const existing = playerDataMap[data.playerId]
    // Extract playerInfoData from protobuf to plain object
    const pInfo = data.playerInfoData ? {
      playerName: data.playerInfoData.playerName,
      isHuman: data.playerInfoData.isHuman,
      playerRights: data.playerInfoData.playerRights,
      countryCode: data.playerInfoData.countryCode,
      avatarData: data.playerInfoData.avatarData ? {
        avatarType: data.playerInfoData.avatarData.avatarType,
        avatarHash: data.playerInfoData.avatarData.avatarHash,
      } : null,
    } : existing?.playerInfoData || null
    const avatarFileName = pInfo?.avatarData
      ? buildAvatarFileName({ avatarData: pInfo.avatarData })
      : (existing?.avatarFileName || '')
    playerDataMap[data.playerId] = {
      playerId: data.playerId,
      playerInfoData: pInfo,
      avatarFileName,
      gameValues: existing?.gameValues || null,
    }
  }

  function getPlayerData(pid) {
    return playerDataMap[pid]
  }

  function hasPlayerData(pid) {
    return pid in playerDataMap && playerDataMap[pid]?.playerInfoData !== undefined
  }

  function hasPlayerCards(pid) {
    const pd = playerDataMap[pid]
    return pd?.gameValues?.myCard1 !== pd?.gameValues?.myCard2
  }

  function setPlayerResult(playerResult) {
    const pd = playerDataMap[playerResult.playerId]
    if (!pd) return
    pd.gameValues.myCard1 = playerResult.resultCard1
    pd.gameValues.myCard2 = playerResult.resultCard2
    pd.gameValues.myCash = playerResult.playerMoney
    pd.gameValues.moneyWon = playerResult.moneyWon
    pd.gameValues.bestHandPosition = toArray(playerResult.bestHandPosition)
    pd.gameValues.cardsValue = playerResult.cardsValue
  }

  // --- NetGame methods ---
  function initializeGame(gameStartInitial, joinExisting) {
    const gameData = gameDataMap[gameStartInitial.gameId]
    gameData.playerSeats = []

    const numSeats = joinExisting
      ? gameStartInitial.rejoinPlayerData.length
      : gameStartInitial.playerSeats.length

    for (let seatPos = 0; seatPos < numSeats; seatPos++) {
      let tmpPlayerId, tmpStartMoney
      if (joinExisting) {
        tmpPlayerId = gameStartInitial.rejoinPlayerData[seatPos].playerId
        tmpStartMoney = gameStartInitial.rejoinPlayerData[seatPos].playerMoney
      } else {
        tmpPlayerId = gameStartInitial.playerSeats[seatPos]
        tmpStartMoney = gameData.gameInfo.startMoney
      }
      gameData.playerSeats[seatPos] = tmpPlayerId

      if (!playerDataMap[tmpPlayerId]) {
        playerDataMap[tmpPlayerId] = { playerId: tmpPlayerId }
      }
      playerDataMap[tmpPlayerId].gameValues = {
        myCash: tmpStartMoney,
        mySet: 0,
        myTotalBet: 0,
        myAction: 0,
        myCard1: 0,
        myCard2: 0,
        moneyWon: 0,
        bestHandPosition: [],
        cardsValue: 0,
        active: true,
        stayOnTable: true,
        sessionActive: true,
      }
    }

    const hand = {
      num: joinExisting ? gameStartInitial.handNum : 0,
      pot: 0,
      smallBlind: 0,
      dealerId: 0,
      currentPlayerId: 0,
      highestSet: 0,
      minimumRaise: 0,
      round: 0,
      tableCards: [],
      highestCardsValue: 0,
    }

    netGame.value = {
      gameData,
      hand,
    }
  }

  function resetActions(resetAll) {
    if (!netGame.value) return
    const seats = netGame.value.gameData.playerSeats
    for (const pid of seats) {
      const pd = playerDataMap[pid]
      if (!pd?.gameValues) continue
      if (resetAll || (pd.gameValues.myAction !== 1 && pd.gameValues.myAction !== 6)) {
        pd.gameValues.myAction = 0
      }
    }
  }

  function collectSets() {
    if (!netGame.value) return
    let pot = 0
    const seats = netGame.value.gameData.playerSeats
    for (const pid of seats) {
      const pd = playerDataMap[pid]
      if (!pd?.gameValues) continue
      pd.gameValues.myTotalBet += pd.gameValues.mySet
      pd.gameValues.mySet = 0
      pot += pd.gameValues.myTotalBet
    }
    netGame.value.hand.pot = pot
  }

  function initNewHand(handStart) {
    if (!netGame.value) return
    const seats = netGame.value.gameData.playerSeats
    for (let seatPos = 0; seatPos < seats.length; seatPos++) {
      const pd = playerDataMap[seats[seatPos]]
      if (!pd?.gameValues) continue
      pd.gameValues.myTotalBet = 0
      pd.gameValues.mySet = 0
      pd.gameValues.moneyWon = 0
      pd.gameValues.myCard1 = 0
      pd.gameValues.myCard2 = 0
      pd.gameValues.bestHandPosition = []
      pd.gameValues.cardsValue = 0
      pd.gameValues.active = pd.gameValues.myCash > 0
      switch (handStart.seatStates[seatPos]) {
        case 0: // netPlayerStateNormal
          pd.gameValues.sessionActive = true
          break
        case 1: // netPlayerStateSessionInactive
          pd.gameValues.sessionActive = false
          break
        case 2: // netPlayerStateNoMoney
          pd.gameValues.myCash = 0
          break
      }
    }
  }

  function startHand(handStart) {
    if (!netGame.value) return
    const h = netGame.value.hand
    h.num++
    h.pot = 0
    h.smallBlind = handStart.smallBlind
    h.dealerId = handStart.dealerPlayerId
    h.currentPlayerId = 0
    h.highestSet = 0
    h.minimumRaise = 0
    h.round = 0
    h.tableCards = []
    h.highestCardsValue = 0
  }

  function changePlayerId(oldId, newId) {
    if (!netGame.value) return
    const seats = netGame.value.gameData.playerSeats
    for (let i = 0; i < seats.length; i++) {
      if (seats[i] === oldId) seats[i] = newId
    }
    if (netGame.value.hand.currentPlayerId === oldId) {
      netGame.value.hand.currentPlayerId = newId
    }
    if (netGame.value.hand.dealerId === oldId) {
      netGame.value.hand.dealerId = newId
    }
  }

  // --- Chat ---
  function addChatMessage(msg) {
    chatMessages.value.push(msg)
  }

  // --- Popup ---
  function showPopup(type, title, message, buttonText = 'Close') {
    popup.value = { type, title, message, buttonText }
  }

  function hidePopup() {
    popup.value = null
  }

  // --- Game list computed ---
  const gameList = computed(() => Object.values(gameDataMap))
  const playerList = computed(() => Object.values(playerDataMap).filter(p => p.playerInfoData))

  function clearLobby() {
    for (const key of Object.keys(gameDataMap)) delete gameDataMap[key]
    chatMessages.value = []
  }

  return {
    // State
    gameDataMap,
    playerDataMap,
    netGame,
    connected,
    nickName,
    playerId,
    lobbyActive,
    gameTableActive,
    currentView,
    currentWaitingGameId,
    chatMessages,
    popup,
    // Computed
    gameList,
    playerList,
    // Game data
    addGameData,
    getGameData,
    removeGameData,
    // Player data
    addPlayerData,
    getPlayerData,
    hasPlayerData,
    hasPlayerCards,
    setPlayerResult,
    // Net game
    initializeGame,
    resetActions,
    collectSets,
    initNewHand,
    startHand,
    changePlayerId,
    // Chat
    addChatMessage,
    // Popup
    showPopup,
    hidePopup,
    // Lobby
    clearLobby,
  }
})
