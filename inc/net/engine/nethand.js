/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
/**
 * class NetHand
 * @constructor
 */
function NetHand()
{
	var self = this;
	this.num = 0;
	this.pot = 0;
	this.smallBlind = 0;
	this.dealerId = 0;
	this.currentPlayerId = 0;
	this.highestSet = 0;
	this.minimumRaise = 0;
	this.round = 0;
	this.tableCards = new Array();
	this.highestCardsValue = 0;

	this.start = function(handStart)
	{
		self.num++;
		self.pot = 0;
		self.smallBlind = handStart.smallBlind;
		self.dealerId = handStart.dealerPlayerId;
		self.currentPlayerId = 0;
		self.highestSet = 0;
		self.minimumRaise = 0;
		self.round = 0;
		self.tableCards.length = 0;
		self.highestCardsValue = 0;
	};

	this.setNum = function(handNum)
	{
		self.num = handNum;
	};

	this.setDealerId = function(playerId)
	{
		self.dealerId = playerId;
	};

	this.setCurrentPlayerId = function(playerId)
	{
		self.currentPlayerId = playerId;
	};

	this.setHighestSet = function(newHighestSet)
	{
		self.highestSet = newHighestSet;
	};

	this.setMinimumRaise = function(newMinimumRaise)
	{
		self.minimumRaise = newMinimumRaise;
	};

	this.setRound = function(newRound)
	{
		self.round = newRound;
	};

	this.setPot = function(newPot)
	{
		self.pot = newPot;
	};

	this.updateHighestCardsValue = function(cardsValue)
	{
		if (cardsValue > self.highestCardsValue)
		{
			self.highestCardsValue = cardsValue;
		}
	};

	this.getNum = function()
	{
		return self.num;
	};

	this.getPot = function()
	{
		return self.pot;
	};

	this.getSmallBlind = function()
	{
		return self.smallBlind;
	};

	this.getDealerId = function()
	{
		return self.dealerId;
	};

	this.getCurrentPlayerId = function()
	{
		return self.currentPlayerId;
	};

	this.getHighestSet = function()
	{
		return self.highestSet;
	};

	this.getMinimumRaise = function()
	{
		return self.minimumRaise;
	};

	this.getRound = function()
	{
		return self.round;
	};

	this.getTableCards = function()
	{
		return self.tableCards;
	};

	this.getHighestCardsValue = function()
	{
		return self.highestCardsValue;
	};
}
