/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
/* Protocol enums - these mirror the protobuf definitions */

export const NetGameMode = {
  netGameCreated: 1,
  netGameStarted: 2,
  netGameClosed: 3,
}

export const NetGameState = {
  netStatePreflop: 0,
  netStateFlop: 1,
  netStateTurn: 2,
  netStateRiver: 3,
  netStatePreflopSmallBlind: 4,
  netStatePreflopBigBlind: 5,
}

export const NetPlayerAction = {
  netActionNone: 0,
  netActionFold: 1,
  netActionCheck: 2,
  netActionCall: 3,
  netActionBet: 4,
  netActionRaise: 5,
  netActionAllIn: 6,
}

export const NetPlayerState = {
  netPlayerStateNormal: 0,
  netPlayerStateSessionInactive: 1,
  netPlayerStateNoMoney: 2,
}

export const NetPlayerInfoRights = {
  netPlayerRightsGuest: 1,
  netPlayerRightsNormal: 2,
  netPlayerRightsAdmin: 3,
}

export const NetAvatarType = {
  netAvatarImagePng: 1,
  netAvatarImageJpg: 2,
  netAvatarImageGif: 3,
}

export const NetGameType = {
  normalGame: 1,
  registeredOnlyGame: 2,
  inviteOnlyGame: 3,
  rankingGame: 4,
}

export const RaiseIntervalMode = {
  raiseOnHandNum: 1,
  raiseOnMinutes: 2,
}

export const LoginType = {
  guestLogin: 0,
  authenticatedLogin: 1,
  unauthenticatedLogin: 2,
}

export const ServerType = {
  serverTypeLAN: 0,
  serverTypeInternetNoAuth: 1,
  serverTypeInternetAuth: 2,
}

export const PlayerListNotification = {
  playerListNew: 0,
  playerListLeft: 1,
}

export const JoinGameFailureReason = {
  invalidGame: 1,
  gameIsFull: 2,
  gameIsRunning: 3,
  invalidPassword: 4,
  notAllowedAsGuest: 5,
  notInvited: 6,
  gameNameInUse: 7,
  badGameName: 8,
  invalidSettings: 9,
  ipAddressBlocked: 10,
  rejoinFailed: 11,
  noSpectatorsAllowed: 12,
}

export const GamePlayerLeftReason = {
  leftOnRequest: 0,
  leftKicked: 1,
  leftError: 2,
}

export const RemovedFromGameReason = {
  removedOnRequest: 0,
  kickedFromGame: 1,
  gameIsFull: 2,
  gameIsRunning: 3,
  gameTimeout: 4,
  removedStartFailed: 5,
  gameClosed: 6,
}

export const ChatType = {
  chatTypeLobby: 0,
  chatTypeGame: 1,
  chatTypeBot: 2,
  chatTypeBroadcast: 3,
  chatTypePrivate: 4,
}

export const SubscriptionAction = {
  unsubscribeGameList: 1,
  resubscribeGameList: 2,
}

export const ErrorReason = {
  reserved: 0,
  initVersionNotSupported: 1,
  initServerFull: 2,
  initAuthFailure: 3,
  initPlayerNameInUse: 4,
  initInvalidPlayerName: 5,
  initServerMaintenance: 6,
  initBlocked: 7,
  avatarTooLarge: 8,
  invalidPacket: 9,
  invalidState: 10,
  kickedFromServer: 11,
  bannedFromServer: 12,
  blockedByServer: 13,
  sessionTimeout: 14,
}

export const ACTION_STRINGS = ['', 'Fold', 'Check', 'Call', 'Bet', 'Raise', 'All-In']
