/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
"use strict";
/** @suppress {duplicate}*/var PokerTH;
if (typeof(PokerTH)=="undefined") {PokerTH = {};}

PokerTH.NetGameMode= PROTO.Enum("PokerTH.NetGameMode",{
		netGameCreated :1,
		netGameStarted :2,
		netGameClosed :3});
PokerTH.NetGameState= PROTO.Enum("PokerTH.NetGameState",{
		netStatePreflop :0,
		netStateFlop :1,
		netStateTurn :2,
		netStateRiver :3,
		netStatePreflopSmallBlind :4,
		netStatePreflopBigBlind :5});
PokerTH.NetPlayerAction= PROTO.Enum("PokerTH.NetPlayerAction",{
		netActionNone :0,
		netActionFold :1,
		netActionCheck :2,
		netActionCall :3,
		netActionBet :4,
		netActionRaise :5,
		netActionAllIn :6});
PokerTH.NetPlayerState= PROTO.Enum("PokerTH.NetPlayerState",{
		netPlayerStateNormal :0,
		netPlayerStateSessionInactive :1,
		netPlayerStateNoMoney :2});
PokerTH.NetPlayerInfoRights= PROTO.Enum("PokerTH.NetPlayerInfoRights",{
		netPlayerRightsGuest :1,
		netPlayerRightsNormal :2,
		netPlayerRightsAdmin :3});
PokerTH.NetAvatarType= PROTO.Enum("PokerTH.NetAvatarType",{
		netAvatarImagePng :1,
		netAvatarImageJpg :2,
		netAvatarImageGif :3});
PokerTH.NetGameInfo = PROTO.Message("PokerTH.NetGameInfo",{
	gameName: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 1
	},
	NetGameType: PROTO.Enum("PokerTH.NetGameInfo.NetGameType",{
		normalGame :1,
		registeredOnlyGame :2,
		inviteOnlyGame :3,
		rankingGame :4	}),
	netGameType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo.NetGameType;},
		id: 2
	},
	maxNumPlayers: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	RaiseIntervalMode: PROTO.Enum("PokerTH.NetGameInfo.RaiseIntervalMode",{
		raiseOnHandNum :1,
		raiseOnMinutes :2	}),
	raiseIntervalMode: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo.RaiseIntervalMode;},
		id: 4
	},
	raiseEveryHands: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	raiseEveryMinutes: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 6
	},
	EndRaiseMode: PROTO.Enum("PokerTH.NetGameInfo.EndRaiseMode",{
		doubleBlinds :1,
		raiseByEndValue :2,
		keepLastBlind :3	}),
	endRaiseMode: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo.EndRaiseMode;},
		id: 7
	},
	endRaiseSmallBlindValue: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 8
	},
	proposedGuiSpeed: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 9
	},
	delayBetweenHands: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 10
	},
	playerActionTimeout: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 11
	},
	firstSmallBlind: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 12
	},
	startMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 13
	},
	manualBlinds: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 14
	},
	allowSpectators: {
		options: {default_value:true},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 15
	}});
PokerTH.PlayerResult = PROTO.Message("PokerTH.PlayerResult",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	resultCard1: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	resultCard2: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	bestHandPosition: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	moneyWon: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	playerMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 6
	},
	cardsValue: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 7
	}});
PokerTH.AnnounceMessage = PROTO.Message("PokerTH.AnnounceMessage",{
Version : PROTO.Message("PokerTH.AnnounceMessage.Version",{
	majorVersion: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	minorVersion: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}})
,
	protocolVersion: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AnnounceMessage.Version;},
		id: 1
	},
	latestGameVersion: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AnnounceMessage.Version;},
		id: 2
	},
	latestBetaRevision: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	ServerType: PROTO.Enum("PokerTH.AnnounceMessage.ServerType",{
		serverTypeLAN :0,
		serverTypeInternetNoAuth :1,
		serverTypeInternetAuth :2	}),
	serverType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AnnounceMessage.ServerType;},
		id: 4
	},
	numPlayersOnServer: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	}});
PokerTH.InitMessage = PROTO.Message("PokerTH.InitMessage",{
	requestedVersion: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AnnounceMessage.Version;},
		id: 1
	},
	buildId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	myLastSessionId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 3
	},
	authServerPassword: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 4
	},
	LoginType: PROTO.Enum("PokerTH.InitMessage.LoginType",{
		guestLogin :0,
		authenticatedLogin :1,
		unauthenticatedLogin :2	}),
	login: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.InitMessage.LoginType;},
		id: 5
	},
	nickName: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 6
	},
	clientUserData: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 7
	},
	avatarHash: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 8
	}});
PokerTH.AuthServerChallengeMessage = PROTO.Message("PokerTH.AuthServerChallengeMessage",{
	serverChallenge: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 1
	}});
PokerTH.AuthClientResponseMessage = PROTO.Message("PokerTH.AuthClientResponseMessage",{
	clientResponse: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 1
	}});
PokerTH.AuthServerVerificationMessage = PROTO.Message("PokerTH.AuthServerVerificationMessage",{
	serverVerification: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 1
	}});
PokerTH.InitAckMessage = PROTO.Message("PokerTH.InitAckMessage",{
	yourSessionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 1
	},
	yourPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	yourAvatarHash: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 3
	},
	rejoinGameId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 4
	}});
PokerTH.AvatarRequestMessage = PROTO.Message("PokerTH.AvatarRequestMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	avatarHash: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 2
	}});
PokerTH.AvatarHeaderMessage = PROTO.Message("PokerTH.AvatarHeaderMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	avatarType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetAvatarType;},
		id: 2
	},
	avatarSize: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	}});
PokerTH.AvatarDataMessage = PROTO.Message("PokerTH.AvatarDataMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	avatarBlock: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 2
	}});
PokerTH.AvatarEndMessage = PROTO.Message("PokerTH.AvatarEndMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.UnknownAvatarMessage = PROTO.Message("PokerTH.UnknownAvatarMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.PlayerListMessage = PROTO.Message("PokerTH.PlayerListMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	PlayerListNotification: PROTO.Enum("PokerTH.PlayerListMessage.PlayerListNotification",{
		playerListNew :0,
		playerListLeft :1	}),
	playerListNotification: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.PlayerListMessage.PlayerListNotification;},
		id: 2
	}});
PokerTH.GameListNewMessage = PROTO.Message("PokerTH.GameListNewMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	gameMode: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameMode;},
		id: 2
	},
	isPrivate: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 3
	},
	playerIds: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	adminPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	gameInfo: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo;},
		id: 6
	},
	spectatorIds: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 7
	}});
PokerTH.GameListUpdateMessage = PROTO.Message("PokerTH.GameListUpdateMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	gameMode: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameMode;},
		id: 2
	}});
PokerTH.GameListPlayerJoinedMessage = PROTO.Message("PokerTH.GameListPlayerJoinedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.GameListPlayerLeftMessage = PROTO.Message("PokerTH.GameListPlayerLeftMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.GameListSpectatorJoinedMessage = PROTO.Message("PokerTH.GameListSpectatorJoinedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.GameListSpectatorLeftMessage = PROTO.Message("PokerTH.GameListSpectatorLeftMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.GameListAdminChangedMessage = PROTO.Message("PokerTH.GameListAdminChangedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	newAdminPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.PlayerInfoRequestMessage = PROTO.Message("PokerTH.PlayerInfoRequestMessage",{
	playerId: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.PlayerInfoReplyMessage = PROTO.Message("PokerTH.PlayerInfoReplyMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
PlayerInfoData : PROTO.Message("PokerTH.PlayerInfoReplyMessage.PlayerInfoData",{
	playerName: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 1
	},
	isHuman: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 2
	},
	playerRights: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerInfoRights;},
		id: 3
	},
	countryCode: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 4
	},
AvatarData : PROTO.Message("PokerTH.PlayerInfoReplyMessage.PlayerInfoData.AvatarData",{
	avatarType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetAvatarType;},
		id: 1
	},
	avatarHash: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 2
	}})
,
	avatarData: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerInfoReplyMessage.PlayerInfoData.AvatarData;},
		id: 5
	}})
,
	playerInfoData: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerInfoReplyMessage.PlayerInfoData;},
		id: 2
	}});
PokerTH.SubscriptionRequestMessage = PROTO.Message("PokerTH.SubscriptionRequestMessage",{
	SubscriptionAction: PROTO.Enum("PokerTH.SubscriptionRequestMessage.SubscriptionAction",{
		unsubscribeGameList :1,
		resubscribeGameList :2	}),
	subscriptionAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.SubscriptionRequestMessage.SubscriptionAction;},
		id: 1
	}});
PokerTH.JoinExistingGameMessage = PROTO.Message("PokerTH.JoinExistingGameMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	password: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 2
	},
	autoLeave: {
		options: {default_value:false},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 3
	},
	spectateOnly: {
		options: {default_value:false},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 4
	}});
PokerTH.JoinNewGameMessage = PROTO.Message("PokerTH.JoinNewGameMessage",{
	gameInfo: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo;},
		id: 1
	},
	password: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 2
	},
	autoLeave: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 3
	}});
PokerTH.RejoinExistingGameMessage = PROTO.Message("PokerTH.RejoinExistingGameMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	autoLeave: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 2
	}});
PokerTH.JoinGameAckMessage = PROTO.Message("PokerTH.JoinGameAckMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	areYouGameAdmin: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 2
	},
	gameInfo: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo;},
		id: 3
	},
	spectateOnly: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 4
	}});
PokerTH.JoinGameFailedMessage = PROTO.Message("PokerTH.JoinGameFailedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	JoinGameFailureReason: PROTO.Enum("PokerTH.JoinGameFailedMessage.JoinGameFailureReason",{
		invalidGame :1,
		gameIsFull :2,
		gameIsRunning :3,
		invalidPassword :4,
		notAllowedAsGuest :5,
		notInvited :6,
		gameNameInUse :7,
		badGameName :8,
		invalidSettings :9,
		ipAddressBlocked :10,
		rejoinFailed :11,
		noSpectatorsAllowed :12	}),
	joinGameFailureReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.JoinGameFailedMessage.JoinGameFailureReason;},
		id: 2
	}});
PokerTH.GamePlayerJoinedMessage = PROTO.Message("PokerTH.GamePlayerJoinedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	isGameAdmin: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 3
	}});
PokerTH.GamePlayerLeftMessage = PROTO.Message("PokerTH.GamePlayerLeftMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	GamePlayerLeftReason: PROTO.Enum("PokerTH.GamePlayerLeftMessage.GamePlayerLeftReason",{
		leftOnRequest :0,
		leftKicked :1,
		leftError :2	}),
	gamePlayerLeftReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GamePlayerLeftMessage.GamePlayerLeftReason;},
		id: 3
	}});
PokerTH.GameSpectatorJoinedMessage = PROTO.Message("PokerTH.GameSpectatorJoinedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.GameSpectatorLeftMessage = PROTO.Message("PokerTH.GameSpectatorLeftMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	gameSpectatorLeftReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GamePlayerLeftMessage.GamePlayerLeftReason;},
		id: 3
	}});
PokerTH.GameAdminChangedMessage = PROTO.Message("PokerTH.GameAdminChangedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	newAdminPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.RemovedFromGameMessage = PROTO.Message("PokerTH.RemovedFromGameMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	RemovedFromGameReason: PROTO.Enum("PokerTH.RemovedFromGameMessage.RemovedFromGameReason",{
		removedOnRequest :0,
		kickedFromGame :1,
		gameIsFull :2,
		gameIsRunning :3,
		gameTimeout :4,
		removedStartFailed :5,
		gameClosed :6	}),
	removedFromGameReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.RemovedFromGameMessage.RemovedFromGameReason;},
		id: 2
	}});
PokerTH.KickPlayerRequestMessage = PROTO.Message("PokerTH.KickPlayerRequestMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.LeaveGameRequestMessage = PROTO.Message("PokerTH.LeaveGameRequestMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.InvitePlayerToGameMessage = PROTO.Message("PokerTH.InvitePlayerToGameMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.InviteNotifyMessage = PROTO.Message("PokerTH.InviteNotifyMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerIdWho: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	playerIdByWhom: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	}});
PokerTH.RejectGameInvitationMessage = PROTO.Message("PokerTH.RejectGameInvitationMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	RejectGameInvReason: PROTO.Enum("PokerTH.RejectGameInvitationMessage.RejectGameInvReason",{
		rejectReasonNo :0,
		rejectReasonBusy :1	}),
	myRejectReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.RejectGameInvitationMessage.RejectGameInvReason;},
		id: 2
	}});
PokerTH.RejectInvNotifyMessage = PROTO.Message("PokerTH.RejectInvNotifyMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	playerRejectReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.RejectGameInvitationMessage.RejectGameInvReason;},
		id: 3
	}});
PokerTH.StartEventMessage = PROTO.Message("PokerTH.StartEventMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	StartEventType: PROTO.Enum("PokerTH.StartEventMessage.StartEventType",{
		startEvent :0,
		rejoinEvent :1	}),
	startEventType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.StartEventMessage.StartEventType;},
		id: 2
	},
	fillWithComputerPlayers: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 3
	}});
PokerTH.StartEventAckMessage = PROTO.Message("PokerTH.StartEventAckMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.GameStartInitialMessage = PROTO.Message("PokerTH.GameStartInitialMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	startDealerPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	playerSeats: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 3
	}});
PokerTH.GameStartRejoinMessage = PROTO.Message("PokerTH.GameStartRejoinMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	startDealerPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	handNum: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
RejoinPlayerData : PROTO.Message("PokerTH.GameStartRejoinMessage.RejoinPlayerData",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}})
,
	rejoinPlayerData: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.GameStartRejoinMessage.RejoinPlayerData;},
		id: 4
	}});
PokerTH.HandStartMessage = PROTO.Message("PokerTH.HandStartMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
PlainCards : PROTO.Message("PokerTH.HandStartMessage.PlainCards",{
	plainCard1: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	plainCard2: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}})
,
	plainCards: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.HandStartMessage.PlainCards;},
		id: 2
	},
	encryptedCards: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 3
	},
	smallBlind: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	seatStates: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.NetPlayerState;},
		id: 5
	},
	dealerPlayerId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 6
	}});
PokerTH.PlayersTurnMessage = PROTO.Message("PokerTH.PlayersTurnMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	gameState: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameState;},
		id: 3
	}});
PokerTH.MyActionRequestMessage = PROTO.Message("PokerTH.MyActionRequestMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	handNum: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	gameState: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameState;},
		id: 3
	},
	myAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerAction;},
		id: 4
	},
	myRelativeBet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	}});
PokerTH.YourActionRejectedMessage = PROTO.Message("PokerTH.YourActionRejectedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	gameState: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameState;},
		id: 2
	},
	yourAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerAction;},
		id: 3
	},
	yourRelativeBet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	RejectionReason: PROTO.Enum("PokerTH.YourActionRejectedMessage.RejectionReason",{
		rejectedInvalidGameState :1,
		rejectedNotYourTurn :2,
		rejectedActionNotAllowed :3	}),
	rejectionReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.YourActionRejectedMessage.RejectionReason;},
		id: 5
	}});
PokerTH.PlayersActionDoneMessage = PROTO.Message("PokerTH.PlayersActionDoneMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	gameState: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameState;},
		id: 3
	},
	playerAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerAction;},
		id: 4
	},
	totalPlayerBet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	playerMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 6
	},
	highestSet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 7
	},
	minimumRaise: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 8
	}});
PokerTH.DealFlopCardsMessage = PROTO.Message("PokerTH.DealFlopCardsMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	flopCard1: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	flopCard2: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	flopCard3: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	}});
PokerTH.DealTurnCardMessage = PROTO.Message("PokerTH.DealTurnCardMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	turnCard: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.DealRiverCardMessage = PROTO.Message("PokerTH.DealRiverCardMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	riverCard: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.AllInShowCardsMessage = PROTO.Message("PokerTH.AllInShowCardsMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
PlayerAllIn : PROTO.Message("PokerTH.AllInShowCardsMessage.PlayerAllIn",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	allInCard1: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	allInCard2: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	}})
,
	playersAllIn: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.AllInShowCardsMessage.PlayerAllIn;},
		id: 2
	}});
PokerTH.EndOfHandShowCardsMessage = PROTO.Message("PokerTH.EndOfHandShowCardsMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerResults: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.PlayerResult;},
		id: 2
	}});
PokerTH.EndOfHandHideCardsMessage = PROTO.Message("PokerTH.EndOfHandHideCardsMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	moneyWon: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	playerMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	}});
PokerTH.ShowMyCardsRequestMessage = PROTO.Message("PokerTH.ShowMyCardsRequestMessage",{
});
PokerTH.AfterHandShowCardsMessage = PROTO.Message("PokerTH.AfterHandShowCardsMessage",{
	playerResult: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.PlayerResult;},
		id: 1
	}});
PokerTH.EndOfGameMessage = PROTO.Message("PokerTH.EndOfGameMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	winnerPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.PlayerIdChangedMessage = PROTO.Message("PokerTH.PlayerIdChangedMessage",{
	oldPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	newPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.AskKickPlayerMessage = PROTO.Message("PokerTH.AskKickPlayerMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.AskKickDeniedMessage = PROTO.Message("PokerTH.AskKickDeniedMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	KickDeniedReason: PROTO.Enum("PokerTH.AskKickDeniedMessage.KickDeniedReason",{
		kickDeniedInvalidGameState :0,
		kickDeniedNotPossible :1,
		kickDeniedTryAgainLater :2,
		kickDeniedAlreadyInProgress :3,
		kickDeniedInvalidPlayerId :4	}),
	kickDeniedReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AskKickDeniedMessage.KickDeniedReason;},
		id: 3
	}});
PokerTH.StartKickPetitionMessage = PROTO.Message("PokerTH.StartKickPetitionMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	proposingPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	kickPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	kickTimeoutSec: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	numVotesNeededToKick: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 6
	}});
PokerTH.VoteKickRequestMessage = PROTO.Message("PokerTH.VoteKickRequestMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	voteKick: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 3
	}});
PokerTH.VoteKickReplyMessage = PROTO.Message("PokerTH.VoteKickReplyMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	VoteKickReplyType: PROTO.Enum("PokerTH.VoteKickReplyMessage.VoteKickReplyType",{
		voteKickAck :0,
		voteKickDeniedInvalid :1,
		voteKickDeniedAlreadyVoted :2	}),
	voteKickReplyType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.VoteKickReplyMessage.VoteKickReplyType;},
		id: 3
	}});
PokerTH.KickPetitionUpdateMessage = PROTO.Message("PokerTH.KickPetitionUpdateMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	numVotesAgainstKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	numVotesInFavourOfKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	numVotesNeededToKick: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	}});
PokerTH.EndKickPetitionMessage = PROTO.Message("PokerTH.EndKickPetitionMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	numVotesAgainstKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	numVotesInFavourOfKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	resultPlayerKicked: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	PetitionEndReason: PROTO.Enum("PokerTH.EndKickPetitionMessage.PetitionEndReason",{
		petitionEndEnoughVotes :0,
		petitionEndTooFewPlayers :1,
		petitionEndPlayerLeft :2,
		petitionEndTimeout :3	}),
	petitionEndReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.EndKickPetitionMessage.PetitionEndReason;},
		id: 6
	}});
PokerTH.StatisticsMessage = PROTO.Message("PokerTH.StatisticsMessage",{
StatisticsData : PROTO.Message("PokerTH.StatisticsMessage.StatisticsData",{
	StatisticsType: PROTO.Enum("PokerTH.StatisticsMessage.StatisticsData.StatisticsType",{
		statNumberOfPlayers :1	}),
	statisticsType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.StatisticsMessage.StatisticsData.StatisticsType;},
		id: 1
	},
	statisticsValue: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}})
,
	statisticsData: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.StatisticsMessage.StatisticsData;},
		id: 1
	}});
PokerTH.ChatRequestMessage = PROTO.Message("PokerTH.ChatRequestMessage",{
	targetGameId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	targetPlayerId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	chatText: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 3
	}});
PokerTH.ChatMessage = PROTO.Message("PokerTH.ChatMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	ChatType: PROTO.Enum("PokerTH.ChatMessage.ChatType",{
		chatTypeLobby :0,
		chatTypeGame :1,
		chatTypeBot :2,
		chatTypeBroadcast :3,
		chatTypePrivate :4	}),
	chatType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.ChatMessage.ChatType;},
		id: 3
	},
	chatText: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 4
	}});
PokerTH.ChatRejectMessage = PROTO.Message("PokerTH.ChatRejectMessage",{
	chatText: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 1
	}});
PokerTH.DialogMessage = PROTO.Message("PokerTH.DialogMessage",{
	notificationText: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 1
	}});
PokerTH.TimeoutWarningMessage = PROTO.Message("PokerTH.TimeoutWarningMessage",{
	TimeoutReason: PROTO.Enum("PokerTH.TimeoutWarningMessage.TimeoutReason",{
		timeoutNoDataReceived :0,
		timeoutInactiveGame :1,
		timeoutKickAfterAutofold :2	}),
	timeoutReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.TimeoutWarningMessage.TimeoutReason;},
		id: 1
	},
	remainingSeconds: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.ResetTimeoutMessage = PROTO.Message("PokerTH.ResetTimeoutMessage",{
});
PokerTH.ReportAvatarMessage = PROTO.Message("PokerTH.ReportAvatarMessage",{
	reportedPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	reportedAvatarHash: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bytes;},
		id: 2
	}});
PokerTH.ReportAvatarAckMessage = PROTO.Message("PokerTH.ReportAvatarAckMessage",{
	reportedPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	ReportAvatarResult: PROTO.Enum("PokerTH.ReportAvatarAckMessage.ReportAvatarResult",{
		avatarReportAccepted :0,
		avatarReportDuplicate :1,
		avatarReportInvalid :2	}),
	reportAvatarResult: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.ReportAvatarAckMessage.ReportAvatarResult;},
		id: 2
	}});
PokerTH.ReportGameMessage = PROTO.Message("PokerTH.ReportGameMessage",{
	reportedGameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.ReportGameAckMessage = PROTO.Message("PokerTH.ReportGameAckMessage",{
	reportedGameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	ReportGameResult: PROTO.Enum("PokerTH.ReportGameAckMessage.ReportGameResult",{
		gameReportAccepted :0,
		gameReportDuplicate :1,
		gameReportInvalid :2	}),
	reportGameResult: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.ReportGameAckMessage.ReportGameResult;},
		id: 2
	}});
PokerTH.ErrorMessage = PROTO.Message("PokerTH.ErrorMessage",{
	ErrorReason: PROTO.Enum("PokerTH.ErrorMessage.ErrorReason",{
		reserved :0,
		initVersionNotSupported :1,
		initServerFull :2,
		initAuthFailure :3,
		initPlayerNameInUse :4,
		initInvalidPlayerName :5,
		initServerMaintenance :6,
		initBlocked :7,
		avatarTooLarge :8,
		invalidPacket :9,
		invalidState :10,
		kickedFromServer :11,
		bannedFromServer :12,
		blockedByServer :13,
		sessionTimeout :14	}),
	errorReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.ErrorMessage.ErrorReason;},
		id: 1
	}});
PokerTH.AdminRemoveGameMessage = PROTO.Message("PokerTH.AdminRemoveGameMessage",{
	removeGameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.AdminRemoveGameAckMessage = PROTO.Message("PokerTH.AdminRemoveGameAckMessage",{
	removeGameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	AdminRemoveGameResult: PROTO.Enum("PokerTH.AdminRemoveGameAckMessage.AdminRemoveGameResult",{
		gameRemoveAccepted :0,
		gameRemoveInvalid :1	}),
	removeGameResult: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AdminRemoveGameAckMessage.AdminRemoveGameResult;},
		id: 2
	}});
PokerTH.AdminBanPlayerMessage = PROTO.Message("PokerTH.AdminBanPlayerMessage",{
	banPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.AdminBanPlayerAckMessage = PROTO.Message("PokerTH.AdminBanPlayerAckMessage",{
	banPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	AdminBanPlayerResult: PROTO.Enum("PokerTH.AdminBanPlayerAckMessage.AdminBanPlayerResult",{
		banPlayerAccepted :0,
		banPlayerPending :1,
		banPlayerNoDB :2,
		banPlayerDBError :3,
		banPlayerInvalid :4	}),
	banPlayerResult: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AdminBanPlayerAckMessage.AdminBanPlayerResult;},
		id: 2
	}});
PokerTH.PokerTHMessage = PROTO.Message("PokerTH.PokerTHMessage",{
	PokerTHMessageType: PROTO.Enum("PokerTH.PokerTHMessage.PokerTHMessageType",{
		Type_AnnounceMessage :1,
		Type_InitMessage :2,
		Type_AuthServerChallengeMessage :3,
		Type_AuthClientResponseMessage :4,
		Type_AuthServerVerificationMessage :5,
		Type_InitAckMessage :6,
		Type_AvatarRequestMessage :7,
		Type_AvatarHeaderMessage :8,
		Type_AvatarDataMessage :9,
		Type_AvatarEndMessage :10,
		Type_UnknownAvatarMessage :11,
		Type_PlayerListMessage :12,
		Type_GameListNewMessage :13,
		Type_GameListUpdateMessage :14,
		Type_GameListPlayerJoinedMessage :15,
		Type_GameListPlayerLeftMessage :16,
		Type_GameListAdminChangedMessage :17,
		Type_PlayerInfoRequestMessage :18,
		Type_PlayerInfoReplyMessage :19,
		Type_SubscriptionRequestMessage :20,
		Type_JoinExistingGameMessage :21,
		Type_JoinNewGameMessage :22,
		Type_RejoinExistingGameMessage :23,
		Type_JoinGameAckMessage :24,
		Type_JoinGameFailedMessage :25,
		Type_GamePlayerJoinedMessage :26,
		Type_GamePlayerLeftMessage :27,
		Type_GameAdminChangedMessage :28,
		Type_RemovedFromGameMessage :29,
		Type_KickPlayerRequestMessage :30,
		Type_LeaveGameRequestMessage :31,
		Type_InvitePlayerToGameMessage :32,
		Type_InviteNotifyMessage :33,
		Type_RejectGameInvitationMessage :34,
		Type_RejectInvNotifyMessage :35,
		Type_StartEventMessage :36,
		Type_StartEventAckMessage :37,
		Type_GameStartInitialMessage :38,
		Type_GameStartRejoinMessage :39,
		Type_HandStartMessage :40,
		Type_PlayersTurnMessage :41,
		Type_MyActionRequestMessage :42,
		Type_YourActionRejectedMessage :43,
		Type_PlayersActionDoneMessage :44,
		Type_DealFlopCardsMessage :45,
		Type_DealTurnCardMessage :46,
		Type_DealRiverCardMessage :47,
		Type_AllInShowCardsMessage :48,
		Type_EndOfHandShowCardsMessage :49,
		Type_EndOfHandHideCardsMessage :50,
		Type_ShowMyCardsRequestMessage :51,
		Type_AfterHandShowCardsMessage :52,
		Type_EndOfGameMessage :53,
		Type_PlayerIdChangedMessage :54,
		Type_AskKickPlayerMessage :55,
		Type_AskKickDeniedMessage :56,
		Type_StartKickPetitionMessage :57,
		Type_VoteKickRequestMessage :58,
		Type_VoteKickReplyMessage :59,
		Type_KickPetitionUpdateMessage :60,
		Type_EndKickPetitionMessage :61,
		Type_StatisticsMessage :62,
		Type_ChatRequestMessage :63,
		Type_ChatMessage :64,
		Type_ChatRejectMessage :65,
		Type_DialogMessage :66,
		Type_TimeoutWarningMessage :67,
		Type_ResetTimeoutMessage :68,
		Type_ReportAvatarMessage :69,
		Type_ReportAvatarAckMessage :70,
		Type_ReportGameMessage :71,
		Type_ReportGameAckMessage :72,
		Type_ErrorMessage :73,
		Type_AdminRemoveGameMessage :74,
		Type_AdminRemoveGameAckMessage :75,
		Type_AdminBanPlayerMessage :76,
		Type_AdminBanPlayerAckMessage :77,
		Type_GameListSpectatorJoinedMessage :78,
		Type_GameListSpectatorLeftMessage :79,
		Type_GameSpectatorJoinedMessage :80,
		Type_GameSpectatorLeftMessage :81	}),
	messageType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.PokerTHMessage.PokerTHMessageType;},
		id: 1
	},
	announceMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AnnounceMessage;},
		id: 2
	},
	initMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InitMessage;},
		id: 3
	},
	authServerChallengeMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthServerChallengeMessage;},
		id: 4
	},
	authClientResponseMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthClientResponseMessage;},
		id: 5
	},
	authServerVerificationMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthServerVerificationMessage;},
		id: 6
	},
	initAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InitAckMessage;},
		id: 7
	},
	avatarRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarRequestMessage;},
		id: 8
	},
	avatarHeaderMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarHeaderMessage;},
		id: 9
	},
	avatarDataMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarDataMessage;},
		id: 10
	},
	avatarEndMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarEndMessage;},
		id: 11
	},
	unknownAvatarMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.UnknownAvatarMessage;},
		id: 12
	},
	playerListMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerListMessage;},
		id: 13
	},
	gameListNewMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListNewMessage;},
		id: 14
	},
	gameListUpdateMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListUpdateMessage;},
		id: 15
	},
	gameListPlayerJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListPlayerJoinedMessage;},
		id: 16
	},
	gameListPlayerLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListPlayerLeftMessage;},
		id: 17
	},
	gameListAdminChangedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListAdminChangedMessage;},
		id: 18
	},
	playerInfoRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerInfoRequestMessage;},
		id: 19
	},
	playerInfoReplyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerInfoReplyMessage;},
		id: 20
	},
	subscriptionRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.SubscriptionRequestMessage;},
		id: 21
	},
	joinExistingGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinExistingGameMessage;},
		id: 22
	},
	joinNewGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinNewGameMessage;},
		id: 23
	},
	rejoinExistingGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RejoinExistingGameMessage;},
		id: 24
	},
	joinGameAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinGameAckMessage;},
		id: 25
	},
	joinGameFailedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinGameFailedMessage;},
		id: 26
	},
	gamePlayerJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GamePlayerJoinedMessage;},
		id: 27
	},
	gamePlayerLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GamePlayerLeftMessage;},
		id: 28
	},
	gameAdminChangedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameAdminChangedMessage;},
		id: 29
	},
	removedFromGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RemovedFromGameMessage;},
		id: 30
	},
	kickPlayerRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.KickPlayerRequestMessage;},
		id: 31
	},
	leaveGameRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.LeaveGameRequestMessage;},
		id: 32
	},
	invitePlayerToGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InvitePlayerToGameMessage;},
		id: 33
	},
	inviteNotifyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InviteNotifyMessage;},
		id: 34
	},
	rejectGameInvitationMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RejectGameInvitationMessage;},
		id: 35
	},
	rejectInvNotifyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RejectInvNotifyMessage;},
		id: 36
	},
	startEventMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StartEventMessage;},
		id: 37
	},
	startEventAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StartEventAckMessage;},
		id: 38
	},
	gameStartInitialMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameStartInitialMessage;},
		id: 39
	},
	gameStartRejoinMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameStartRejoinMessage;},
		id: 40
	},
	handStartMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.HandStartMessage;},
		id: 41
	},
	playersTurnMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayersTurnMessage;},
		id: 42
	},
	myActionRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.MyActionRequestMessage;},
		id: 43
	},
	yourActionRejectedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.YourActionRejectedMessage;},
		id: 44
	},
	playersActionDoneMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayersActionDoneMessage;},
		id: 45
	},
	dealFlopCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DealFlopCardsMessage;},
		id: 46
	},
	dealTurnCardMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DealTurnCardMessage;},
		id: 47
	},
	dealRiverCardMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DealRiverCardMessage;},
		id: 48
	},
	allInShowCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AllInShowCardsMessage;},
		id: 49
	},
	endOfHandShowCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndOfHandShowCardsMessage;},
		id: 50
	},
	endOfHandHideCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndOfHandHideCardsMessage;},
		id: 51
	},
	showMyCardsRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ShowMyCardsRequestMessage;},
		id: 52
	},
	afterHandShowCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AfterHandShowCardsMessage;},
		id: 53
	},
	endOfGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndOfGameMessage;},
		id: 54
	},
	playerIdChangedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerIdChangedMessage;},
		id: 55
	},
	askKickPlayerMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AskKickPlayerMessage;},
		id: 56
	},
	askKickDeniedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AskKickDeniedMessage;},
		id: 57
	},
	startKickPetitionMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StartKickPetitionMessage;},
		id: 58
	},
	voteKickRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.VoteKickRequestMessage;},
		id: 59
	},
	voteKickReplyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.VoteKickReplyMessage;},
		id: 60
	},
	kickPetitionUpdateMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.KickPetitionUpdateMessage;},
		id: 61
	},
	endKickPetitionMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndKickPetitionMessage;},
		id: 62
	},
	statisticsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StatisticsMessage;},
		id: 63
	},
	chatRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatRequestMessage;},
		id: 64
	},
	chatMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatMessage;},
		id: 65
	},
	chatRejectMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatRejectMessage;},
		id: 66
	},
	dialogMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DialogMessage;},
		id: 67
	},
	timeoutWarningMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.TimeoutWarningMessage;},
		id: 68
	},
	resetTimeoutMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ResetTimeoutMessage;},
		id: 69
	},
	reportAvatarMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportAvatarMessage;},
		id: 70
	},
	reportAvatarAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportAvatarAckMessage;},
		id: 71
	},
	reportGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportGameMessage;},
		id: 72
	},
	reportGameAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportGameAckMessage;},
		id: 73
	},
	errorMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ErrorMessage;},
		id: 74
	},
	adminRemoveGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminRemoveGameMessage;},
		id: 75
	},
	adminRemoveGameAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminRemoveGameAckMessage;},
		id: 76
	},
	adminBanPlayerMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminBanPlayerMessage;},
		id: 77
	},
	adminBanPlayerAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminBanPlayerAckMessage;},
		id: 78
	},
	gameListSpectatorJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListSpectatorJoinedMessage;},
		id: 79
	},
	gameListSpectatorLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListSpectatorLeftMessage;},
		id: 80
	},
	gameSpectatorJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameSpectatorJoinedMessage;},
		id: 81
	},
	gameSpectatorLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameSpectatorLeftMessage;},
		id: 82
	}});