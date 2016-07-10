/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myCards = new Object();

/**
 * class CardsImpl
 * @constructor
 */
function CardsImpl()
{
	var self = this;
	this.holeCardHeight = 0;
	this.holeCardWidth = 0;
	this.tableCardHeight = 0;
	this.tableCardWidth = 0;
	this.cardsCssZIndex = 6;
	this.shrinkCardsFactor = parseInt(myHeight*4/100);
	this.mySeatsArray = new Array();
	this.myCardHolderArray = new Array();
	this.holeCardsArray = new Array();
	this.tableCardsArray = new Array();
	this.tableCardsArray.push(new Object(), new Object(), new Object(), new Object(), new Object());
	this.holeCardsArray.push(new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()), new Array(new Object(), new Object()));
	this.dealFlopCardsAnimationStepsCounter = 0;
	this.dealTurnCardAnimationStepsCounter = 0;
	this.dealRiverCardAnimationStepsCounter = 0;
	this.STATE = {
	  NONE : {value: 0 }, 
	  FRONT: {value: 1 }, 
	  FLIPSIDE : {value: 2 },
	  FLIPSIDE_TURN_OVER_ANIMATION : {value: 3 },
	  FLIPSIDE_DEAL_ANIMATION : {value: 4 },
	  FRONT_TRANSPARENT: {value: 5 }, 
	  FLIPSIDE_TRANSPARENT: {value: 6 }
	};
	this.TYPE = {
	  HOLECARD : {value: 0 }, 
	  TABLECARD: {value: 1 }
		  
	};
	for(var i=0; i < this.holeCardsArray.length; i++) {
		this.holeCardsArray[i][0].id = "Player"+i+"_CardA"; 
		this.holeCardsArray[i][0].state = this.STATE.NONE; 
		this.holeCardsArray[i][1].id = "Player"+i+"_CardB";
		this.holeCardsArray[i][1].state = this.STATE.NONE; 
		$("#gameArea").append('<div id="'+this.holeCardsArray[i][0].id+'"></div>');
		$("#gameArea").append('<div id="'+this.holeCardsArray[i][1].id+'"></div>');
		$("#"+this.holeCardsArray[i][0].id).hide();
		$("#"+this.holeCardsArray[i][1].id).hide();
	}	
	for(var i=0; i < this.tableCardsArray.length; i++) {
		this.tableCardsArray[i].id = "TableCard"+i; 
		this.tableCardsArray[i].state = this.STATE.NONE;
		$("#gameArea").append('<div id="'+this.tableCardsArray[i].id+'"></div>');
		$("#"+this.tableCardsArray[i].id).hide();
	}	

	this.foldCards = function(seat)
	{
		var dealerButtonPosition = self.getDealStartPosition(self.TYPE.HOLECARD);
		$("#"+self.holeCardsArray[seat][0].id).animate({
			left: dealerButtonPosition[0]+'px',
			top: dealerButtonPosition[1]+'px',
			opacity:'0.0',
			height: (self.holeCardsArray[seat][0].myCardHeight-self.shrinkCardsFactor)+'px',
			width: (self.holeCardsArray[seat][0].myCardWidth-self.shrinkCardsFactor)+'px'
			}, 500,  function(thisSeat) {
				self.holeCardsArray[thisSeat][0].state = self.STATE.NONE;
			}(seat) );
			
		$("#"+self.holeCardsArray[seat][1].id).animate({
			left: dealerButtonPosition[0]+'px',
			top: dealerButtonPosition[1]+'px',
			opacity:'0.0',
			height: (self.holeCardsArray[seat][1].myCardHeight-self.shrinkCardsFactor)+'px',
			width: (self.holeCardsArray[seat][1].myCardWidth-self.shrinkCardsFactor)+'px'
			}, 500, function(thisSeat) {
				self.holeCardsArray[thisSeat][1].state = self.STATE.NONE;
			}(seat));
	};

	this.showHoleCards = function(playerId)
	{
		var card0 = self.holeCardsArray[self.getPlayerSeat(playerId)][0];
		var card1 = self.holeCardsArray[self.getPlayerSeat(playerId)][1];
		card0.state = self.STATE.FLIPSIDE_TURN_OVER_ANIMATION;
		card1.state = self.STATE.FLIPSIDE_TURN_OVER_ANIMATION;
		card0.myCardValue = myNetCache.getPlayerData(playerId).gameValues.myCard1;
		card1.myCardValue = myNetCache.getPlayerData(playerId).gameValues.myCard2;
		var speed = 800;
		var delay = 800;
		$("#"+card0.id).empty();
		$("#"+card1.id).empty();
		$("#"+card0.id).css( {
		'background-image': 'none'
		} ).append("<img id='"+card0.id+"_img' border=0 style='z-index: "+self.cardsCssZIndex+3+"; display: block; margin-left: auto; margin-right: auto; width: "+card0.myCardWidth+"px; height: "+card0.myCardHeight+"px;' src='"+self.getCardSrcPath("flipside")+"' />");
		$("#"+card0.id+"_img").delay(delay).animate({
		'width' : '0px'
		}, speed/2, function(){
			$("#"+card0.id+"_img").attr('src', self.getCardSrcPath(card0.myCardValue));
			$("#"+card0.id+"_img").animate({
				'width' : card0.myCardWidth+'px'
			}, speed/2, function(){
				$("#"+card0.id).css( {
				'background-image': 'url('+self.getCardSrcPath(card0.myCardValue)+')'
				});
				$("#"+card0.id).empty();
				card0.state = self.STATE.FRONT;
			});
		});
		$("#"+card1.id).css( {
		'background-image': 'none'
		} ).append("<img id='"+card1.id+"_img' border=0 style='z-index: "+self.cardsCssZIndex+3+"; display: block; margin-left: auto; margin-right: auto; width: "+card1.myCardWidth+"px; height: "+card1.myCardHeight+"px;' src='"+self.getCardSrcPath("flipside")+"' />");
		$("#"+card1.id+"_img").delay(delay).animate({
		'width' : '0px'
		}, speed/2, function(){
			$("#"+card1.id+"_img").attr('src', self.getCardSrcPath(card1.myCardValue));
			$("#"+card1.id+"_img").animate({
				'width' : card1.myCardWidth+'px'
			}, speed/2, function(){
				$("#"+card1.id).css( {
				'background-image': 'url('+self.getCardSrcPath(card1.myCardValue)+')'
				});
				$("#"+card1.id).empty();
				card1.state = self.STATE.FRONT;
			});
		});
	};
	
	this.dealHoleCards = function()
 	{
		var delayBetweenDealsCardA = 60;
		var delayBetweenDealsCardB = 70;
		var dealAnimationSpeed = 1000;
		var dealerButtonPositionArray = self.getDealStartPosition(self.TYPE.HOLECARD);
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		var dealerSeat = dealerButtonPositionArray[2];
		for (var i = 0; i < playerSeatsArray.length; i++) {
			if(myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.active) {
				var seatIt = self.getPlayerSeat(playerSeatsArray[i]);
				self.holeCardsArray[seatIt][0].state = self.STATE.FLIPSIDE_DEAL_ANIMATION;
				self.holeCardsArray[seatIt][1].state = self.STATE.FLIPSIDE_DEAL_ANIMATION;
				$("#"+self.holeCardsArray[seatIt][0].id).css( {
				'background-image': 'url("'+self.getCardSrcPath("flipside")+'")',
				'background-size': 'contain',
				'background-repeat' : 'no-repeat',
				'background-position' : 'top left',
				'height' : (self.holeCardsArray[seatIt][0].myCardHeight-self.shrinkCardsFactor)+'px',
				'width' : (self.holeCardsArray[seatIt][0].myCardWidth-self.shrinkCardsFactor)+'px',
				'top' : dealerButtonPositionArray[1]+'px',
				'left' : dealerButtonPositionArray[0]+'px',
				'position' : 'absolute',
				'opacity' :'0.6',
				'z-index' : self.cardsCssZIndex
				} ).show().delay(delayBetweenDealsCardA*(i+1)).animate({
					left: self.holeCardsArray[seatIt][0].myX+'px',
					top: self.holeCardsArray[seatIt][0].myY+'px',
					opacity:'1.0',
					height: self.holeCardsArray[seatIt][0].myCardHeight+'px',
					width: self.holeCardsArray[seatIt][0].myCardWidth+'px'
					}, dealAnimationSpeed, function(seat){
						self.holeCardsArray[seat][0].state = self.STATE.FLIPSIDE;
					}(seatIt) );

				$("#"+self.holeCardsArray[seatIt][1].id).css( {
				'background-image': 'url("'+self.getCardSrcPath("flipside")+'")',
				'background-size': 'contain',
				'background-repeat' : 'no-repeat',
				'background-position' : 'top left',
				'height' : (self.holeCardsArray[seatIt][1].myCardHeight-self.shrinkCardsFactor)+'px',
				'width' : (self.holeCardsArray[seatIt][1].myCardWidth-self.shrinkCardsFactor)+'px',
				'top' : dealerButtonPositionArray[1]+'px',
				'left' : dealerButtonPositionArray[0]+'px',
				'position' : 'absolute',
				'opacity' :'0.6',
				'z-index' : self.cardsCssZIndex
				} ).show().delay(delayBetweenDealsCardB*(i+1)).animate({
					left: self.holeCardsArray[seatIt][1].myX+'px',
					top: self.holeCardsArray[seatIt][1].myY+'px',
					opacity:'1.0',
					height: self.holeCardsArray[seatIt][1].myCardHeight+'px',
					width: self.holeCardsArray[seatIt][1].myCardWidth+'px'
					}, dealAnimationSpeed, function(seat){
						self.holeCardsArray[seat][1].state = self.STATE.FLIPSIDE;	
				}(seatIt));
			}
		}
	};

	this.dealTableCards = function(beRo)
 	{
		var dealAnimationSpeed = 800;
		var dealerButtonPositionArray = self.getDealStartPosition(self.TYPE.TABLECARD);
		var dealerSeat = dealerButtonPositionArray[2];
		var delayBetweenDeals = 80;
		var delayBeforeTurn = 300;
		switch(beRo.value) {
			case 1: { //FLOP
				for(i=0; i < 3; i++) {
					self.tableCardsArray[i].state = self.STATE.FLIPSIDE_DEAL_ANIMATION;
					self.tableCardsArray[i].myCardValue = myNetCache.getNetGame().getNetHand().getTableCards()[i];
					self.dealOneTableCard(dealerButtonPositionArray, self.tableCardsArray[i], (delayBetweenDeals*(i+1)), dealAnimationSpeed);
					$("#"+self.tableCardsArray[i].id).promise().done( function(card, delay){ self.flipOneTableCard(card, delay) }(self.tableCardsArray[i], (delayBeforeTurn*((i+1)+(i+1)))) );
				}
			}
			break;
			case 2: {	
				self.tableCardsArray[3].state = self.STATE.FLIPSIDE_DEAL_ANIMATION;
				self.tableCardsArray[3].myCardValue = myNetCache.getNetGame().getNetHand().getTableCards()[3];
				self.dealOneTableCard(dealerButtonPositionArray, self.tableCardsArray[3], (delayBetweenDeals), dealAnimationSpeed);
				$("#"+self.tableCardsArray[3].id).promise().done( function(card, delay){ self.flipOneTableCard(card, delay) }(self.tableCardsArray[3], delayBeforeTurn) );
			}
			break;
			case 3: {
				self.tableCardsArray[4].state = self.STATE.FLIPSIDE_DEAL_ANIMATION;
				self.tableCardsArray[4].myCardValue = myNetCache.getNetGame().getNetHand().getTableCards()[4];
				self.dealOneTableCard(dealerButtonPositionArray, self.tableCardsArray[4], (delayBetweenDeals), dealAnimationSpeed);
				$("#"+self.tableCardsArray[4].id).promise().done( function(card, delay){ self.flipOneTableCard(card, delay) }(self.tableCardsArray[4], delayBeforeTurn) );
			}
			break;
			default: { console.log("ERROR: myCards.dealTableCards() switch default!"); }
		}
	};

	this.dealOneTableCard = function(startPosition, card, delay, speed) {
		return $("#"+card.id).css( {
				'background-image': 'url("'+self.getCardSrcPath("flipside")+'")',
				'background-size': 'contain',
				'background-repeat' : 'no-repeat',
				'background-position' : 'top left',
				'height' : (card.myCardHeight-self.shrinkCardsFactor)+'px',
				'width' : (card.myCardWidth-self.shrinkCardsFactor)+'px',
				'top' : startPosition[1]+'px',
				'left' : startPosition[0]+'px',
				'position' : 'absolute',
				'opacity' : '0.7',
				'display' : 'none',
				'z-index' : self.cardsCssZIndex
			} ).delay(delay*8).show(1).delay(delay).animate({
				'left' : card.myX+'px',
				'top' : card.myY+'px',
				'opacity' :'1.0',
				'height' : card.myCardHeight+'px',
				'width' : card.myCardWidth+'px'
			}, speed);
	};

	this.flipOneTableCard = function(card, delay) {
		var speed = 800;
		$("#"+card.id).empty();
		$("#"+card.id).css( {
		'background-image': 'none'
		} ).append("<img id='"+card.id+"_img' border=0 style='z-index: "+self.cardsCssZIndex+3+"; display: block; margin-left: auto; margin-right: auto; width: "+card.myCardWidth+"px; height: "+card.myCardHeight+"px;' src='"+self.getCardSrcPath("flipside")+"' />");
		$("#"+card.id+"_img").delay(1200+delay).animate({
		'width' : '0px'
		}, speed/2, function(){
			$("#"+card.id+"_img").attr('src', self.getCardSrcPath(card.myCardValue));
			$("#"+card.id+"_img").animate({
				'width' : card.myCardWidth+'px'
			}, speed/2, function(){
				$("#"+card.id).css( {
				'background-image': 'url('+self.getCardSrcPath(card.myCardValue)+')'
				});
				$("#"+card.id+"_img").hide();
				$("#"+card.id).empty();
				card.state = self.STATE.FRONT;
			});
		});
	};

	this.clearHoleCards = function()
 	{	
		for(i=0; i < self.holeCardsArray.length; i++) {		
			self.holeCardsArray[i][0].state = self.STATE.NONE;
			self.holeCardsArray[i][1].state = self.STATE.NONE;
			$("#"+self.holeCardsArray[i][0].id).empty();
			$("#"+self.holeCardsArray[i][1].id).empty();
		}
		self.refreshHoleCards();
	};

	this.clearTableCards = function()
 	{	
		for(i=0; i < self.tableCardsArray.length; i++) {		
			self.tableCardsArray[i].state = self.STATE.NONE;
			$("#"+self.tableCardsArray[i].id).empty();
		}
		self.refreshTableCards();
	};

	this.setupTableCards = function(cardHolderArray) 
	{
		self.myCardHolderArray = cardHolderArray;
		self.tableCardHeight = parseInt(myHeight*12.67/100);
		self.tableCardWidth = parseInt(myWidth*4.6875/100);
		var tableCardYOffset = parseInt(myHeight*0.80/100);
		var tableCardXOffset = parseInt(myWidth*0.37/100);
		for(var i=0; i < this.tableCardsArray.length; i++) {
			this.tableCardsArray[i].myX = parseInt(self.myCardHolderArray[i+1]+tableCardXOffset);
			this.tableCardsArray[i].myY = parseInt(self.myCardHolderArray[0]+tableCardYOffset);
			this.tableCardsArray[i].myCardWidth = self.tableCardWidth;
			this.tableCardsArray[i].myCardHeight = self.tableCardHeight;
		}	
	};
	
	this.setupHoleCards = function(seatsArray) 
	{
		self.mySeatsArray = seatsArray;
		self.holeCardHeight = parseInt(myHeight*12.67/100);
		self.holeCardWidth = parseInt(myWidth*4.6875/100);
		var cardAOffsetX = myHeight*10.8/100;
		var cardBOffsetX = myHeight*15/100;
		for(var i=0; i < self.holeCardsArray.length; i++) {			
			if(i >= 3 && i <= 7) {
				var cardAOffsetY = myHeight*6.4/100;
				var cardBOffsetY = myHeight*6.4/100;	
			}
			else {
				var cardAOffsetY = myHeight*1.4/100;
				var cardBOffsetY = myHeight*1.4/100;
			}
			self.holeCardsArray[i][0].myX = parseInt(self.mySeatsArray[i][0]+cardAOffsetX);
			self.holeCardsArray[i][0].myY = parseInt(self.mySeatsArray[i][1]+cardAOffsetY);
			self.holeCardsArray[i][0].myCardWidth = self.holeCardWidth;
			self.holeCardsArray[i][0].myCardHeight = self.holeCardHeight;
			self.holeCardsArray[i][1].myX = parseInt(self.mySeatsArray[i][0]+cardBOffsetX);
			self.holeCardsArray[i][1].myY = parseInt(self.mySeatsArray[i][1]+cardBOffsetY);
			self.holeCardsArray[i][1].myCardWidth = self.holeCardWidth;
			self.holeCardsArray[i][1].myCardHeight = self.holeCardHeight;
		}	
	};

	this.refreshAll = function() 
	{
		self.refreshHoleCards();
		self.refreshTableCards();
	};

	this.refreshHoleCards = function()
 	{	
		for(i=0; i < self.holeCardsArray.length; i++) {
			
			switch(self.holeCardsArray[i][0].state) {
				case self.STATE.NONE: {
					$("#"+self.holeCardsArray[i][0].id).hide();
				}
				break;
				case self.STATE.FLIPSIDE: {
					self.holeCardsArray[i][0].src = self.getCardSrcPath("flipside"); 
					$("#"+self.holeCardsArray[i][0].id).css( {
					'background-image': 'url("'+self.holeCardsArray[i][0].src+'")',
					'background-size': 'contain',
					'background-repeat' : 'no-repeat',
					'background-position' : 'top left',
					'height' : self.holeCardsArray[i][0].myCardHeight+'px',
					'width' : self.holeCardsArray[i][0].myCardWidth+'px',
					'top' : self.holeCardsArray[i][0].myY+'px',
					'left' : self.holeCardsArray[i][0].myX+'px',
					'position' : 'absolute',
					'opacity:' : '1.0',
					'z-index' : self.cardsCssZIndex
					} ).show();
				}
			    break;
				case self.STATE.FRONT: {
					self.holeCardsArray[i][0].src = self.getCardSrcPath(self.holeCardsArray[i][0].myCardValue);
					$("#"+self.holeCardsArray[i][0].id).css( {
					'background-image': 'url("'+self.holeCardsArray[i][0].src+'")',
					'background-size': 'contain',
					'background-repeat' : 'no-repeat',
					'background-position' : 'top left',
					'height' : self.holeCardsArray[i][0].myCardHeight+'px',
					'width' : self.holeCardsArray[i][0].myCardWidth+'px',
					'top' : self.holeCardsArray[i][0].myY+'px',
					'left' : self.holeCardsArray[i][0].myX+'px',
					'position' : 'absolute',
					'opacity:' : '1.0',
					'z-index' : self.cardsCssZIndex
					} ).show();
				}
			    break;
				default: console.log(">>ERROR: refreshHoleCards() cardA switch default!<<");
				break;
			}
			
			switch(self.holeCardsArray[i][1].state) {
				case self.STATE.NONE: {
					$("#"+self.holeCardsArray[i][1].id).hide();
				}
				break;
				case self.STATE.FLIPSIDE: {
					self.holeCardsArray[i][1].src = self.getCardSrcPath("flipside"); 
					$("#"+self.holeCardsArray[i][1].id).css( {
						'background-image': 'url("'+self.holeCardsArray[i][1].src+'")',
						'background-size': 'contain',
						'background-repeat' : 'no-repeat',
						'background-position' : 'top left',
						'height' : self.holeCardsArray[i][1].myCardHeight+'px',
						'width' : self.holeCardsArray[i][1].myCardWidth+'px',
						'top' : self.holeCardsArray[i][1].myY+'px',
						'left' : self.holeCardsArray[i][1].myX+'px',
						'position' : 'absolute',
						'opacity:' : '1.0',
						'z-index' : self.cardsCssZIndex
					} ).show();
				}
			    break;
				case self.STATE.FRONT: {
					self.holeCardsArray[i][1].src = self.getCardSrcPath(self.holeCardsArray[i][1].myCardValue);
					$("#"+self.holeCardsArray[i][1].id).css( {
					'background-image': 'url("'+self.holeCardsArray[i][1].src+'")',
					'background-size': 'contain',
					'background-repeat' : 'no-repeat',
					'background-position' : 'top left',
					'height' : self.holeCardsArray[i][1].myCardHeight+'px',
					'width' : self.holeCardsArray[i][1].myCardWidth+'px',
					'top' : self.holeCardsArray[i][1].myY+'px',
					'left' : self.holeCardsArray[i][1].myX+'px',
					'position' : 'absolute',
					'opacity:' : '1.0',
					'z-index' : self.cardsCssZIndex
					} ).show();
				}
			    break;
				default: console.log(">>ERROR: refreshHoleCards() cardB switch default!<<");
				break;
			}
		}
 	};
	
	this.refreshTableCards = function()
 	{	
		for(i=0; i < self.tableCardsArray.length; i++) {		
			switch(self.tableCardsArray[i].state) {
				case self.STATE.NONE: {
					$("#"+self.tableCardsArray[i].id).hide();
				}
				break;
				case self.STATE.FLIPSIDE: {
					self.tableCardsArray[i].src = self.getCardSrcPath("flipside"); 
					$("#"+self.tableCardsArray[i].id).css( {
					'background-image': 'url("'+self.tableCardsArray[i].src+'")',
					'background-size': 'contain',
					'background-repeat' : 'no-repeat',
					'background-position' : 'top left',
					'height' : self.tableCardsArray[i].myCardHeight+'px',
					'width' : self.tableCardsArray[i].myCardWidth+'px',
					'top' : self.tableCardsArray[i].myY+'px',
					'left' : self.tableCardsArray[i].myX+'px',
					'position' : 'absolute',
					'opacity:' : '1.0',
					'z-index' : self.cardsCssZIndex
					} ).show();
				}
			    break;
				case self.STATE.FRONT: {
					self.tableCardsArray[i].src = self.getCardSrcPath(self.tableCardsArray[i].myCardValue);
					$("#"+self.tableCardsArray[i].id).css( {
					'background-image': 'url("'+self.tableCardsArray[i].src+'")',
					'background-size': 'contain',
					'background-repeat' : 'no-repeat',
					'background-position' : 'top left',
					'height' : self.tableCardsArray[i].myCardHeight+'px',
					'width' : self.tableCardsArray[i].myCardWidth+'px',
					'top' : self.tableCardsArray[i].myY+'px',
					'left' : self.tableCardsArray[i].myX+'px',
					'position' : 'absolute',
					'opacity:' : '1.0',
					'z-index' : self.cardsCssZIndex
					} ).show();
				}
			    break;
				default: console.log(">>ERROR: refreshTableCards() switch default!<<");
				break;
			}
		}
 	};

	this.raiseHoleCard = function(playerId, position)
	{
		var seat = self.getPlayerSeat(playerId);
		$("#"+self.holeCardsArray[seat][position].id).delay(1500).animate({
			'top' : (self.holeCardsArray[seat][position].myY-(myWidth*0.3/100))+'px' 
		}, 500 );

	};
	
	this.raiseTableCard = function(position)
	{
		$("#"+self.tableCardsArray[position].id).delay(1500).animate({
				'top' : (self.tableCardsArray[position].myY-(myWidth*0.3/100))+'px' 
		}, 500 );
	};
	
	this.fadeOutHoleCard = function(playerId, position)
	{
		var seat = self.getPlayerSeat(playerId);
		$("#"+self.holeCardsArray[seat][position].id).delay(1500).animate({
			opacity:'0.2'
		}, 800 );

	};
	
	this.fadeOutTableCard = function(position)
	{
		$("#"+self.tableCardsArray[position].id).delay(1500).animate({
			opacity:'0.2'
		}, 800 );
	};
	

	//HELPER
	this.getDealStartPosition = function(cardType) 
	{
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		var dealerCircleCenterY = 0;
		var dealerCircleCenterX = 0;
		var dealerSeat;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			if (myNetCache.getNetGame().getNetHand().getDealerId() == playerSeatsArray[i]) {
				var dealerTopPlayerYOffset = 0;
				var dealPositionOffset = 0;
				if (i >= 3 && i <= 7) {
					dealerTopPlayerYOffset = 20.5;
				}
				else {
					if(cardType == self.TYPE.HOLECARD) {
						dealPositionOffset = self.holeCardHeight;
					}
					else if(cardType == self.TYPE.TABLECARD) {
						dealPositionOffset = self.tableCardHeight;
					}
				}
				dealerCircleCenterY = parseInt(self.mySeatsArray[i][1] + (myHeight * (1.5 + dealerTopPlayerYOffset) / 100) - dealPositionOffset);
				dealerCircleCenterX = parseInt(self.mySeatsArray[i][0] + (myHeight * 5.0 / 100));
				dealerSeat = i;
			}
		}
		var dealerButtonArray = new Array(dealerCircleCenterX, dealerCircleCenterY, dealerSeat);
		return dealerButtonArray;
	};

	this.getCardSrcPath = function(cardValue) 
	{
		if(cardValue == "flipside") {
			return "gfx/cards/"+cardValue+".png";
		}
		else {
			var cardHeight = parseInt(myHeight*12.67/100);
			var currentSrcPixmapHeight;
			if(cardHeight <= 50) { currentSrcPixmapHeight = 50; }
			else if(cardHeight <= 70) { currentSrcPixmapHeight = 70; }
			else if(cardHeight <= 90) { currentSrcPixmapHeight = 90; }
			else if(cardHeight <= 110) { currentSrcPixmapHeight = 110; }
			else if(cardHeight <= 130) { currentSrcPixmapHeight = 130; }
			else if(cardHeight <= 150) { currentSrcPixmapHeight = 150; }
			else if(cardHeight <= 170) { currentSrcPixmapHeight = 170; }
			else if(cardHeight <= 190) { currentSrcPixmapHeight = 190; }
			else if(cardHeight <= 210) { currentSrcPixmapHeight = 210; }
			else if(cardHeight <= 230) { currentSrcPixmapHeight = 230; }
			else if(cardHeight <= 250) { currentSrcPixmapHeight = 250; }
			else if(cardHeight <= 270) { currentSrcPixmapHeight = 270; }
			else { currentSrcPixmapHeight = 290; }
			return "gfx/cards/"+cardValue+"_"+currentSrcPixmapHeight+"px.png";
		}
	};
	
	this.getPlayerSeat = function(playerId)
	{
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			if (playerSeatsArray[i] === playerId) {
				return i;
			}
		}
	};
};
