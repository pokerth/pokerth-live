/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
/* NetEventHandler - WebSocket connection and message routing service.
 * This service bridges the PokerTH protobuf protocol with the Pinia stores.
 * It requires the global PokerTH protobuf definitions (loaded via third_party/protobuf.js).
 */

import {
  WEBSOCKET_URL,
  CLIENT_TYPE_QT_WIDGET,
  POKERTH_VERSION_MAJOR,
  POKERTH_VERSION_MINOR,
  POKERTH_VERSION_PATCH,
  NetGameMode,
  ServerType,
  LoginType,
  PlayerListNotification,
  JoinGameFailureReason,
  RemovedFromGameReason,
  ChatType,
  ErrorReason,
} from '@/constants'

let store = null
let websocket = null
let isOfficialServer = false
let localNickName = ''
let localPassword = ''
let localPlayerId = 0
const requestedPlayerIds = {}
let guiUpdateTimer = null
const guiUpdateTimeout = 2000
let router = null

// Event bus for game table signals
const listeners = {}

export function on(event, callback) {
  if (!listeners[event]) listeners[event] = []
  listeners[event].push(callback)
}

export function off(event, callback) {
  if (!listeners[event]) return
  listeners[event] = listeners[event].filter(cb => cb !== callback)
}

function emit(event, ...args) {
  if (listeners[event]) {
    listeners[event].forEach(cb => cb(...args))
  }
}

export function init(gameCacheStore, vueRouter) {
  store = gameCacheStore
  router = vueRouter
}

function sendMsg(msg) {
  if (websocket && websocket.readyState === 1) {
    const outArray = msg.SerializeToArray([])
    const outBuf = new ArrayBuffer(outArray.length)
    const outView = new Uint8Array(outBuf)
    for (let i = 0; i < outArray.length; i++) {
      outView[i] = outArray[i]
    }
    websocket.send(outBuf)
  }
}

function setGuestNickName() {
  let nickNum = '' + Math.floor(Math.random() * 99999 + 1)
  while (nickNum.length < 5) nickNum = '0' + nickNum
  localNickName = 'Guest' + nickNum
}

export function connect(nickName, password) {
  localNickName = nickName || ''
  localPassword = password || ''
  websocket = new WebSocket(WEBSOCKET_URL)
  websocket.binaryType = 'arraybuffer'
  websocket.onopen = onOpen
  websocket.onclose = onClose
  websocket.onmessage = onMessage
  websocket.onerror = onError
}

function onOpen() {
  // ready
}

function onClose() {
  store.connected = false
  store.nickName = ''
  store.gameTableActive = false
  store.lobbyActive = true
  store.showPopup('disconnect', 'Disconnected', 'Connection to server closed.', 'Close')
}

function onError(evt) {
  store.connected = false
  store.gameTableActive = false
  store.lobbyActive = true
  store.showPopup('error', 'Network Error', 'A network error occurred.', 'Close')
}

function onMessage(evt) {
  const rawBytes = new Uint8Array(evt.data)
  const recvMessage = new window.PokerTH.PokerTHMessage()
  recvMessage.ParseFromArray(rawBytes)
  const PT = window.PokerTH.PokerTHMessage.PokerTHMessageType

  switch (recvMessage.messageType) {
    case PT.Type_AnnounceMessage:
      handleMsgAnnounce(recvMessage.announceMessage); break
    case PT.Type_InitAckMessage:
      handleMsgInitAck(recvMessage.initAckMessage); break

    case PT.Type_GameListNewMessage:
      handleMsgGameListNew(recvMessage.gameListNewMessage); break
    case PT.Type_GameListUpdateMessage:
      handleMsgGameListUpdate(recvMessage.gameListUpdateMessage); break
    case PT.Type_GameListPlayerJoinedMessage:
      handleMsgGameListPlayerJoined(recvMessage.gameListPlayerJoinedMessage); break
    case PT.Type_GameListPlayerLeftMessage:
      handleMsgGameListPlayerLeft(recvMessage.gameListPlayerLeftMessage); break
    case PT.Type_GameListSpectatorJoinedMessage:
      handleMsgGameListSpectatorJoined(recvMessage.gameListSpectatorJoinedMessage); break
    case PT.Type_GameListSpectatorLeftMessage:
      handleMsgGameListSpectatorLeft(recvMessage.gameListSpectatorLeftMessage); break
    case PT.Type_PlayerListMessage:
      handleMsgPlayerList(recvMessage.playerListMessage); break
    case PT.Type_PlayerInfoReplyMessage:
      handleMsgPlayerInfoReply(recvMessage.playerInfoReplyMessage); break
    case PT.Type_JoinGameAckMessage:
      handleMsgJoinGameAck(recvMessage.joinGameAckMessage); break
    case PT.Type_JoinGameFailedMessage:
      handleMsgJoinGameFailed(recvMessage.joinGameFailedMessage); break
    case PT.Type_GamePlayerJoinedMessage:
      handleMsgGamePlayerJoined(recvMessage.gamePlayerJoinedMessage); break
    case PT.Type_GamePlayerLeftMessage:
      handleMsgGamePlayerLeft(recvMessage.gamePlayerLeftMessage); break
    case PT.Type_GameSpectatorJoinedMessage:
      handleMsgGameSpectatorJoined(recvMessage.gameSpectatorJoinedMessage); break
    case PT.Type_GameSpectatorLeftMessage:
      handleMsgGameSpectatorLeft(recvMessage.gameSpectatorLeftMessage); break
    case PT.Type_GameStartInitialMessage:
      handleMsgGameStartInitial(recvMessage.gameStartInitialMessage); break
    case PT.Type_GameStartRejoinMessage:
      handleMsgGameStartRejoin(recvMessage.gameStartRejoinMessage); break
    case PT.Type_HandStartMessage:
      handleMsgHandStart(recvMessage.handStartMessage); break
    case PT.Type_PlayersTurnMessage:
      handleMsgPlayersTurn(recvMessage.playersTurnMessage); break
    case PT.Type_PlayersActionDoneMessage:
      handleMsgPlayersActionDone(recvMessage.playersActionDoneMessage); break
    case PT.Type_DealFlopCardsMessage:
      handleMsgDealFlopCards(recvMessage.dealFlopCardsMessage); break
    case PT.Type_DealTurnCardMessage:
      handleMsgDealTurnCard(recvMessage.dealTurnCardMessage); break
    case PT.Type_DealRiverCardMessage:
      handleMsgDealRiverCard(recvMessage.dealRiverCardMessage); break
    case PT.Type_AllInShowCardsMessage:
      handleMsgAllInShowCards(recvMessage.allInShowCardsMessage); break
    case PT.Type_EndOfHandShowCardsMessage:
      handleMsgEndOfHandShowCards(recvMessage.endOfHandShowCardsMessage); break
    case PT.Type_EndOfHandHideCardsMessage:
      handleMsgEndOfHandHideCards(recvMessage.endOfHandHideCardsMessage); break
    case PT.Type_AfterHandShowCardsMessage:
      handleMsgAfterHandShowCards(recvMessage.afterHandShowCardsMessage); break
    case PT.Type_RemovedFromGameMessage:
      handleMsgRemovedFromGame(recvMessage.removedFromGameMessage); break
    case PT.Type_PlayerIdChangedMessage:
      handleMsgPlayerIdChanged(recvMessage.playerIdChangedMessage); break
    case PT.Type_ChatMessage:
      handleMsgChat(recvMessage.chatMessage); break
    case PT.Type_TimeoutWarningMessage:
      handleMsgTimeoutWarning(recvMessage.timeoutWarningMessage); break
    case PT.Type_ErrorMessage:
      handleMsgError(recvMessage.errorMessage); break
  }
}

// --- Auth handlers ---

function handleMsgAnnounce(announce) {
  const PT = window.PokerTH
  isOfficialServer = (announce.serverType === ServerType.serverTypeInternetAuth)

  const init = new PT.PokerTHMessage()
  init.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_InitMessage
  init.initMessage = new PT.InitMessage()
  init.initMessage.requestedVersion = new PT.AnnounceMessage.Version()
  init.initMessage.requestedVersion.majorVersion = announce.protocolVersion.majorVersion
  init.initMessage.requestedVersion.minorVersion = announce.protocolVersion.minorVersion
  init.initMessage.buildId =
    (CLIENT_TYPE_QT_WIDGET << 24) | (POKERTH_VERSION_MAJOR << 16) | (POKERTH_VERSION_MINOR << 8) | POKERTH_VERSION_PATCH

  if (!localNickName) {
    setGuestNickName()
    init.initMessage.nickName = localNickName
    init.initMessage.login = LoginType.guestLogin
  } else {
    init.initMessage.nickName = localNickName
    init.initMessage.authServerPassword = localPassword
    init.initMessage.login = localPassword
      ? LoginType.authenticatedLogin
      : LoginType.guestLogin
    localPassword = ''
  }
  sendMsg(init)
}

function handleMsgInitAck(initAck) {
  localPlayerId = initAck.yourPlayerId
  store.connected = true
  store.nickName = localNickName
  store.playerId = localPlayerId
  store.hidePopup()
  beginInitialLobbyUpdate()
}



// --- Lobby handlers ---

function handleMsgGameListNew(gameListNew) {
  markInitialLobbyUpdateMsg()
  if (isOfficialServer) {
    store.addGameData(gameListNew)
    const pids = gameListNew.playerIds || []
    for (let i = 0; i < pids.length; i++) {
      requestPlayerInfo(pids[i])
    }
  }
}

function handleMsgGameListUpdate(gameListUpdate) {
  if (gameListUpdate.gameMode === NetGameMode.netGameClosed) {
    store.removeGameData(gameListUpdate.gameId)
  } else {
    const gd = store.getGameData(gameListUpdate.gameId)
    if (gd) gd.gameMode = gameListUpdate.gameMode
  }
}

function handleMsgGameListPlayerJoined(msg) {
  const gd = store.getGameData(msg.gameId)
  if (gd) {
    if (!gd.playerIds) gd.playerIds = []
    gd.playerIds.push(msg.playerId)
  }
  requestPlayerInfo(msg.playerId)
}

function handleMsgGameListPlayerLeft(msg) {
  const gd = store.getGameData(msg.gameId)
  if (gd && gd.playerIds) {
    gd.playerIds = Array.isArray(gd.playerIds)
      ? gd.playerIds.filter(id => id !== msg.playerId)
      : []
  }
}

function handleMsgGameListSpectatorJoined(msg) {
  const gd = store.getGameData(msg.gameId)
  if (gd) {
    if (!gd.spectatorIds) gd.spectatorIds = []
    gd.spectatorIds.push(msg.playerId)
  }
  requestPlayerInfo(msg.playerId)
}

function handleMsgGameListSpectatorLeft(msg) {
  const gd = store.getGameData(msg.gameId)
  if (gd && gd.spectatorIds) {
    gd.spectatorIds = Array.isArray(gd.spectatorIds)
      ? gd.spectatorIds.filter(id => id !== msg.playerId)
      : []
  }
}

function handleMsgPlayerList(playerList) {
  if (playerList.playerListNotification === PlayerListNotification.playerListNew) {
    markInitialLobbyUpdateMsg()
    requestPlayerInfo(playerList.playerId)
  } else if (playerList.playerListNotification === PlayerListNotification.playerListLeft) {
    store.removePlayerData(playerList.playerId)
  }
}

function handleMsgPlayerInfoReply(playerInfoReply) {
  markInitialLobbyUpdateMsg()
  store.addPlayerData(playerInfoReply)
}

// --- Game join handlers ---

function handleMsgJoinGameAck(joinGameAck) {
  const gd = store.getGameData(joinGameAck.gameId)
  if (gd) {
    gd.playerSeats = []
    gd.spectatorSeats = [localPlayerId]
  }
  if (gd && gd.gameMode === NetGameMode.netGameStarted) {
    store.showPopup('wait', 'Waiting ...', 'Joined game as Spectator.<br>Please wait until <b>the next hand</b> starts ...', 'Cancel')
  } else {
    store.showPopup('wait', 'Waiting ...', 'Joined game as Spectator.<br>Please wait until <b>the game</b> starts ...', 'Cancel')
  }
  store.currentWaitingGameId = joinGameAck.gameId
}

function handleMsgJoinGameFailed(msg) {
  switch (msg.joinGameFailureReason) {
    case JoinGameFailureReason.invalidPassword:
      store.showPopup('error', 'Server Message', 'This game is private and does not allow spectators.'); break
    case JoinGameFailureReason.notInvited:
      store.showPopup('error', 'Server Message', 'This game is invite-only, you are not allowed to spectate.'); break
    default:
      store.showPopup('error', 'Server Message', 'It is not possible to spectate this game.'); break
  }
}

function handleMsgGamePlayerJoined(msg) {
  requestPlayerInfo(msg.playerId)
}

function handleMsgGamePlayerLeft(msg) {
  const pd = store.getPlayerData(msg.playerId)
  if (pd?.gameValues) pd.gameValues.stayOnTable = false
}

function handleMsgGameSpectatorJoined(msg) {
  const gd = store.getGameData(msg.gameId)
  if (gd) {
    if (!gd.spectatorSeats) gd.spectatorSeats = []
    gd.spectatorSeats.push(msg.playerId)
  }
  emit('spectatorChanged')
  requestPlayerInfo(msg.playerId)
}

function handleMsgGameSpectatorLeft(msg) {
  const gd = store.getGameData(msg.gameId)
  if (gd) {
    gd.spectatorSeats = gd.spectatorSeats.filter(id => id !== msg.playerId)
  }
  emit('spectatorChanged')
}

// --- Game start ---

function handleMsgGameStartInitial(gameStartInitial) {
  subscribeLobbyMessages(false)
  store.initializeGame(gameStartInitial, false)
  store.hidePopup()
  store.lobbyActive = false
  store.gameTableActive = true
  emit('gameStarted')
}

function handleMsgGameStartRejoin(gameStartRejoin) {
  subscribeLobbyMessages(false)
  store.initializeGame(gameStartRejoin, true)
  store.hidePopup()
  store.lobbyActive = false
  store.gameTableActive = true
  emit('gameStarted')
}

// --- Hand events ---

function handleMsgHandStart(handStart) {
  store.resetActions(true)
  store.initNewHand(handStart)
  store.startHand(handStart)
  emit('handStart')
}

function handleMsgPlayersTurn(playersTurn) {
  const ng = store.netGame
  if (!ng) return
  ng.hand.currentPlayerId = playersTurn.playerId
  if (ng.hand.round !== playersTurn.gameState) {
    store.collectSets()
    store.resetActions(false)
    ng.hand.round = playersTurn.gameState
  }
  emit('currentPlayerChanged')
}

function handleMsgPlayersActionDone(msg) {
  const pd = store.getPlayerData(msg.playerId)
  if (pd) {
    pd.gameValues.myAction = msg.playerAction
    pd.gameValues.mySet = msg.totalPlayerBet
    pd.gameValues.myCash = msg.playerMoney
  }
  const ng = store.netGame
  if (ng) {
    ng.hand.highestSet = msg.highestSet
    ng.hand.minimumRaise = msg.minimumRaise
  }
  emit('playersActionDone', msg.playerId)
}

// --- Card events ---

function handleMsgDealFlopCards(msg) {
  const ng = store.netGame
  if (!ng) return
  ng.hand.currentPlayerId = 0
  ng.hand.tableCards.push(msg.flopCard1, msg.flopCard2, msg.flopCard3)
  emit('currentPlayerChanged')
  emit('dealFlop')
}

function handleMsgDealTurnCard(msg) {
  const ng = store.netGame
  if (!ng) return
  ng.hand.currentPlayerId = 0
  store.resetActions(false)
  ng.hand.tableCards.push(msg.turnCard)
  emit('currentPlayerChanged')
  emit('dealTurn')
}

function handleMsgDealRiverCard(msg) {
  const ng = store.netGame
  if (!ng) return
  ng.hand.currentPlayerId = 0
  store.resetActions(false)
  ng.hand.tableCards.push(msg.riverCard)
  emit('currentPlayerChanged')
  emit('dealRiver')
}

function handleMsgAllInShowCards(msg) {
  const allIn = msg.playersAllIn || []
  for (let i = 0; i < allIn.length; i++) {
    const allInData = allIn[i]
    const pd = store.getPlayerData(allInData.playerId)
    if (pd) {
      pd.gameValues.myCard1 = allInData.allInCard1
      pd.gameValues.myCard2 = allInData.allInCard2
    }
    emit('showCards', allInData.playerId)
  }
}

function handleMsgEndOfHandShowCards(msg) {
  store.collectSets()
  const ng = store.netGame
  if (ng) ng.hand.currentPlayerId = 0
  emit('currentPlayerChanged')

  const results = msg.playerResults || []
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const hadCards = store.hasPlayerCards(result.playerId)
    store.setPlayerResult(result)
    if (ng) {
      if (result.cardsValue > ng.hand.highestCardsValue) {
        ng.hand.highestCardsValue = result.cardsValue
      }
    }
    if (!hadCards) {
      emit('showCards', result.playerId)
    }
  }
  emit('endOfHand')
}

function handleMsgEndOfHandHideCards(msg) {
  store.collectSets()
  const ng = store.netGame
  if (ng) ng.hand.currentPlayerId = 0
  emit('currentPlayerChanged')

  const pd = store.getPlayerData(msg.playerId)
  if (pd) {
    pd.gameValues.myCash = msg.playerMoney
    pd.gameValues.moneyWon = msg.moneyWon
  }
  emit('endOfHand')
}

function handleMsgAfterHandShowCards(msg) {
  store.setPlayerResult(msg.playerResult)
  emit('showCards', msg.playerResult.playerId)
}

function handleMsgRemovedFromGame(msg) {
  store.gameTableActive = false
  store.lobbyActive = true
  beginInitialLobbyUpdate()
  subscribeLobbyMessages(true)

  switch (msg.removedFromGameReason) {
    case RemovedFromGameReason.gameIsFull:
      store.showPopup('info', 'Server Message', 'This game already has the maximum number of spectators.'); break
    case RemovedFromGameReason.kickedFromGame:
      store.showPopup('info', 'Server Message', 'You were kicked from the game.'); break
    case RemovedFromGameReason.gameClosed:
      store.showPopup('info', 'Server Message', 'The game was closed.'); break
  }
  emit('removedFromGame')
}

function handleMsgPlayerIdChanged(msg) {
  const oldPd = store.getPlayerData(msg.oldPlayerId)
  let newPd = store.getPlayerData(msg.newPlayerId)
  if (!newPd) {
    newPd = { playerId: msg.newPlayerId }
    store.addPlayerData(newPd)
  }
  newPd.gameValues = oldPd?.gameValues
  if (newPd.gameValues) newPd.gameValues.stayOnTable = true
  store.changePlayerId(msg.oldPlayerId, msg.newPlayerId)
}

// --- Chat ---

function handleMsgChat(chat) {
  switch (chat.chatType) {
    case ChatType.chatTypeLobby:
      store.addChatMessage({ type: 'lobby', playerId: chat.playerId, text: chat.chatText }); break
    case ChatType.chatTypeBot:
      store.addChatMessage({ type: 'bot', text: chat.chatText }); break
    case ChatType.chatTypeBroadcast:
      store.addChatMessage({ type: 'global', text: chat.chatText }); break
    case ChatType.chatTypePrivate:
      store.addChatMessage({ type: 'private', playerId: chat.playerId, text: chat.chatText }); break
  }
}

// --- Timeout ---

function handleMsgTimeoutWarning(msg) {
  store.showPopup('timeout', 'Timeout Warning',
    `Your connection is about to time out due to inactivity in <span class="font-bold text-xl">${msg.remainingSeconds}</span> seconds.`,
    'OK')
}

// --- Error ---

function handleMsgError(error) {
  const reasons = {
    [ErrorReason.initVersionNotSupported]: 'This version of the PokerTH Webclient is not supported by the server.',
    [ErrorReason.initServerFull]: 'The server is full. Please try again later.',
    [ErrorReason.initAuthFailure]: 'Authentication failed.',
    [ErrorReason.initPlayerNameInUse]: 'Your player name is already in use.',
    [ErrorReason.initInvalidPlayerName]: 'Your player name is invalid.',
    [ErrorReason.initServerMaintenance]: 'The server is down for maintenance.',
    [ErrorReason.initBlocked]: 'Login is not possible at this moment. Please try again later.',
    [ErrorReason.avatarTooLarge]: 'Your avatar file is too large. Please choose a different avatar.',
    [ErrorReason.invalidPacket]: 'The server has received an invalid packet.',
    [ErrorReason.invalidState]: 'Invalid state.',
    [ErrorReason.kickedFromServer]: 'You were kicked from the server.',
    [ErrorReason.bannedFromServer]: 'You were banned from the server.',
    [ErrorReason.blockedByServer]: 'This account is blocked.',
    [ErrorReason.sessionTimeout]: 'Your session timed out. Feel free to come back!',
  }
  store.showPopup('error', 'Server Error', reasons[error.errorReason] || 'General error.', 'Close')
}

// --- Public API ---

export function spectateGame(gameId) {
  const PT = window.PokerTH
  const request = new PT.PokerTHMessage()
  request.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_JoinExistingGameMessage
  request.joinExistingGameMessage = new PT.JoinExistingGameMessage()
  request.joinExistingGameMessage.gameId = gameId
  request.joinExistingGameMessage.autoLeave = true
  request.joinExistingGameMessage.spectateOnly = true
  sendMsg(request)
}

export function leaveGame(gameId) {
  const PT = window.PokerTH
  const request = new PT.PokerTHMessage()
  request.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_LeaveGameRequestMessage
  request.leaveGameRequestMessage = new PT.LeaveGameRequestMessage()
  request.leaveGameRequestMessage.gameId = gameId
  sendMsg(request)

  store.gameTableActive = false
  store.lobbyActive = true
  store.clearLobby()
  // Reset player info request cache so they get re-requested
  for (const key of Object.keys(requestedPlayerIds)) delete requestedPlayerIds[key]
  beginInitialLobbyUpdate()
  subscribeLobbyMessages(true)
}

// Cancel spectate without clearing the lobby (used when cancelling the wait popup)
export function cancelSpectate(gameId) {
  const PT = window.PokerTH
  const request = new PT.PokerTHMessage()
  request.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_LeaveGameRequestMessage
  request.leaveGameRequestMessage = new PT.LeaveGameRequestMessage()
  request.leaveGameRequestMessage.gameId = gameId
  sendMsg(request)
}

export function resetServerTimeout() {
  const PT = window.PokerTH
  const request = new PT.PokerTHMessage()
  request.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_ResetTimeoutMessage
  request.resetTimeoutMessage = new PT.ResetTimeoutMessage()
  sendMsg(request)
  store.hidePopup()
}

function subscribeLobbyMessages(subscribe) {
  const PT = window.PokerTH
  const request = new PT.PokerTHMessage()
  request.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_SubscriptionRequestMessage
  request.subscriptionRequestMessage = new PT.SubscriptionRequestMessage()
  request.subscriptionRequestMessage.subscriptionAction = subscribe ? 2 : 1
  sendMsg(request)
}

function requestPlayerInfo(playerId) {
  if (!requestedPlayerIds[playerId]) {
    const PT = window.PokerTH
    const request = new PT.PokerTHMessage()
    request.messageType = PT.PokerTHMessage.PokerTHMessageType.Type_PlayerInfoRequestMessage
    request.playerInfoRequestMessage = new PT.PlayerInfoRequestMessage()
    request.playerInfoRequestMessage.playerId = [playerId]
    sendMsg(request)
    requestedPlayerIds[playerId] = 1
  }
}

function beginInitialLobbyUpdate() {
  store.showPopup('loading', 'Please wait', 'PokerTH-live is loading ...')
  guiUpdateTimer = window.setTimeout(endInitialLobbyUpdate, guiUpdateTimeout)
}

function markInitialLobbyUpdateMsg() {
  if (guiUpdateTimer !== null) {
    window.clearTimeout(guiUpdateTimer)
    guiUpdateTimer = window.setTimeout(endInitialLobbyUpdate, guiUpdateTimeout)
  }
}

function endInitialLobbyUpdate() {
  guiUpdateTimer = null
  store.hidePopup()
}
