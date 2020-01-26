/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myNetEventHandler = new Object();

/**
 * class NetEventHandler
 * @constructor
 */
function NetEventHandler()
{
	var self = this;
	this.nickName = "";
	this.password = "";
	this.playerId = 0;
	this.requestedPlayerIds = new Object();
	this.websocket = null;
	this.isOfficialServer = false;
	this.guiUpdateTimer = null;
	this.guiUpdateTimout = 2000;
	this.scramSha1 = new scram_sha1();

	this.connect = function(nickName, password)
	{
		self.nickName = nickName;
		self.password = password;
		self.websocket = new WebSocket("ws://46.38.236.60:7233/pokerthwebsocket");
		//self.websocket = new WebSocket("ws://46.38.236.60:7232/pokerthwebsocket");
		self.websocket.binaryType = 'arraybuffer';
		self.websocket.onopen = function(evt){ self.onOpen(evt); };
		self.websocket.onclose = function(evt){ self.onClose(evt); };
		self.websocket.onmessage = function(evt){ self.onMessage(evt); };
		self.websocket.onerror = function(evt){ self.onError(evt); };
	};

	this.setGuestNickName = function()
	{
		var nickNum = "" + Math.floor((Math.random()*99999)+1);
		while (nickNum.length < 5) {
			nickNum = "0" + nickNum;
		}
		self.nickName = 'Guest' + nickNum;
	};
	
	this.sendMsg = function(msg)
	{
		if (self.websocket.readyState === 1)
		{
			var outArray = [];
			outArray = msg.SerializeToArray(outArray);
			var outBuf = new ArrayBuffer(outArray.length);
			var outView = new Uint8Array(outBuf);
			for (var i = 0; i < outArray.length; i++) {
				outView[i] = outArray[i];
			}
			self.websocket.send(outBuf);
		}
		else
		{
			console.log("Error sending message - socket is not open. Type: " + msg.messageType);
		}
	};

	this.onOpen = function(evt)
	{
		myNetCache.setCallback(self);
	};

	this.onClose = function(evt)
	{
		myGui.signalNetClientDisconnected();
	};

	this.onError = function(evt)
	{
		myGui.signalNetClientNetworkError(evt);
	};

	this.onMessage = function(evt)
	{
		var recvMessage = new PokerTH.PokerTHMessage();
		recvMessage.ParseFromArray(new Uint8Array(evt.data));
		if (recvMessage.messageType === PokerTH.PokerTHMessage.PokerTHMessageType.Type_AnnounceMessage)
		{
			self.handleMsgAnnounce(recvMessage.announceMessage);
		}
		else if (recvMessage.messageType === PokerTH.PokerTHMessage.PokerTHMessageType.Type_AuthMessage)
		{
			var authMessage = recvMessage.authMessage;
			switch(authMessage.messageType)
			{
			case PokerTH.AuthMessage.AuthMessageType.Type_AuthServerChallengeMessage:
				self.handleMsgAuthServerChallenge(authMessage.authServerChallengeMessage);
				break;
			case PokerTH.AuthMessage.AuthMessageType.Type_AuthServerVerificationMessage:
				self.handleMsgAuthServerVerification(authMessage.authServerVerificationMessage);
				break;
			}
		}
		else if (recvMessage.messageType === PokerTH.PokerTHMessage.PokerTHMessageType.Type_LobbyMessage)
		{
			var lobbyMessage = recvMessage.lobbyMessage;
			switch(lobbyMessage.messageType)
			{
			case PokerTH.LobbyMessage.LobbyMessageType.Type_InitDoneMessage:
				self.handleMsgInitDone(lobbyMessage.initDoneMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_GameListNewMessage :
				self.handleMsgGameListNew(lobbyMessage.gameListNewMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_GameListUpdateMessage :
				self.handleMsgGameListUpdate(lobbyMessage.gameListUpdateMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_GameListPlayerJoinedMessage :
				self.handleMsgGameListPlayerJoined(lobbyMessage.gameListPlayerJoinedMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_GameListPlayerLeftMessage :
				self.handleMsgGameListPlayerLeft(lobbyMessage.gameListPlayerLeftMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_GameListSpectatorJoinedMessage :
				self.handleMsgGameListSpectatorJoined(lobbyMessage.gameListSpectatorJoinedMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_GameListSpectatorLeftMessage :
				self.handleMsgGameListSpectatorLeft(lobbyMessage.gameListSpectatorLeftMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_PlayerListMessage :
				self.handleMsgPlayerList(lobbyMessage.playerListMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_PlayerInfoReplyMessage :
				self.handleMsgPlayerInfoReply(lobbyMessage.playerInfoReplyMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_JoinGameAckMessage :
				self.handleMsgJoinGameAck(lobbyMessage.joinGameAckMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_JoinGameFailedMessage :
				self.handleMsgJoinGameFailed(lobbyMessage.joinGameFailedMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_ErrorMessage :
				self.handleMsgError(lobbyMessage.errorMessage);
				break;
			case PokerTH.LobbyMessage.LobbyMessageType.Type_ChatMessage :
				self.handleMsgChat(lobbyMessage.chatMessage);
				break;
			}
		}
		else if (recvMessage.messageType === PokerTH.PokerTHMessage.PokerTHMessageType.Type_GameMessage)
		{
			var gameMessage = recvMessage.gameMessage;
			switch(gameMessage.messageType)
			{
			case PokerTH.GameMessage.GameMessageType.Type_GamePlayerJoinedMessage :
				self.handleMsgGamePlayerJoined(gameMessage.gamePlayerJoinedMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_GamePlayerLeftMessage :
				self.handleMsgGamePlayerLeft(gameMessage.gamePlayerLeftMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_GameSpectatorJoinedMessage :
				self.handleMsgGameSpectatorJoined(gameMessage.gameSpectatorJoinedMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_GameSpectatorLeftMessage :
				self.handleMsgGameSpectatorLeft(gameMessage.gameSpectatorLeftMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_GameStartInitialMessage :
				self.handleMsgGameStartInitial(gameMessage.gameStartInitialMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_GameStartRejoinMessage :
				self.handleMsgGameStartRejoin(gameMessage.gameStartRejoinMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_HandStartMessage :
				self.handleMsgHandStart(gameMessage.handStartMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_PlayersTurnMessage :
				self.handleMsgPlayersTurn(gameMessage.playersTurnMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_PlayersActionDoneMessage :
				self.handleMsgPlayersActionDone(gameMessage.playersActionDoneMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_DealFlopCardsMessage :
				self.handleMsgDealFlopCards(gameMessage.dealFlopCardsMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_DealTurnCardMessage :
				self.handleMsgDealTurnCard(gameMessage.dealTurnCardMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_DealRiverCardMessage :
				self.handleMsgDealRiverCard(gameMessage.dealRiverCardMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_AllInShowCardsMessage :
				self.handleMsgAllInShowCards(gameMessage.allInShowCardsMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_EndOfHandShowCardsMessage :
				self.handleMsgEndOfHandShowCards(gameMessage.endOfHandShowCardsMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_EndOfHandHideCardsMessage :
				self.handleMsgEndOfHandHideCards(gameMessage.endOfHandHideCardsMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_AfterHandShowCardsMessage :
				self.handleMsgAfterHandShowCards(gameMessage.afterHandShowCardsMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_RemovedFromGameMessage :
				self.handleMsgRemovedFromGame(gameMessage.removedFromGameMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_PlayerIdChangedMessage :
				self.handleMsgPlayerIdChanged(gameMessage.playerIdChangedMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_ChatMessage :
				self.handleMsgChat(gameMessage.chatMessage);
				break;
			case PokerTH.GameMessage.GameMessageType.Type_TimeoutWarningMessage :
				self.handleMsgTimeoutWarning(gameMessage.timeoutWarningMessage);
				break;
			}
		}
	};
	
	
	this.handleMsgAnnounce = function(announce)
	{
		if (announce.serverType === PokerTH.AnnounceMessage.ServerType.serverTypeInternetAuth
			&& self.websocket.url === B64.decode(this.remoteServer))
		{
			// Send Init message to server.
			var auth = new PokerTH.PokerTHMessage;
			auth.messageType = PokerTH.PokerTHMessage.PokerTHMessageType.Type_AuthMessage;
			auth.authMessage = new PokerTH.AuthMessage;
			auth.authMessage.messageType = PokerTH.AuthMessage.AuthMessageType.Type_AuthClientRequestMessage;
			var authClientRequest = new PokerTH.AuthClientRequestMessage;
			authClientRequest.requestedVersion = new PokerTH.AnnounceMessage.Version;
			authClientRequest.requestedVersion.majorVersion = 5;
			authClientRequest.requestedVersion.minorVersion = 1;
			authClientRequest.buildId = 0;
			authClientRequest.login = PokerTH.AuthClientRequestMessage.LoginType.authenticatedLogin;
			if (!self.nickName) {
				self.setGuestNickName();
				authClientRequest.nickName = self.nickName;
				authClientRequest.login = PokerTH.AuthClientRequestMessage.LoginType.guestLogin;
			}
			else
			{
				authClientRequest.clientUserData = self.scramSha1.executeStep1(self.nickName);
				authClientRequest.login = PokerTH.AuthClientRequestMessage.LoginType.authenticatedLogin;
			}
			auth.authMessage.authClientRequestMessage = authClientRequest;
			self.sendMsg(auth);
			self.isOfficialServer = announce.serverType === PokerTH.AnnounceMessage.ServerType.serverTypeInternetAuth;
		}
		else
		{
			self.websocket.close();
			myGui.signalNetClientServerError("Invalid server.");
		}
	};

	this.handleMsgInitDone = function(initDone)
	{
		self.playerId = initDone.yourPlayerId;
		myGui.signalNetClientConnected(self.nickName);
		if (self.websocket.readyState === 1)
		{
			self.beginInitialLobbyUpdate();
		}
	};

	this.handleMsgAuthServerChallenge = function(authServerChallenge)
	{
		var response = new PokerTH.PokerTHMessage;
		response.authMessage = new PokerTH.AuthMessage;
		response.authMessage.messageType = PokerTH.AuthMessage.AuthMessageType.Type_AuthClientResponseMessage;
		response.authMessage.authClientResponseMessage = new PokerTH.AuthClientResponseMessage;
		response.authMessage.authClientResponseMessage.clientResponse = self.scramSha1.executeStep2(self.password, authServerChallenge.serverChallenge);
		self.password = "";
		self.sendMsg(response);
	};

	this.handleMsgAuthServerVerification = function(authServerVerification)
	{
		if (self.scramSha1.executeStep3(authServerVerification.serverVerification) !== 1)
		{
			self.websocket.close();
			myGui.signalNetClientServerError("Invalid server auth.");
		}
	};

	this.handleMsgGameListNew = function(gameListNew)
	{
		self.markInitialLobbyUpdateMsg();
		if (self.isOfficialServer)
		{
			// Add game data to cache.
			myNetCache.addGameData(gameListNew);
			myGui.signalNetClientGameListNew(gameListNew.gameId);
			for (var playerPos = 0; playerPos < gameListNew.playerIds.length; playerPos++)
			{
				self.requestPlayerInfo(gameListNew.playerIds[playerPos]);
			}
		}
	};

	this.handleMsgGameListUpdate = function(gameListUpdate)
	{
		// Add game data to cache.
		if (gameListUpdate.gameMode === PokerTH.NetGameMode.netGameClosed)
		{
			myGui.signalNetClientGameListRemove(gameListUpdate.gameId);
			myNetCache.removeGameData(gameListUpdate.gameId);
		}
		else
		{
			myNetCache.getGameData(gameListUpdate.gameId).gameMode = gameListUpdate.gameMode;
			myGui.signalNetClientGameListUpdate(gameListUpdate.gameId);
		}
	};

	this.handleMsgGameListPlayerJoined = function(gameListPlayerJoined)
	{
		myNetCache.getGameData(gameListPlayerJoined.gameId).playerIds.push(gameListPlayerJoined.playerId);
		myGui.signalNetClientGameListPlayerJoined(gameListPlayerJoined.gameId, gameListPlayerJoined.playerId);
		self.requestPlayerInfo(gameListPlayerJoined.playerId);
	};

	this.handleMsgGameListPlayerLeft = function(gameListPlayerLeft)
	{
		var playerIds = myNetCache.getGameData(gameListPlayerLeft.gameId).playerIds;
		// create a copy of all players
		var playerIdsCopy = new Array();
		for (var pos = 0; pos < playerIds.length; pos++) {playerIdsCopy[pos] = playerIds[pos];}
		// clear all players
		myNetCache.getGameData(gameListPlayerLeft.gameId).playerIds.clear();
		// re-add all players except the removed
		for (var pos = 0; pos < playerIdsCopy.length; pos++)
		{
			if (playerIdsCopy[pos] !== gameListPlayerLeft.playerId)
			{
				myNetCache.getGameData(gameListPlayerLeft.gameId).playerIds.push(playerIdsCopy[pos]);
			}
		}
		myGui.signalNetClientGameListPlayerLeft(gameListPlayerLeft.gameId, gameListPlayerLeft.playerId);
	};

	this.handleMsgGameListSpectatorJoined = function(gameListSpectatorJoined)
	{
		myNetCache.getGameData(gameListSpectatorJoined.gameId).spectatorIds.push(gameListSpectatorJoined.playerId);
		myGui.signalNetClientGameListSpectatorJoined(gameListSpectatorJoined.gameId, gameListSpectatorJoined.playerId);
		self.requestPlayerInfo(gameListSpectatorJoined.playerId);
	};

	this.handleMsgGameListSpectatorLeft = function(gameListSpectatorLeft)
	{
		var spectatorIds = myNetCache.getGameData(gameListSpectatorLeft.gameId).spectatorIds;
		// create a copy of all spectators
		var spectatorIdsCopy = new Array();
		for (var pos = 0; pos < spectatorIds.length; pos++) {spectatorIdsCopy[pos] = spectatorIds[pos];}
		// clear all spectators
		myNetCache.getGameData(gameListSpectatorLeft.gameId).spectatorIds.clear();
		// re-add all spectators except the removed
		for (var pos = 0; pos < spectatorIdsCopy.length; pos++)
		{
			if (spectatorIdsCopy[pos] !== gameListSpectatorLeft.playerId)
			{
				myNetCache.getGameData(gameListSpectatorLeft.gameId).spectatorIds.push(spectatorIdsCopy[pos]);
			}
		}
		myGui.signalNetClientGameListSpectatorLeft(gameListSpectatorLeft.gameId, gameListSpectatorLeft.playerId);
	};

	this.handleMsgPlayerList = function(playerList)
	{
		if (playerList.playerListNotification === PokerTH.PlayerListMessage.PlayerListNotification.playerListNew)
		{
			self.markInitialLobbyUpdateMsg();
			myGui.signalNetClientPlayerJoined(playerList.playerId);
			self.requestPlayerInfo(playerList.playerId);
		}
		else if (playerList.playerListNotification === PokerTH.PlayerListMessage.PlayerListNotification.playerListLeft)
		{
			myGui.signalNetClientPlayerLeft(playerList.playerId);
		}
	};

	this.handleMsgPlayerInfoReply = function(playerInfoReply)
	{
		self.markInitialLobbyUpdateMsg();
		myNetCache.addPlayerData(playerInfoReply);
		myGui.signalNetClientPlayerChanged(playerInfoReply.playerId);
	};

	this.handleMsgJoinGameAck = function(joinGameAck)
	{
		var gameData = myNetCache.getGameData(joinGameAck.gameId);
		gameData.playerSeats.length = 0;
		gameData.spectatorSeats.length = 0;
		gameData.spectatorSeats.push(self.playerId);
		if (gameData.gameMode === PokerTH.NetGameMode.netGameStarted)
		{
			myGui.signalNetClientWaitHandStart(joinGameAck.gameId);
		}
		else
		{
			myGui.signalNetClientWaitGameStart(joinGameAck.gameId);
		}
	};

	this.handleMsgJoinGameFailed = function(joinGameFailed)
	{
		switch(joinGameFailed.joinGameFailureReason)
		{
			case PokerTH.JoinGameFailedMessage.JoinGameFailureReason.invalidPassword :
				myGui.signalNetClientServerMessage("This game is private and does not allow spectators.");
				break;
			case PokerTH.JoinGameFailedMessage.JoinGameFailureReason.notInvited :
				myGui.signalNetClientServerMessage("This game is invite-only, you are not allowed to spectate.");
				break;
			default :
				myGui.signalNetClientServerMessage("It is not possible to spectate this game.");
				break;
		}
	};

	this.handleMsgGamePlayerJoined = function(gamePlayerJoined)
	{
		self.requestPlayerInfo(gamePlayerJoined.playerId);
	};

	this.handleMsgGamePlayerLeft = function(gamePlayerLeft)
	{
		var playerData = myNetCache.getPlayerData(gamePlayerLeft.playerId);
		if (typeof playerData.gameValues !== 'undefined')
		{
			playerData.gameValues.stayOnTable = false;
		}
	};

	this.handleMsgGameSpectatorJoined = function(gameSpectatorJoined)
	{
		var gameData = myNetCache.getGameData(gameSpectatorJoined.gameId);
		gameData.spectatorSeats.push(gameSpectatorJoined.playerId);
		myGui.signalNetClientGameSpectatorJoined(gameSpectatorJoined.playerId);
		self.requestPlayerInfo(gameSpectatorJoined.playerId);
	};

	this.handleMsgGameSpectatorLeft = function(gameSpectatorLeft)
	{
		var gameData = myNetCache.getGameData(gameSpectatorLeft.gameId);

		// create a copy of all spectators
		var spectatorIdsCopy = new Array();
		for (var pos = 0; pos < gameData.spectatorSeats.length; pos++) {spectatorIdsCopy[pos] = gameData.spectatorSeats[pos];}
		// clear all spectators
		gameData.spectatorSeats.length = 0;
		// re-add all spectators except the removed
		for (var pos = 0; pos < spectatorIdsCopy.length; pos++)
		{
			if (spectatorIdsCopy[pos] !== gameSpectatorLeft.playerId)
			{
				gameData.spectatorSeats.push(spectatorIdsCopy[pos]);
			}
		}
		myGui.signalNetClientGameSpectatorLeft(gameSpectatorLeft.playerId);
	};

	this.handleMsgGameStartInitial = function(gameStartInitial)
	{
		self.subscribeLobbyMessages(false);
		myNetCache.initializeGame(gameStartInitial, false);
		myGui.signalNetClientShowGameTable(gameStartInitial.gameId);
	};

	this.handleMsgGameStartRejoin = function(gameStartRejoin)
	{
		self.subscribeLobbyMessages(false);
		myNetCache.initializeGame(gameStartRejoin, true);
		myGui.signalNetClientShowGameTable(gameStartRejoin.gameId);
	};

	this.handleMsgHandStart = function(handStart)
	{
		myNetCache.getNetGame().resetActions(true);
		myNetCache.getNetGame().initNewHand(handStart);
		myNetCache.getNetGame().getNetHand().start(handStart);
		myGui.signalNetClientHandStart();
	};

	this.handleMsgPlayersTurn = function(playersTurn)
	{
		myNetCache.getNetGame().getNetHand().setCurrentPlayerId(playersTurn.playerId);
		if (myNetCache.getNetGame().getNetHand().getRound() !== playersTurn.gameState)
		{
			myNetCache.getNetGame().collectSets();
			myNetCache.getNetGame().resetActions(false);
			myNetCache.getNetGame().getNetHand().setRound(playersTurn.gameState);
		}
		myGui.signalNetClientCurrentPlayerChanged();
	};

	this.handleMsgPlayersActionDone = function(playersActionDone)
	{
		var playerData = myNetCache.getPlayerData(playersActionDone.playerId);
		playerData.gameValues.myAction = playersActionDone.playerAction;
		playerData.gameValues.mySet = playersActionDone.totalPlayerBet;
		playerData.gameValues.myCash = playersActionDone.playerMoney;
		myNetCache.getNetGame().getNetHand().setHighestSet(playersActionDone.highestSet);
		myNetCache.getNetGame().getNetHand().setMinimumRaise(playersActionDone.minimumRaise);
		myGui.signalNetClientPlayersActionDone(playersActionDone.playerId);
	};

	this.handleMsgDealFlopCards = function(dealFlopCards)
	{
		// Reset current player.
		myNetCache.getNetGame().getNetHand().setCurrentPlayerId(0);
		myGui.signalNetClientCurrentPlayerChanged();

		var tableCards = myNetCache.getNetGame().getNetHand().getTableCards();
		tableCards.push(dealFlopCards.flopCard1);
		tableCards.push(dealFlopCards.flopCard2);
		tableCards.push(dealFlopCards.flopCard3);
		myGui.signalNetClientDealFlopCards();
	};

	this.handleMsgDealTurnCard = function(dealTurnCard)
	{
		// Reset current player.
		myNetCache.getNetGame().getNetHand().setCurrentPlayerId(0);
		myGui.signalNetClientCurrentPlayerChanged();

		myNetCache.getNetGame().resetActions(false);
		myNetCache.getNetGame().getNetHand().getTableCards().push(dealTurnCard.turnCard);
		myGui.signalNetClientDealTurnCard();
	};

	this.handleMsgDealRiverCard = function(dealRiverCard)
	{
		// Reset current player.
		myNetCache.getNetGame().getNetHand().setCurrentPlayerId(0);
		myGui.signalNetClientCurrentPlayerChanged();

		myNetCache.getNetGame().resetActions(false);
		myNetCache.getNetGame().getNetHand().getTableCards().push(dealRiverCard.riverCard);
		myGui.signalNetClientDealRiverCard();
	};

	this.handleMsgAllInShowCards = function(allInShowCards)
	{
		for (var i = 0; i < allInShowCards.playersAllIn.length; i++)
		{
			var allInData = allInShowCards.playersAllIn[i];
			var playerData = myNetCache.getPlayerData(allInData.playerId);
			playerData.gameValues.myCard1 = allInData.allInCard1;
			playerData.gameValues.myCard2 = allInData.allInCard2;
			myGui.signalNetClientShowCards(allInData.playerId);
		}
	};

	this.handleMsgEndOfHandShowCards = function(endOfHandShowCards)
	{
		myNetCache.getNetGame().collectSets();
		// Reset current player.
		myNetCache.getNetGame().getNetHand().setCurrentPlayerId(0);
		myGui.signalNetClientCurrentPlayerChanged();

		for (var i = 0; i < endOfHandShowCards.playerResults.length; i++)
		{
			var playerResult = endOfHandShowCards.playerResults[i];
			var hasShownCards = myNetCache.hasPlayerCards(playerResult.playerId);
			myNetCache.setPlayerResult(playerResult);
			myNetCache.getNetGame().getNetHand().updateHighestCardsValue(playerResult.cardsValue);
			// Only send the "show cards" GUI signal if the player did not show cards before
			if (!hasShownCards)
			{
				myGui.signalNetClientShowCards(playerResult.playerId);
			}
		}
		myGui.signalNetClientEndOfHand();
	};

	this.handleMsgEndOfHandHideCards = function(endOfhandHideCards)
	{
		myNetCache.getNetGame().collectSets();
		// Reset current player.
		myNetCache.getNetGame().getNetHand().setCurrentPlayerId(0);
		myGui.signalNetClientCurrentPlayerChanged();

		var playerData = myNetCache.getPlayerData(endOfhandHideCards.playerId);
		playerData.gameValues.myCash = endOfhandHideCards.playerMoney;
		playerData.gameValues.moneyWon = endOfhandHideCards.moneyWon;
		myGui.signalNetClientEndOfHand();
	};

	this.handleMsgAfterHandShowCards = function(afterHandShowCards)
	{
		myNetCache.setPlayerResult(afterHandShowCards.playerResult);
		myGui.signalNetClientShowCards(afterHandShowCards.playerResult.playerId);
	};

	this.handleMsgRemovedFromGame = function(removedFromGame)
	{
		myGui.signalNetClientRemovedFromGame(removedFromGame.gameId);
		self.beginInitialLobbyUpdate();
		self.subscribeLobbyMessages(true);
		switch(removedFromGame.removedFromGameReason)
		{
			case PokerTH.RemovedFromGameMessage.RemovedFromGameReason.gameIsFull :
				myGui.signalNetClientServerMessage("This game already has the maximum number of spectators.");
				break;
			case PokerTH.RemovedFromGameMessage.RemovedFromGameReason.kickedFromGame :
				myGui.signalNetClientServerMessage("You were kicked from the game.");
				break;
			case PokerTH.RemovedFromGameMessage.RemovedFromGameReason.kickedFromGame :
				myGui.signalNetClientServerMessage("You were kicked from the game.");
				break;
			case PokerTH.RemovedFromGameMessage.RemovedFromGameReason.gameClosed :
				myGui.signalNetClientServerMessage("The game was closed.");
				break;
		}
	};

	this.handleMsgPlayerIdChanged = function(playerIdChanged)
	{
		var oldPlayerData = myNetCache.getPlayerData(playerIdChanged.oldPlayerId);
		var newPlayerData = myNetCache.getPlayerData(playerIdChanged.newPlayerId);
		if (typeof newPlayerData === 'undefined')
		{
				newPlayerData = new Object();
				newPlayerData.playerId = playerIdChanged.newPlayerId;
				myNetCache.addPlayerData(newPlayerData);
		}
		newPlayerData.gameValues = oldPlayerData.gameValues;
		newPlayerData.gameValues.stayOnTable = true;
		myNetCache.getNetGame().changePlayerId(playerIdChanged.oldPlayerId, playerIdChanged.newPlayerId);
		myGui.signalNetClientPlayerIdChanged(playerIdChanged.oldPlayerId, playerIdChanged.newPlayerId);
	};

	this.handleMsgChat = function(chat)
	{
		switch(chat.chatType)
		{
			case PokerTH.ChatMessage.ChatType.chatTypeLobby :
				myGui.signalNetClientLobbyChatMsg(chat.playerId, chat.chatText);
				break;
			case PokerTH.ChatMessage.ChatType.chatTypeGame :
				myGui.signalNetClientGameChatMsg(chat.gameId, chat.playerId, chat.chatText);
				break;
			case PokerTH.ChatMessage.ChatType.chatTypeBot :
				myGui.signalNetClientChatBotNotice(chat.chatText);
				break;
			case PokerTH.ChatMessage.ChatType.chatTypeBroadcast :
				myGui.signalNetClientGlobalNotice(chat.chatText);
				break;
			case PokerTH.ChatMessage.ChatType.chatTypePrivate :
				myGui.signalNetClientPrivateChatMsg(chat.playerId, chat.chatText);
				break;
		}
	};

	this.handleMsgTimeoutWarning = function(timeoutWarning)
	{
		myGui.signalNetClientShowTimeoutDialog(timeoutWarning.timeoutReason, timeoutWarning.remainingSeconds);
	};

	this.handleMsgError = function(error)
	{
		var reasonText = "General error.";
		switch(error.errorReason) {
			case PokerTH.ErrorMessage.ErrorReason.initVersionNotSupported :
				reasonText = "This version of the PokerTH Webclient is not supported by the server.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.initServerFull :
				reasonText = "The server is full. Please try again later.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.initAuthFailure :
				reasonText = "Authentication failed.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.initPlayerNameInUse :
				reasonText = "Your player name is already in use.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.initInvalidPlayerName :
				reasonText = "Your player name is invalid.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.initServerMaintenance :
				reasonText = "The server is down for maintenance.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.initBlocked :
				reasonText = "Login is not possible at this moment. Please try again later.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.avatarTooLarge :
				reasonText = "Your avatar file is too large. Please choose a different avatar.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.invalidPacket :
				reasonText = "The server has received an invalid packet.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.invalidState :
				reasonText = "Invalid state.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.kickedFromServer :
				reasonText = "You were kicked from the server.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.bannedFromServer :
				reasonText = "You were banned from the server.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.blockedByServer :
				reasonText = "This account is blocked.";
				break;
			case PokerTH.ErrorMessage.ErrorReason.sessionTimeout :
				reasonText = "Your session timed out. Feel free to come back!";
				break;
		}
		myGui.signalNetClientServerError(reasonText);
	};

	// Base64 "ws://46.38.236.60:7233/pokerthwebsocket"
	this.remoteServer = "d3M6Ly80Ni4zOC4yMzYuNjA6NzIzMy9wb2tlcnRod2Vic29ja2V0";
	//this.remoteServer = "d3M6Ly80Ni4zOC4yMzYuNjA6NzIzMi9wb2tlcnRod2Vic29ja2V0";

	this.spectateGame = function(gameId)
	{
		// Join game as spectator.
		var request = new PokerTH.PokerTHMessage;
		request.messageType = PokerTH.PokerTHMessage.PokerTHMessageType.Type_JoinExistingGameMessage;
		request.joinExistingGameMessage = new PokerTH.JoinExistingGameMessage;
		request.joinExistingGameMessage.gameId = gameId;
		request.joinExistingGameMessage.autoLeave = true;
		request.joinExistingGameMessage.spectateOnly = true;
		self.sendMsg(request);
	};

	this.leaveGame = function(gameId)
	{
		var request = new PokerTH.PokerTHMessage;
		request.messageType = PokerTH.PokerTHMessage.PokerTHMessageType.Type_LeaveGameRequestMessage;
		request.leaveGameRequestMessage = new PokerTH.LeaveGameRequestMessage;
		request.leaveGameRequestMessage.gameId = gameId;
		self.sendMsg(request);
	};
	
	this.resetServerTimeout = function()
	{
		var request = new PokerTH.PokerTHMessage;
		request.messageType = PokerTH.PokerTHMessage.PokerTHMessageType.Type_ResetTimeoutMessage;
		request.resetTimeoutMessage = new PokerTH.ResetTimeoutMessage;
		self.sendMsg(request);
	};

	this.subscribeLobbyMessages = function(subscribe)
	{
		var request = new PokerTH.PokerTHMessage;
		request.messageType = PokerTH.PokerTHMessage.PokerTHMessageType.Type_SubscriptionRequestMessage;
		request.subscriptionRequestMessage = new PokerTH.SubscriptionRequestMessage;
		if (subscribe)
		{
			request.subscriptionRequestMessage.subscriptionAction = PokerTH.SubscriptionRequestMessage.SubscriptionAction.resubscribeGameList;
		}
		else
		{
			request.subscriptionRequestMessage.subscriptionAction = PokerTH.SubscriptionRequestMessage.SubscriptionAction.unsubscribeGameList;
		}
		self.sendMsg(request);
	};

	this.requestPlayerInfo = function(playerId)
	{
		if (!self.requestedPlayerIds.hasOwnProperty(playerId))
		{
			// Request player info.
			var request = new PokerTH.PokerTHMessage;
			request.messageType = PokerTH.PokerTHMessage.PokerTHMessageType.Type_PlayerInfoRequestMessage;
			request.playerInfoRequestMessage = new PokerTH.PlayerInfoRequestMessage;
			request.playerInfoRequestMessage.playerId = new Array();
			request.playerInfoRequestMessage.playerId.push(playerId);
			self.sendMsg(request);
			self.requestedPlayerIds[playerId] = 1;
		}
	};

	this.beginInitialLobbyUpdate = function()
	{
		myGui.signalBeginInitialLobbyUpdate();
		self.guiUpdateTimer = window.setTimeout(function(){self.endInitialLobbyUpdate();}, self.guiUpdateTimout);
	};
	
	this.markInitialLobbyUpdateMsg = function()
	{
		if (self.guiUpdateTimer !== null)
		{
			window.clearTimeout(self.guiUpdateTimer);
			self.guiUpdateTimer = window.setTimeout(function(){self.endInitialLobbyUpdate();}, self.guiUpdateTimout);
		}
	};

	this.endInitialLobbyUpdate = function()
	{
		self.guiUpdateTimer = null;
		myGui.signalEndInitialLobbyUpdate();		
	};
}

function initEventHandler()
{
	myNetEventHandler = new NetEventHandler();
}

window.addEventListener("load", initEventHandler, false);