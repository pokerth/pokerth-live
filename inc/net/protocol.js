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
PokerTH.AuthClientRequestMessage = PROTO.Message("PokerTH.AuthClientRequestMessage",{
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
	LoginType: PROTO.Enum("PokerTH.AuthClientRequestMessage.LoginType",{
		guestLogin :0,
		authenticatedLogin :1,
		unauthenticatedLogin :2	}),
	login: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AuthClientRequestMessage.LoginType;},
		id: 3
	},
	authServerPassword: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 4
	},
	nickName: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 5
	},
	clientUserData: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 6
	},
	myLastSessionId: {
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
PokerTH.InitDoneMessage = PROTO.Message("PokerTH.InitDoneMessage",{
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
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	SubscriptionAction: PROTO.Enum("PokerTH.SubscriptionRequestMessage.SubscriptionAction",{
		unsubscribeGameList :1,
		resubscribeGameList :2	}),
	subscriptionAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.SubscriptionRequestMessage.SubscriptionAction;},
		id: 2
	}});
PokerTH.SubscriptionReplyMessage = PROTO.Message("PokerTH.SubscriptionReplyMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	ack: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 2
	}});
PokerTH.CreateGameMessage = PROTO.Message("PokerTH.CreateGameMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	gameInfo: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameInfo;},
		id: 2
	},
	password: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.string;},
		id: 3
	},
	autoLeave: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 4
	}});
PokerTH.CreateGameFailedMessage = PROTO.Message("PokerTH.CreateGameFailedMessage",{
	requestId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	CreateGameFailureReason: PROTO.Enum("PokerTH.CreateGameFailedMessage.CreateGameFailureReason",{
		notAllowedAsGuest :1,
		gameNameInUse :2,
		badGameName :3,
		invalidSettings :4	}),
	createGameFailureReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.CreateGameFailedMessage.CreateGameFailureReason;},
		id: 2
	}});
PokerTH.JoinGameMessage = PROTO.Message("PokerTH.JoinGameMessage",{
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
PokerTH.RejoinGameMessage = PROTO.Message("PokerTH.RejoinGameMessage",{
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	autoLeave: {
		options: {default_value:false},
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
	JoinGameFailureReason: PROTO.Enum("PokerTH.JoinGameFailedMessage.JoinGameFailureReason",{
		invalidGame :1,
		gameIsFull :2,
		gameIsRunning :3,
		notAllowedAsGuest :4,
		invalidPassword :5,
		notInvited :6,
		ipAddressBlocked :7,
		rejoinFailed :8,
		noSpectatorsAllowed :9	}),
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	joinGameFailureReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.JoinGameFailedMessage.JoinGameFailureReason;},
		id: 2
	}});
PokerTH.GamePlayerJoinedMessage = PROTO.Message("PokerTH.GamePlayerJoinedMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	isGameAdmin: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 2
	}});
PokerTH.GamePlayerLeftMessage = PROTO.Message("PokerTH.GamePlayerLeftMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	GamePlayerLeftReason: PROTO.Enum("PokerTH.GamePlayerLeftMessage.GamePlayerLeftReason",{
		leftOnRequest :0,
		leftKicked :1,
		leftError :2	}),
	gamePlayerLeftReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GamePlayerLeftMessage.GamePlayerLeftReason;},
		id: 2
	}});
PokerTH.GameSpectatorJoinedMessage = PROTO.Message("PokerTH.GameSpectatorJoinedMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.GameSpectatorLeftMessage = PROTO.Message("PokerTH.GameSpectatorLeftMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	gameSpectatorLeftReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GamePlayerLeftMessage.GamePlayerLeftReason;},
		id: 2
	}});
PokerTH.GameAdminChangedMessage = PROTO.Message("PokerTH.GameAdminChangedMessage",{
	newAdminPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.RemovedFromGameMessage = PROTO.Message("PokerTH.RemovedFromGameMessage",{
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
		id: 1
	}});
PokerTH.KickPlayerRequestMessage = PROTO.Message("PokerTH.KickPlayerRequestMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.LeaveGameRequestMessage = PROTO.Message("PokerTH.LeaveGameRequestMessage",{
});
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
	StartEventType: PROTO.Enum("PokerTH.StartEventMessage.StartEventType",{
		startEvent :0,
		rejoinEvent :1	}),
	startEventType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.StartEventMessage.StartEventType;},
		id: 1
	},
	fillWithComputerPlayers: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bool;},
		id: 2
	}});
PokerTH.StartEventAckMessage = PROTO.Message("PokerTH.StartEventAckMessage",{
});
PokerTH.GameStartInitialMessage = PROTO.Message("PokerTH.GameStartInitialMessage",{
	startDealerPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	playerSeats: {
		options: {packed:true},
		multiplicity: PROTO.repeated,
		type: function(){return PROTO.uint32;},
		id: 2
	}});
PokerTH.GameStartRejoinMessage = PROTO.Message("PokerTH.GameStartRejoinMessage",{
	startDealerPlayerId: {
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
		id: 3
	}});
PokerTH.HandStartMessage = PROTO.Message("PokerTH.HandStartMessage",{
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
		id: 1
	},
	encryptedCards: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.bytes;},
		id: 2
	},
	smallBlind: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	seatStates: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.NetPlayerState;},
		id: 4
	},
	dealerPlayerId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 5
	}});
PokerTH.PlayersTurnMessage = PROTO.Message("PokerTH.PlayersTurnMessage",{
	playerId: {
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
	}});
PokerTH.MyActionRequestMessage = PROTO.Message("PokerTH.MyActionRequestMessage",{
	handNum: {
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
	myAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerAction;},
		id: 3
	},
	myRelativeBet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	}});
PokerTH.YourActionRejectedMessage = PROTO.Message("PokerTH.YourActionRejectedMessage",{
	gameState: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetGameState;},
		id: 1
	},
	yourAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerAction;},
		id: 2
	},
	yourRelativeBet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	RejectionReason: PROTO.Enum("PokerTH.YourActionRejectedMessage.RejectionReason",{
		rejectedInvalidGameState :1,
		rejectedNotYourTurn :2,
		rejectedActionNotAllowed :3	}),
	rejectionReason: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.YourActionRejectedMessage.RejectionReason;},
		id: 4
	}});
PokerTH.PlayersActionDoneMessage = PROTO.Message("PokerTH.PlayersActionDoneMessage",{
	playerId: {
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
	playerAction: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.NetPlayerAction;},
		id: 3
	},
	totalPlayerBet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	},
	playerMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 5
	},
	highestSet: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 6
	},
	minimumRaise: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 7
	}});
PokerTH.DealFlopCardsMessage = PROTO.Message("PokerTH.DealFlopCardsMessage",{
	flopCard1: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	flopCard2: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	flopCard3: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	}});
PokerTH.DealTurnCardMessage = PROTO.Message("PokerTH.DealTurnCardMessage",{
	turnCard: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.DealRiverCardMessage = PROTO.Message("PokerTH.DealRiverCardMessage",{
	riverCard: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.AllInShowCardsMessage = PROTO.Message("PokerTH.AllInShowCardsMessage",{
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
		id: 1
	}});
PokerTH.EndOfHandShowCardsMessage = PROTO.Message("PokerTH.EndOfHandShowCardsMessage",{
	playerResults: {
		options: {},
		multiplicity: PROTO.repeated,
		type: function(){return PokerTH.PlayerResult;},
		id: 1
	}});
PokerTH.EndOfHandHideCardsMessage = PROTO.Message("PokerTH.EndOfHandHideCardsMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	moneyWon: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	playerMoney: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
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
	winnerPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
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
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	}});
PokerTH.AskKickDeniedMessage = PROTO.Message("PokerTH.AskKickDeniedMessage",{
	playerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
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
		id: 2
	}});
PokerTH.StartKickPetitionMessage = PROTO.Message("PokerTH.StartKickPetitionMessage",{
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	proposingPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	kickPlayerId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	kickTimeoutSec: {
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
PokerTH.VoteKickRequestMessage = PROTO.Message("PokerTH.VoteKickRequestMessage",{
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	voteKick: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.bool;},
		id: 2
	}});
PokerTH.VoteKickReplyMessage = PROTO.Message("PokerTH.VoteKickReplyMessage",{
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	VoteKickReplyType: PROTO.Enum("PokerTH.VoteKickReplyMessage.VoteKickReplyType",{
		voteKickAck :0,
		voteKickDeniedInvalid :1,
		voteKickDeniedAlreadyVoted :2	}),
	voteKickReplyType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.VoteKickReplyMessage.VoteKickReplyType;},
		id: 2
	}});
PokerTH.KickPetitionUpdateMessage = PROTO.Message("PokerTH.KickPetitionUpdateMessage",{
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	numVotesAgainstKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	numVotesInFavourOfKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	numVotesNeededToKick: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
	}});
PokerTH.EndKickPetitionMessage = PROTO.Message("PokerTH.EndKickPetitionMessage",{
	petitionId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	numVotesAgainstKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	numVotesInFavourOfKicking: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 3
	},
	resultPlayerKicked: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 4
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
		id: 5
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
	playerId: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PROTO.uint32;},
		id: 1
	},
	ChatType: PROTO.Enum("PokerTH.ChatMessage.ChatType",{
		chatTypeStandard :0,
		chatTypeBot :1,
		chatTypeBroadcast :2,
		chatTypePrivate :3	}),
	chatType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.ChatMessage.ChatType;},
		id: 2
	},
	chatText: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.string;},
		id: 3
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
PokerTH.AuthMessage = PROTO.Message("PokerTH.AuthMessage",{
	AuthMessageType: PROTO.Enum("PokerTH.AuthMessage.AuthMessageType",{
		Type_AuthClientRequestMessage :1,
		Type_AuthServerChallengeMessage :2,
		Type_AuthClientResponseMessage :3,
		Type_AuthServerVerificationMessage :4,
		Type_ErrorMessage :1024	}),
	messageType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.AuthMessage.AuthMessageType;},
		id: 1
	},
	authClientRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthClientRequestMessage;},
		id: 2
	},
	authServerChallengeMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthServerChallengeMessage;},
		id: 3
	},
	authClientResponseMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthClientResponseMessage;},
		id: 4
	},
	authServerVerificationMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthServerVerificationMessage;},
		id: 5
	},
	errorMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ErrorMessage;},
		id: 1025
	}});
PokerTH.LobbyMessage = PROTO.Message("PokerTH.LobbyMessage",{
	LobbyMessageType: PROTO.Enum("PokerTH.LobbyMessage.LobbyMessageType",{
		Type_InitDoneMessage :1,
		Type_AvatarRequestMessage :2,
		Type_AvatarHeaderMessage :3,
		Type_AvatarDataMessage :4,
		Type_AvatarEndMessage :5,
		Type_UnknownAvatarMessage :6,
		Type_PlayerListMessage :7,
		Type_GameListNewMessage :8,
		Type_GameListUpdateMessage :9,
		Type_GameListPlayerJoinedMessage :10,
		Type_GameListPlayerLeftMessage :11,
		Type_GameListSpectatorJoinedMessage :12,
		Type_GameListSpectatorLeftMessage :13,
		Type_GameListAdminChangedMessage :14,
		Type_PlayerInfoRequestMessage :15,
		Type_PlayerInfoReplyMessage :16,
		Type_SubscriptionRequestMessage :17,
		Type_SubscriptionReplyMessage :18,
		Type_CreateGameMessage :19,
		Type_CreateGameFailedMessage :20,
		Type_JoinGameMessage :21,
		Type_RejoinGameMessage :22,
		Type_JoinGameAckMessage :23,
		Type_JoinGameFailedMessage :24,
		Type_InviteNotifyMessage :25,
		Type_RejectGameInvitationMessage :26,
		Type_RejectInvNotifyMessage :27,
		Type_StatisticsMessage :28,
		Type_ChatRequestMessage :29,
		Type_ChatMessage :30,
		Type_ChatRejectMessage :31,
		Type_DialogMessage :32,
		Type_TimeoutWarningMessage :33,
		Type_ResetTimeoutMessage :34,
		Type_ReportAvatarMessage :35,
		Type_ReportAvatarAckMessage :36,
		Type_ReportGameMessage :37,
		Type_ReportGameAckMessage :38,
		Type_AdminRemoveGameMessage :39,
		Type_AdminRemoveGameAckMessage :40,
		Type_AdminBanPlayerMessage :41,
		Type_AdminBanPlayerAckMessage :42,
		Type_ErrorMessage :1024	}),
	messageType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.LobbyMessage.LobbyMessageType;},
		id: 1
	},
	initDoneMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InitDoneMessage;},
		id: 2
	},
	avatarRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarRequestMessage;},
		id: 3
	},
	avatarHeaderMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarHeaderMessage;},
		id: 4
	},
	avatarDataMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarDataMessage;},
		id: 5
	},
	avatarEndMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AvatarEndMessage;},
		id: 6
	},
	unknownAvatarMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.UnknownAvatarMessage;},
		id: 7
	},
	playerListMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerListMessage;},
		id: 8
	},
	gameListNewMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListNewMessage;},
		id: 9
	},
	gameListUpdateMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListUpdateMessage;},
		id: 10
	},
	gameListPlayerJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListPlayerJoinedMessage;},
		id: 11
	},
	gameListPlayerLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListPlayerLeftMessage;},
		id: 12
	},
	gameListSpectatorJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListSpectatorJoinedMessage;},
		id: 13
	},
	gameListSpectatorLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListSpectatorLeftMessage;},
		id: 14
	},
	gameListAdminChangedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameListAdminChangedMessage;},
		id: 15
	},
	playerInfoRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerInfoRequestMessage;},
		id: 16
	},
	playerInfoReplyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerInfoReplyMessage;},
		id: 17
	},
	subscriptionRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.SubscriptionRequestMessage;},
		id: 18
	},
	subscriptionReplyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.SubscriptionReplyMessage;},
		id: 19
	},
	createGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.CreateGameMessage;},
		id: 20
	},
	createGameFailedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.CreateGameFailedMessage;},
		id: 21
	},
	joinGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinGameMessage;},
		id: 22
	},
	rejoinGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RejoinGameMessage;},
		id: 23
	},
	joinGameAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinGameAckMessage;},
		id: 24
	},
	joinGameFailedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.JoinGameFailedMessage;},
		id: 25
	},
	inviteNotifyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InviteNotifyMessage;},
		id: 26
	},
	rejectGameInvitationMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RejectGameInvitationMessage;},
		id: 27
	},
	rejectInvNotifyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RejectInvNotifyMessage;},
		id: 28
	},
	statisticsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StatisticsMessage;},
		id: 29
	},
	chatRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatRequestMessage;},
		id: 30
	},
	chatMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatMessage;},
		id: 31
	},
	chatRejectMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatRejectMessage;},
		id: 32
	},
	dialogMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DialogMessage;},
		id: 33
	},
	timeoutWarningMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.TimeoutWarningMessage;},
		id: 34
	},
	resetTimeoutMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ResetTimeoutMessage;},
		id: 35
	},
	reportAvatarMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportAvatarMessage;},
		id: 36
	},
	reportAvatarAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportAvatarAckMessage;},
		id: 37
	},
	reportGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportGameMessage;},
		id: 38
	},
	reportGameAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ReportGameAckMessage;},
		id: 39
	},
	adminRemoveGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminRemoveGameMessage;},
		id: 40
	},
	adminRemoveGameAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminRemoveGameAckMessage;},
		id: 41
	},
	adminBanPlayerMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminBanPlayerMessage;},
		id: 42
	},
	adminBanPlayerAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AdminBanPlayerAckMessage;},
		id: 43
	},
	errorMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ErrorMessage;},
		id: 1025
	}});
PokerTH.GameManagementMessage = PROTO.Message("PokerTH.GameManagementMessage",{
	GameManagementMessageType: PROTO.Enum("PokerTH.GameManagementMessage.GameManagementMessageType",{
		Type_GamePlayerJoinedMessage :1,
		Type_GamePlayerLeftMessage :2,
		Type_GameSpectatorJoinedMessage :3,
		Type_GameSpectatorLeftMessage :4,
		Type_GameAdminChangedMessage :5,
		Type_RemovedFromGameMessage :6,
		Type_KickPlayerRequestMessage :7,
		Type_LeaveGameRequestMessage :8,
		Type_InvitePlayerToGameMessage :9,
		Type_StartEventMessage :10,
		Type_StartEventAckMessage :11,
		Type_GameStartInitialMessage :12,
		Type_GameStartRejoinMessage :13,
		Type_EndOfGameMessage :14,
		Type_PlayerIdChangedMessage :15,
		Type_AskKickPlayerMessage :16,
		Type_AskKickDeniedMessage :17,
		Type_StartKickPetitionMessage :18,
		Type_VoteKickRequestMessage :19,
		Type_VoteKickReplyMessage :20,
		Type_KickPetitionUpdateMessage :21,
		Type_EndKickPetitionMessage :22,
		Type_ChatRequestMessage :23,
		Type_ChatMessage :24,
		Type_ChatRejectMessage :25,
		Type_TimeoutWarningMessage :26,
		Type_ResetTimeoutMessage :27,
		Type_ErrorMessage :1024	}),
	messageType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GameManagementMessage.GameManagementMessageType;},
		id: 1
	},
	gamePlayerJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GamePlayerJoinedMessage;},
		id: 2
	},
	gamePlayerLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GamePlayerLeftMessage;},
		id: 3
	},
	gameSpectatorJoinedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameSpectatorJoinedMessage;},
		id: 4
	},
	gameSpectatorLeftMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameSpectatorLeftMessage;},
		id: 5
	},
	gameAdminChangedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameAdminChangedMessage;},
		id: 6
	},
	removedFromGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.RemovedFromGameMessage;},
		id: 7
	},
	kickPlayerRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.KickPlayerRequestMessage;},
		id: 8
	},
	leaveGameRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.LeaveGameRequestMessage;},
		id: 9
	},
	invitePlayerToGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.InvitePlayerToGameMessage;},
		id: 10
	},
	startEventMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StartEventMessage;},
		id: 11
	},
	startEventAckMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StartEventAckMessage;},
		id: 12
	},
	gameStartInitialMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameStartInitialMessage;},
		id: 13
	},
	gameStartRejoinMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameStartRejoinMessage;},
		id: 14
	},
	endOfGameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndOfGameMessage;},
		id: 15
	},
	playerIdChangedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayerIdChangedMessage;},
		id: 16
	},
	askKickPlayerMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AskKickPlayerMessage;},
		id: 17
	},
	askKickDeniedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AskKickDeniedMessage;},
		id: 18
	},
	startKickPetitionMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.StartKickPetitionMessage;},
		id: 19
	},
	voteKickRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.VoteKickRequestMessage;},
		id: 20
	},
	voteKickReplyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.VoteKickReplyMessage;},
		id: 21
	},
	kickPetitionUpdateMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.KickPetitionUpdateMessage;},
		id: 22
	},
	endKickPetitionMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndKickPetitionMessage;},
		id: 23
	},
	chatRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatRequestMessage;},
		id: 24
	},
	chatMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatMessage;},
		id: 25
	},
	chatRejectMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ChatRejectMessage;},
		id: 26
	},
	timeoutWarningMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.TimeoutWarningMessage;},
		id: 27
	},
	resetTimeoutMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ResetTimeoutMessage;},
		id: 28
	},
	errorMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ErrorMessage;},
		id: 1025
	}});
PokerTH.GameEngineMessage = PROTO.Message("PokerTH.GameEngineMessage",{
	GameEngineMessageType: PROTO.Enum("PokerTH.GameEngineMessage.GameEngineMessageType",{
		Type_HandStartMessage :1,
		Type_PlayersTurnMessage :2,
		Type_MyActionRequestMessage :3,
		Type_YourActionRejectedMessage :4,
		Type_PlayersActionDoneMessage :5,
		Type_DealFlopCardsMessage :6,
		Type_DealTurnCardMessage :7,
		Type_DealRiverCardMessage :8,
		Type_AllInShowCardsMessage :9,
		Type_EndOfHandShowCardsMessage :10,
		Type_EndOfHandHideCardsMessage :11,
		Type_ShowMyCardsRequestMessage :12,
		Type_AfterHandShowCardsMessage :13	}),
	messageType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GameEngineMessage.GameEngineMessageType;},
		id: 1
	},
	handStartMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.HandStartMessage;},
		id: 2
	},
	playersTurnMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayersTurnMessage;},
		id: 3
	},
	myActionRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.MyActionRequestMessage;},
		id: 4
	},
	yourActionRejectedMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.YourActionRejectedMessage;},
		id: 5
	},
	playersActionDoneMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.PlayersActionDoneMessage;},
		id: 6
	},
	dealFlopCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DealFlopCardsMessage;},
		id: 7
	},
	dealTurnCardMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DealTurnCardMessage;},
		id: 8
	},
	dealRiverCardMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.DealRiverCardMessage;},
		id: 9
	},
	allInShowCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AllInShowCardsMessage;},
		id: 10
	},
	endOfHandShowCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndOfHandShowCardsMessage;},
		id: 11
	},
	endOfHandHideCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.EndOfHandHideCardsMessage;},
		id: 12
	},
	showMyCardsRequestMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.ShowMyCardsRequestMessage;},
		id: 13
	},
	afterHandShowCardsMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AfterHandShowCardsMessage;},
		id: 14
	}});
PokerTH.GameMessage = PROTO.Message("PokerTH.GameMessage",{
	GameMessageType: PROTO.Enum("PokerTH.GameMessage.GameMessageType",{
		Type_GameManagementMessage :1,
		Type_GameEngineMessage :2	}),
	messageType: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PokerTH.GameMessage.GameMessageType;},
		id: 1
	},
	gameId: {
		options: {},
		multiplicity: PROTO.required,
		type: function(){return PROTO.uint32;},
		id: 2
	},
	gameManagementMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameManagementMessage;},
		id: 3
	},
	gameEngineMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameEngineMessage;},
		id: 4
	}});
PokerTH.PokerTHMessage = PROTO.Message("PokerTH.PokerTHMessage",{
	PokerTHMessageType: PROTO.Enum("PokerTH.PokerTHMessage.PokerTHMessageType",{
		Type_AnnounceMessage :1,
		Type_AuthMessage :2,
		Type_LobbyMessage :3,
		Type_GameMessage :4	}),
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
	authMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.AuthMessage;},
		id: 3
	},
	lobbyMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.LobbyMessage;},
		id: 4
	},
	gameMessage: {
		options: {},
		multiplicity: PROTO.optional,
		type: function(){return PokerTH.GameMessage;},
		id: 5
	}});
