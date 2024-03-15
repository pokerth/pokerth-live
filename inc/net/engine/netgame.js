/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
/**
 * class NetGame
 * @constructor
 */
function NetGame()
{
	var self = this;
	this.gameData = new Object();
	this.netHand = new NetHand();
	
	this.initialize = function(gameData, gameStartInitial, joinExisting)
	{
		self.gameData = gameData;
		// Make a copy of the seats list.
		gameData.playerSeats.length = 0;
		var numSeats = joinExisting ? gameStartInitial.rejoinPlayerData.length : gameStartInitial.playerSeats.length;
		for (var seatPos = 0; seatPos < numSeats; seatPos++)
		{
			var tmpPlayerId = 0;
			var tmpStartMoney = 0;
			if (joinExisting)
			{
				tmpPlayerId = gameStartInitial.rejoinPlayerData[seatPos].playerId;
				tmpStartMoney = gameStartInitial.rejoinPlayerData[seatPos].playerMoney;
			}
			else
			{
				tmpPlayerId = gameStartInitial.playerSeats[seatPos];
				tmpStartMoney = gameData.gameInfo.startMoney;
			}
			gameData.playerSeats[seatPos] = tmpPlayerId;

			// Initialize cash and set of players.
			var playerData = myNetCache.getPlayerData(tmpPlayerId);
			if (typeof playerData === 'undefined')
			{
				playerData = new Object();
				playerData.playerId = tmpPlayerId;
				myNetCache.addPlayerData(playerData);
			}
			playerData.gameValues = new Object();
			playerData.gameValues.myCash = tmpStartMoney;
			playerData.gameValues.mySet = 0;
			playerData.gameValues.myTotalBet = 0;
			playerData.gameValues.myAction = 0;
			playerData.gameValues.myCard1 = 0;
			playerData.gameValues.myCard2 = 0;
			playerData.gameValues.moneyWon = 0;
			playerData.gameValues.bestHandPosition = new Array();
			playerData.gameValues.cardsValue = 0;
			playerData.gameValues.active = true;
			playerData.gameValues.stayOnTable = true;
			playerData.gameValues.sessionActive = true;
		}
		
		if (joinExisting)
		{
			self.netHand.setNum(gameStartInitial.handNum);
		}
	};

	this.resetActions = function(resetAllActions)
	{
		for (var playerPos = 0; playerPos < self.gameData.playerSeats.length; playerPos++)
		{
			var playerData = myNetCache.getPlayerData(self.gameData.playerSeats[playerPos]);
			if (resetAllActions || (playerData.gameValues.myAction !== PokerTH.NetPlayerAction.netActionFold && playerData.gameValues.myAction !== PokerTH.NetPlayerAction.netActionAllIn))
			{
				playerData.gameValues.myAction = 0;
			}
		}
	};

	this.collectSets = function()
	{
		var pot = 0;
		for (var playerPos = 0; playerPos < self.gameData.playerSeats.length; playerPos++)
		{
			var playerData = myNetCache.getPlayerData(self.gameData.playerSeats[playerPos]);
			playerData.gameValues.myTotalBet += playerData.gameValues.mySet;
			playerData.gameValues.mySet = 0;
			pot += playerData.gameValues.myTotalBet;
		}
		self.netHand.setPot(pot);
	};

	this.initNewHand = function(handStart)
	{
		for (var playerPos = 0; playerPos < self.gameData.playerSeats.length; playerPos++)
		{
			var playerData = myNetCache.getPlayerData(self.gameData.playerSeats[playerPos]);
			playerData.gameValues.myTotalBet = 0;
			playerData.gameValues.mySet = 0;
			playerData.gameValues.moneyWon = 0;
			playerData.gameValues.myCard1 = 0;
			playerData.gameValues.myCard2 = 0;
			playerData.gameValues.bestHandPosition = new Array();
			playerData.gameValues.cardsValue = 0;
			playerData.gameValues.active = playerData.gameValues.myCash > 0;
			switch (handStart.seatStates[playerPos])
			{
				case PokerTH.NetPlayerState.netPlayerStateNormal :
					playerData.gameValues.sessionActive = true;
					break;
				case PokerTH.NetPlayerState.netPlayerStateSessionInactive :
					playerData.gameValues.sessionActive = false;
					break;
				case PokerTH.NetPlayerState.netPlayerStateNoMoney :
					playerData.gameValues.myCash = 0;
					break;
			}
		}
	};
	
	this.changePlayerId = function(oldPlayerId, newPlayerId)
	{
		for (var seatPos = 0; seatPos < self.gameData.playerSeats.length; seatPos++)
		{
			if (self.gameData.playerSeats[seatPos] === oldPlayerId)
			{
				self.gameData.playerSeats[seatPos] = newPlayerId;
			}
		}
		if (self.getNetHand().getCurrentPlayerId() === oldPlayerId)
		{
			self.getNetHand().setCurrentPlayerId(newPlayerId);
		}
		if (self.getNetHand().getDealerId() === oldPlayerId)
		{
			self.getNetHand().setDealerId(newPlayerId);
		}
	};

	this.getGameData = function()
	{
		return self.gameData;
	};

	this.getNetHand = function()
	{
		return self.netHand;
	};
}
