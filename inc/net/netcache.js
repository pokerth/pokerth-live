/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myNetCache = new Object();

/**
 * class NetCache
 * @constructor
 */
function NetCache()
{
	var self = this;
	this.gameDataMap = new Object();
	this.playerDataMap = new Object();
	this.engineCallback = new Object();
	this.netGame = new Object();

	this.setCallback = function(callback)
	{
		self.engineCallback = callback;
	};

	this.addGameData = function(gameData)
	{
		gameData.playerSeats = new Array();
		gameData.spectatorSeats = new Array();
		self.gameDataMap[gameData.gameId] = gameData;
	};

	this.getGameData = function(gameId)
	{
		return self.gameDataMap[gameId];
	};

	this.removeGameData = function(gameId)
	{
		delete self.gameDataMap[gameId];
	};

	this.addPlayerData = function(playerData)
	{
		// Include a previous created PlayerData object
		if (self.playerDataMap.hasOwnProperty(playerData.playerId))
		{
			var oldPlayerData = self.getPlayerData(playerData.playerId);
			if (typeof oldPlayerData.gameValues !== 'undefined')
			{
				playerData.gameValues = oldPlayerData.gameValues;
			}
		}

		playerData.avatarFileName = "";
		if (typeof playerData.playerInfoData !== 'undefined')
		{
			var avatarData = playerData.playerInfoData.avatarData;
			if (typeof avatarData !== 'undefined')
			{
				playerData.avatarFileName = myNetHelper.convertBytesToHexString(avatarData.avatarHash)
					+ myNetHelper.convertAvatarTypeToString(avatarData.avatarType);
			}
		}
		self.playerDataMap[playerData.playerId] = playerData;
	};

	this.getPlayerData = function(playerId)
	{
		return self.playerDataMap[playerId];
	};

	this.hasPlayerData = function(playerId)
	{
		return self.playerDataMap.hasOwnProperty(playerId) && typeof self.playerDataMap[playerId].playerInfoData !== 'undefined';
	};

	this.hasPlayerCards = function(playerId)
	{
		var playerData = self.getPlayerData(playerId);
		return playerData.gameValues.myCard1 !== playerData.gameValues.myCard2;
	};

	this.setPlayerResult = function(playerResult)
	{
		var playerData = self.getPlayerData(playerResult.playerId);
		playerData.gameValues.myCard1 = playerResult.resultCard1;
		playerData.gameValues.myCard2 = playerResult.resultCard2;
		playerData.gameValues.myCash = playerResult.playerMoney;
		playerData.gameValues.moneyWon = playerResult.moneyWon;
		playerData.gameValues.bestHandPosition = playerResult.bestHandPosition;
		playerData.gameValues.cardsValue = playerResult.cardsValue;
	};

	this.initializeGame = function(gameStartInitial, joinExisting)
	{
		var gameData = myNetCache.getGameData(gameStartInitial.gameId);
		self.netGame = new NetGame();
		self.netGame.initialize(gameData, gameStartInitial, joinExisting);
	};

	this.getNetGame = function()
	{
		return self.netGame;
	};

	this.hasNetGame = function()
	{
		return self.netGame instanceof NetGame;
	};

	this.callbackSpectateGame = function(gameId)
	{
		self.engineCallback.spectateGame(gameId);
	};

	this.callbackLeaveGame = function(gameId)
	{
		self.engineCallback.leaveGame(gameId);
	};

	this.callbackResetServerTimeout = function()
	{
		self.engineCallback.resetServerTimeout();
	};
}

function initNetCache()
{
	myNetCache = new NetCache();
}

window.addEventListener("load", initNetCache, false);
