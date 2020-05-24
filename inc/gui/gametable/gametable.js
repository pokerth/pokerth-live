/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myGameTable = new Object();

/**
 * class GameTableImpl
 * @constructor
 */
function GameTableImpl()
{
	myCards = new CardsImpl();
	myButtons = new ButtonsImpl();
	
	var self = this;
	this.seatsArray = new Array();
	this.chatCache = new Array();
	this.cardHolder = {tableMidPointX: 0, tableMidPointY: 0, cardHolderHeight: 0, cardHolderWidth: 0, cardHolderRadius: 0, cardHolderY: 0, cardHolderOffset: 0, flop1X: 0, flop2X: 0, flop3X: 0, turnX: 0, riverX: 0};
	this.isActive = false;
	this.avatarLabelCssZIndex = 8;
	this.winnerLabelCssZIndex = 10;
	this.distributePotAnimationLabelCssZIndex = 11;
	this.SEAT_STATE = {
		ACTIVE : {value: 0 }, 
		AUTOFOLD : {value: 1 }, 
		STAYONTABLE : {value: 2 },
		CLEAR : {value: 3 }
	};
	
	for(var i=0; i<MAX_NUMBER_OF_PLAYERS; i++) {	
		$("#gameArea").append('<div id="winnerLabel'+i+'"></div>');
		$("#gameArea").append('<div id="avatarLabel'+i+'"></div>');
		$("#gameArea").append('<div id="distributePotAnimationLabel'+i+'"></div>');
		$("#gameArea").append('<div id="table-user-loggedIn"></div>');
		$("#gameArea").append('<div id="spectatorLabel"></div>');
		$("#gameArea").append('<div id="table-chat-textArea"></div>');	
		$("#avatarLabel"+i).css({ 
			'z-index' : this.avatarLabelCssZIndex, 
			'image-rendering' : 'optimizeQuality',
        		'image-rendering' : 'optimize-contrast',
			'image-rendering' : '-web-kit-optimize-contrast',
			'-ms-interpolation-mode' : 'bicubic'
		}).hide();
		$("#winnerLabel"+i).css({ 'z-index' : this.winnerLabelCssZIndex }).hide();
		$("#distributePotAnimationLabel"+i).css({ 'z-index' : this.distributePotAnimationLabelCssZIndex }).hide();
	}
	
	this.dealTableCards = function(beRo) {
		myCards.dealTableCards(beRo);
	};
	this.showHoleCards = function(playerId) {
		myCards.showHoleCards(playerId);
	};
	this.handStart = function()
	{
		for(var i=0; i<MAX_NUMBER_OF_PLAYERS; i++) {	
			$("#winnerLabel"+i).hide();			
			$("#distributePotAnimationLabel"+i).hide();
		}
		self.refreshActivePlayer();
		self.refreshAvatars();
		self.refreshPlayerNicks();
		self.refreshPlayerCash();
		self.refreshPlayerSet();
		self.refreshPlayerAction();
		self.refreshDealerButton();
		self.refreshPot();
		myCards.clearTableCards();
		myCards.clearHoleCards();
		myCards.dealHoleCards();
	};

	this.playersActionDone = function(playerId)
	{
		mySoundEvents.currentActionNotification(myNetCache.getPlayerData(playerId).gameValues.myAction);
		self.refreshPlayerAction();
		if(myNetCache.getPlayerData(playerId).gameValues.myAction == 1 /*fold*/) {
			myCards.foldCards(self.getPlayerSeat(playerId));
		}
	};
	
	this.refreshAll = function()
	{
		self.clearAllLayers();
		self.setupSeats();
		self.setupCardHolder();
		self.drawFloorAndTable();
		self.refreshActivePlayer();
		self.refreshAvatars();
		self.refreshPlayerNicks();
		self.refreshPlayerCash();
		self.refreshPlayerSet();
		self.refreshPlayerAction();
		self.refreshDealerButton();
		self.refreshPot();
		self.refreshUIButtons();
		self.refreshSpectatorLabel();
		self.refreshClientLabel();
		self.refreshChat();
	};
	
	this.clearAllLayers = function()
	{
		ct.clearRect(0, 0, myWidth, myHeight);
		ct2.clearRect(0, 0, myWidth, myHeight);
		ct3.clearRect(0, 0, myWidth, myHeight);
		ct4.clearRect(0, 0, myWidth, myHeight);
		ct5.clearRect(0, 0, myWidth, myHeight);
		ct6.clearRect(0, 0, myWidth, myHeight);
		ct7.clearRect(0, 0, myWidth, myHeight);
	};
	
	this.clientConnected = function(nickName) 
	{
		$("#table-user-loggedIn").html("&nbsp;&nbsp;&#9673;&nbsp;"+nickName);
		$("#table-user-loggedIn").css({ 
			"color" : "green" 
		});
	}
	
	this.clientDisconnected = function() 
	{
		$("#table-user-loggedIn").html("&nbsp;&nbsp;&#9673;&nbsp;offline");
		$("#table-user-loggedIn").css({ "color" : "red" });
	}
	
	this.refreshClientLabel = function() 
	{
		$("#table-user-loggedIn").css({ 
			'position' : 'absolute',
			'top' : parseInt(myHeight * 0.3 / 100) + 'px',
			'left' : parseInt(myWidth * 3.7 / 100) + 'px'
		});
	}
	
	this.drawFloorAndTable = function()
	{
//draw floor
		img = new Image();
		img.onload = function() {
			var ptrn = ct.createPattern(img, 'repeat');
			ct.fillStyle = ptrn;
			ct.fillRect(0, 0, myWidth, myHeight);
			self.drawTable();
		};
		img.src = "gfx/gametable/floor.jpg";
	};

	this.drawTable = function()
	{
		var tableBackgroundColor = "#056F05";
		var leftCircleCenterX = myWidth * 25 / 100;
		var circleCenterY = myHeight * 40 / 100;
		var circleRadius = myHeight * 30 / 100;
		var rectLeftX = myWidth * 25 / 100;
		var rectTopY = circleCenterY - circleRadius;
		var rectRightX = myWidth * 75 / 100;
		var rightCircleCenterX = rectRightX;
		var rectBottomY = circleCenterY + circleRadius;
		ct.beginPath();
		ct.moveTo(leftCircleCenterX, circleCenterY);
		ct.arc(leftCircleCenterX, circleCenterY, circleRadius, (Math.PI * 90) / 180, (Math.PI * 270) / 180, false);
		ct.rect(myWidth * 25 / 100, myHeight * 10 / 100, myWidth * 50 / 100, myHeight * 60 / 100);
		ct.moveTo(rightCircleCenterX, circleCenterY);
		ct.arc(rightCircleCenterX, circleCenterY, circleRadius, (Math.PI * 270) / 180, (Math.PI * 90) / 180, false);
		ct.closePath();
		ct.fillStyle = tableBackgroundColor;
		ct.fill();
// create radial gradient (left circle)
		var grd = ct.createRadialGradient(leftCircleCenterX + myWidth * 2 / 100, circleCenterY + circleCenterY * 1 / 100, circleRadius * 1 / 100, leftCircleCenterX + myWidth * 2 / 100, circleCenterY + circleCenterY * 1 / 100, circleRadius * 90 / 100);
// light green
		grd.addColorStop(0, "rgba(255, 255, 255, 0.12)");
// table green
		grd.addColorStop(1, "rgba(255, 255, 255, 0.0)");
		ct.fillStyle = grd;
		ct.fill();
// create radial gradient (center circle)
		var grd = ct.createRadialGradient((leftCircleCenterX + rightCircleCenterX) / 2, circleCenterY, circleRadius * 2 / 100, (leftCircleCenterX + rightCircleCenterX) / 2, circleCenterY, circleRadius * 60 / 100);
// light green
		grd.addColorStop(0, "rgba(255, 255, 255, 0.08)");
// table green
		grd.addColorStop(1, "rgba(255, 255, 255, 0.0)");
		ct.fillStyle = grd;
		ct.fill();
// create radial gradient (right circle)
		var grd = ct.createRadialGradient(rightCircleCenterX - myWidth * 2 / 100, circleCenterY - circleCenterY * 2 / 100, circleRadius * 6 / 100, rightCircleCenterX - myWidth * 2 / 100, circleCenterY - circleCenterY * 2 / 100, circleRadius * 80 / 100);
// light green
		grd.addColorStop(0, "rgba(255, 255, 255, 0.10)");
// table green
		grd.addColorStop(1, "rgba(255, 255, 255, 0.0)");
		ct.fillStyle = grd;
		ct.fill();
// //table border
		var tableBorderWidth = myHeight * 4 / 100;
//plain dark border
		ct.beginPath();
		ct.lineWidth = tableBorderWidth + tableBorderWidth * 30 / 100;
		ct.arc(leftCircleCenterX, circleCenterY, circleRadius, (Math.PI * 90) / 180, (Math.PI * 270) / 180, false);
		ct.moveTo(rectLeftX, rectTopY);
		ct.lineTo(rectRightX, rectTopY);
		ct.arc(rightCircleCenterX, circleCenterY, circleRadius, (Math.PI * 270) / 180, (Math.PI * 90) / 180, false);
		ct.moveTo(rectRightX, rectBottomY);
		ct.lineTo(rectLeftX, rectBottomY);
		ct.closePath();
		ct.strokeStyle = "#431907";
		ct.stroke();
//plain lighter border
		ct.beginPath();
		ct.lineWidth = tableBorderWidth + tableBorderWidth * 15 / 100;
		ct.arc(leftCircleCenterX, circleCenterY, circleRadius, (Math.PI * 90) / 180, (Math.PI * 270) / 180, false);
		ct.moveTo(rectLeftX, rectTopY);
		ct.lineTo(rectRightX, rectTopY);
		ct.arc(rightCircleCenterX, circleCenterY, circleRadius, (Math.PI * 270) / 180, (Math.PI * 90) / 180, false);
		ct.moveTo(rectRightX, rectBottomY);
		ct.lineTo(rectLeftX, rectBottomY);
		ct.closePath();
		ct.strokeStyle = "#67270B";
		ct.stroke();
//texture filling
		var img = new Image();
		ct.beginPath();
		ct.lineWidth = tableBorderWidth;
		ct.arc(leftCircleCenterX, circleCenterY, circleRadius, (Math.PI * 90) / 180, (Math.PI * 270) / 180, false);
		ct.moveTo(rectLeftX, rectTopY);
		ct.lineTo(rectRightX, rectTopY);
		ct.arc(rightCircleCenterX, circleCenterY, circleRadius, (Math.PI * 270) / 180, (Math.PI * 90) / 180, false);
		ct.moveTo(rectRightX, rectBottomY);
		ct.lineTo(rectLeftX, rectBottomY);
		ct.closePath();
		img.onload = function() {
			var ptrn = ct.createPattern(img, 'repeat');
			ct.strokeStyle = ptrn;
			ct.stroke();
			self.drawCardHolder();
		};
		img.src = "gfx/gametable/wood-texture-small.jpg";
	};

	this.setupCardHolder = function()
	{
		self.cardHolder.tableMidPointX = myWidth * 50 / 100;
		self.cardHolder.tableMidPointY = myHeight * 40 / 100;
		self.cardHolder.cardHolderHeight = myHeight * 13.7 / 100;
		self.cardHolder.cardHolderWidth = myWidth * 5.3 / 100;
		self.cardHolder.cardHolderRadius = myWidth * 0.5 / 100;
		self.cardHolder.cardHolderY = self.cardHolder.tableMidPointY - self.cardHolder.cardHolderHeight / 2;
		self.cardHolder.cardHolderOffset = myWidth * 1 / 100;
		self.cardHolder.flop1X = self.cardHolder.tableMidPointX - 5 * (self.cardHolder.cardHolderWidth / 2) - 2 * self.cardHolder.cardHolderOffset;
		self.cardHolder.flop2X = self.cardHolder.tableMidPointX - 3 * (self.cardHolder.cardHolderWidth / 2) - self.cardHolder.cardHolderOffset;
		self.cardHolder.flop3X = self.cardHolder.tableMidPointX - self.cardHolder.cardHolderWidth / 2;
		self.cardHolder.turnX = self.cardHolder.tableMidPointX + self.cardHolder.cardHolderWidth / 2 + self.cardHolder.cardHolderOffset;
		self.cardHolder.riverX = self.cardHolder.tableMidPointX + 3 * (self.cardHolder.cardHolderWidth / 2) + 2 * self.cardHolder.cardHolderOffset;
	
		var cardHolderArray = new Array();
		cardHolderArray.push(self.cardHolder.cardHolderY, self.cardHolder.flop1X, self.cardHolder.flop2X, self.cardHolder.flop3X, self.cardHolder.turnX, self.cardHolder.riverX);
		myCards.setupTableCards(cardHolderArray);
	};
	
	this.drawCardHolder = function()
	{
		self.setupCardHolder();
		var cardHolderBGColor = "rgba(255,255,255,0.05)";
		var cardHolderTextColor = "rgba(255,255,255,0.05)";
		ct5.fillStyle = cardHolderBGColor;
//flop1
		ct5.roundRect(self.cardHolder.flop1X, self.cardHolder.cardHolderY, self.cardHolder.cardHolderWidth, self.cardHolder.cardHolderHeight, self.cardHolder.cardHolderRadius);
		ct5.fill();
		ct5.fillStyle = cardHolderTextColor;
		ct5.font = 'bold ' + (myHeight * 8 / 100) + 'px sans-serif';
		ct5.textBaseline = 'bottom';
		ct5.fillText("f", self.cardHolder.flop1X + (myWidth * 2.8 / 100), self.cardHolder.cardHolderY + (myHeight * 14.3 / 100));
//flop2
		ct5.roundRect(self.cardHolder.flop2X, self.cardHolder.cardHolderY, self.cardHolder.cardHolderWidth, self.cardHolder.cardHolderHeight, self.cardHolder.cardHolderRadius);
		ct5.fill();
		ct5.fillStyle = cardHolderTextColor;
		ct5.font = 'bold ' + (myHeight * 8 / 100) + 'px sans-serif';
		ct5.textBaseline = 'bottom';
		ct5.fillText("f", self.cardHolder.flop2X + (myWidth * 2.8 / 100), self.cardHolder.cardHolderY + (myHeight * 14.3 / 100));
//flop3
		ct5.roundRect(self.cardHolder.flop3X, self.cardHolder.cardHolderY, self.cardHolder.cardHolderWidth, self.cardHolder.cardHolderHeight, self.cardHolder.cardHolderRadius);
		ct5.fill();
		ct5.fillStyle = cardHolderTextColor;
		ct5.font = 'bold ' + (myHeight * 8 / 100) + 'px sans-serif';
		ct5.textBaseline = 'bottom';
		ct5.fillText("f", self.cardHolder.flop3X + (myWidth * 2.8 / 100), self.cardHolder.cardHolderY + (myHeight * 14.3 / 100));
//turn
		ct5.roundRect(self.cardHolder.turnX, self.cardHolder.cardHolderY, self.cardHolder.cardHolderWidth, self.cardHolder.cardHolderHeight, self.cardHolder.cardHolderRadius);
		ct5.fill();
		ct5.fillStyle = cardHolderTextColor;
		ct5.font = 'bold ' + (myHeight * 8 / 100) + 'px sans-serif';
		ct5.textBaseline = 'bottom';
		ct5.fillText("t", self.cardHolder.turnX + (myWidth * 2.8 / 100), self.cardHolder.cardHolderY + (myHeight * 14.3 / 100));
//river
		ct5.roundRect(self.cardHolder.riverX, self.cardHolder.cardHolderY, self.cardHolder.cardHolderWidth, self.cardHolder.cardHolderHeight, self.cardHolder.cardHolderRadius);
		ct5.fill();
		ct5.fillStyle = cardHolderTextColor;
		ct5.font = 'bold ' + (myHeight * 8 / 100) + 'px sans-serif';
		ct5.textBaseline = 'bottom';
		ct5.fillText("r", self.cardHolder.riverX + (myWidth * 2.8 / 100), self.cardHolder.cardHolderY + (myHeight * 14.3 / 100));
	};
	
	this.setupSeats = function()
	{
//init global seatSize here
		seatWidth = myWidth * 15 / 100;
		seatHeight = myHeight * 20 / 100;
		var seat0X = myWidth * 50 / 100 - (seatWidth / 2);
		var seat0Y = myHeight * 68 / 100 - (seatHeight / 2);
		var seat0 = new Array(seat0X, seat0Y);
		var seat1X = myWidth * 30 / 100 - (seatWidth / 2);
		var seat1Y = myHeight * 68 / 100 - (seatHeight / 2);
		var seat1 = new Array(seat1X, seat1Y);
		var seat2X = myWidth * 10 / 100 - (seatWidth / 2);
		var seat2Y = myHeight * 55 / 100 - (seatHeight / 2);
		var seat2 = new Array(seat2X, seat2Y);
		var seat3X = myWidth * 10 / 100 - (seatWidth / 2);
		var seat3Y = myHeight * 25 / 100 - (seatHeight / 2);
		var seat3 = new Array(seat3X, seat3Y);
		var seat4X = myWidth * 30 / 100 - (seatWidth / 2);
		var seat4Y = myHeight * 12 / 100 - (seatHeight / 2);
		var seat4 = new Array(seat4X, seat4Y);
		var seat5X = myWidth * 50 / 100 - (seatWidth / 2);
		var seat5Y = myHeight * 12 / 100 - (seatHeight / 2);
		var seat5 = new Array(seat5X, seat5Y);
		var seat6X = myWidth * 70 / 100 - (seatWidth / 2);
		var seat6Y = myHeight * 12 / 100 - (seatHeight / 2);
		var seat6 = new Array(seat6X, seat6Y);
		var seat7X = myWidth * 90 / 100 - (seatWidth / 2);
		var seat7Y = myHeight * 25 / 100 - (seatHeight / 2);
		var seat7 = new Array(seat7X, seat7Y);
		var seat8X = myWidth * 90 / 100 - (seatWidth / 2);
		var seat8Y = myHeight * 55 / 100 - (seatHeight / 2);
		var seat8 = new Array(seat8X, seat8Y);
		var seat9X = myWidth * 70 / 100 - (seatWidth / 2);
		var seat9Y = myHeight * 68 / 100 - (seatHeight / 2);
		var seat9 = new Array(seat9X, seat9Y);
//gloabl seats ARRAY!!!!!!
		self.seatsArray = new Array(seat0, seat1, seat2, seat3, seat4, seat5, seat6, seat7, seat8, seat9);
		myCards.setupHoleCards(self.seatsArray);
//create myCards Object
//draw seats squares for testing CONTEXT2
// ct2.clearRect(0, 0, myWidth, myHeight);
//
// var seatsBackgroundColor = "rgba(0,0,0,0.2)";
// ct2.fillStyle = seatsBackgroundColor;
// ct2.fillRect(seat0X, seat0Y, seatWidth, seatHeight);
// ct2.fillRect(seat1X, seat1Y, seatWidth, seatHeight);
// ct2.fillRect(seat2X, seat2Y, seatWidth, seatHeight);
// ct2.fillRect(seat3X, seat3Y, seatWidth, seatHeight);
// ct2.fillRect(seat4X, seat4Y, seatWidth, seatHeight);
// ct2.fillRect(seat5X, seat5Y, seatWidth, seatHeight);
// ct2.fillRect(seat6X, seat6Y, seatWidth, seatHeight);
// ct2.fillRect(seat7X, seat7Y, seatWidth, seatHeight);
// ct2.fillRect(seat8X, seat8Y, seatWidth, seatHeight);
// ct2.fillRect(seat9X, seat9Y, seatWidth, seatHeight);
//
	};
	
	this.refreshActivePlayer = function()
	{
		ct2.clearRect(0, 0, myWidth, myHeight);
		var currentPlayer = self.getPlayerSeat(myNetCache.getNetGame().getNetHand().getCurrentPlayerId());
		if (typeof(currentPlayer) != "undefined") {
			//clear PlayerAction before
			ct7.clearRect(self.seatsArray[currentPlayer][0], self.seatsArray[currentPlayer][1], seatWidth, seatHeight);
			if (currentPlayer >= 3 && currentPlayer <= 7) {
				var avatarSize = myHeight * 8 / 100;
				ct2.shadowOffsetX = 2 * (self.seatsArray[currentPlayer][0] - myHeight * 0.20 / 100);
				ct2.shadowOffsetY = 2 * (self.seatsArray[currentPlayer][1] - (myHeight * 1.2 / 100));
				ct2.shadowColor = "red";
				ct2.shadowBlur = avatarSize / 4;
				ct2.fillStyle = "red";
				ct2.fillRect(0 - (self.seatsArray[currentPlayer][0] + myHeight * 0.5 / 100), 0 - (self.seatsArray[currentPlayer][1] - (myHeight * 1.4 / 100)), myHeight * 11 / 100, myHeight * 11 / 100);
			}
			else if (currentPlayer >= 0) {
				var avatarSize = myHeight * 8 / 100;
				ct2.shadowOffsetX = 2 * (self.seatsArray[currentPlayer][0] - myHeight * 0.20 / 100);
				ct2.shadowOffsetY = 2 * (self.seatsArray[currentPlayer][1] + seatHeight - avatarSize - (myHeight * 1.2 / 100));
				ct2.shadowColor = "red";
				ct2.shadowBlur = avatarSize / 4;
				ct2.fillStyle = "red";
				ct2.fillRect(0 - (self.seatsArray[currentPlayer][0] + myHeight * 0.5 / 100), 0 - (self.seatsArray[currentPlayer][1] + seatHeight - avatarSize - (myHeight * 0.5 / 100)), myHeight * 11 / 100, myHeight * 11 / 100);
			}
		}
		else {
//			if no player is current clear all 
			var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
			for (var i = 0; i < playerSeatsArray.length; i++) {
				ct2.clearRect(self.seatsArray[i][0], self.seatsArray[i][1], seatWidth, seatHeight);
			}
		}
		//do refresh player action to clear the actions when a new betting round starts (possible a bit dirty :( ) <-- JAAA wenn nach raise z.b. die runde weiter geht dann wird nicht mehr action gelöscht wenn einer dran ist <-- TODO
		self.refreshPlayerAction();
	};

	this.refreshAvatars = function()
	{
		var avatarSize = parseInt(myHeight * 8 / 100);
		var avatarPicture = new Object();
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			avatarPicture.src = myNetCache.getPlayerData(playerSeatsArray[i]).avatarFileName;
			if (avatarPicture.src == "") {	
				avatarPicture.src = "gfx/pokerth.png";	
			}
			else { 
				avatarPicture.src = avatarServerURL + avatarPicture.src;
			}
			avatarPicture.myX = parseInt(self.seatsArray[i][0] + myHeight * 0.5 / 100);
			if (i >= 3 && i <= 7) { 
				avatarPicture.myY = parseInt(self.seatsArray[i][1] + (myHeight * 0.5 / 100)); 
			}
			else { 
				avatarPicture.myY = parseInt(self.seatsArray[i][1] + seatHeight - avatarSize - (myHeight * 0.5 / 100)); 
			}
			if(self.getCurrentSeatState(playerSeatsArray[i]) != self.SEAT_STATE.CLEAR) {
				var opacity = 1.0;
				if(self.getCurrentSeatState(playerSeatsArray[i]) == self.SEAT_STATE.AUTOFOLD || self.getCurrentSeatState(playerSeatsArray[i]) == self.SEAT_STATE.STAYONTABLE) {
					opacity = 0.4;
				}
				$("#avatarLabel"+i).css( {
					'background-image': 'url("'+avatarPicture.src+'")',
					'background-size': 'contain',
					'background-repeat' : 'no-repeat',
					'background-position' : 'top left',
					'height' : avatarSize+'px',
					'width' : avatarSize+'px',
					'top' : avatarPicture.myY+'px',
					'left' : avatarPicture.myX+'px',
					'position' : 'absolute',
					'opacity' : opacity,
					'z-index' : self.avatarLabelCssZIndex
				} ).show(1);
			}
			else {
				$("#avatarLabel"+i).hide();
			}
		}
	};

	this.refreshPlayerNicks = function()
	{
		if(self.isActive) {
			var fontSize = parseInt(myHeight * 2.3 / 100);
	// if(fontSize < 15) { fontSize = 15; }
			var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
			for (var i = 0; i < playerSeatsArray.length; i++) {
				var nickString;
				if (myNetCache.hasPlayerData(playerSeatsArray[i])) {
					nickString = myNetCache.getPlayerData(playerSeatsArray[i]).playerInfoData.playerName;
				}
				else {
					nickString = playerSeatsArray[i];
				}
				var topYOffset = 0;
				if (i >= 3 && i <= 7) {
					topYOffset = 17;
				}
				//add some more space (e.g. -3 px) to clearRect because of "j g y" etc.
				ct3.clearRect(self.seatsArray[i][0] + (myHeight * 9 / 100), self.seatsArray[i][1] + (myHeight * (19.6-topYOffset) / 100) - parseInt(myHeight * 3.5 / 100), parseInt((myHeight * 2.7 / 100) * 12), parseInt(myHeight * 4 / 100));
				if(self.getCurrentSeatState(playerSeatsArray[i]) != self.SEAT_STATE.CLEAR) {
					var opacity = 1.0;
					if(self.getCurrentSeatState(playerSeatsArray[i]) == self.SEAT_STATE.AUTOFOLD || self.getCurrentSeatState(playerSeatsArray[i]) == self.SEAT_STATE.STAYONTABLE) {
						opacity = 0.4;
					}			
					ct3.fillStyle = "rgba(255, 255, 255, " + opacity + ")";
					ct3.font = 'bold ' + fontSize + 'px sans-serif';
					ct3.textBaseline = 'bottom';
					ct3.fillText(nickString, self.seatsArray[i][0] + (myHeight * 9.3 / 100), self.seatsArray[i][1] + (myHeight * (19.9-topYOffset) / 100));
				}
			}
		}
	};
	
	this.refreshPlayerCash = function()
	{
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			var topPlayerYOffset = 0;
			if (i >= 3 && i <= 7) {
				topPlayerYOffset = 12;
			}
			ct4.clearRect(self.seatsArray[i][0] + (myHeight * 9.3 / 100), self.seatsArray[i][1] + (myHeight * (17.5 - topPlayerYOffset) / 100) - parseInt(myHeight * 4 / 100), parseInt((myHeight * 4 / 100) * 6), parseInt(myHeight * 4 / 100));
			if(self.getCurrentSeatState(playerSeatsArray[i]) != self.SEAT_STATE.CLEAR && self.getCurrentSeatState(playerSeatsArray[i]) != self.SEAT_STATE.STAYONTABLE) {
				var cashString;
				if (typeof myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.myCash != "undefined") {
					cashString = "$" + myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.myCash;
				}
				else {
					cashString = "";
				}				
				var opacity = 1.0;
				if(self.getCurrentSeatState(playerSeatsArray[i]) == self.SEAT_STATE.AUTOFOLD) {
					opacity = 0.4;
				}			
				ct4.fillStyle = "rgba(255, 255, 0, " + opacity + ")";
				ct4.font = 'bold ' + parseInt(myHeight * 2.3 / 100) + 'px sans-serif';
				ct4.textBaseline = 'bottom';
				ct4.fillText(cashString, self.seatsArray[i][0] + (myHeight * 9.3 / 100), self.seatsArray[i][1] + (myHeight * (17.5 - topPlayerYOffset) / 100));
			}
		}
	};
	
	this.refreshPlayerSet = function()
	{
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			var setString = myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.mySet;
			if (typeof setString != "undefined" && setString != 0) {
				setString = "$" + myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.mySet;
			}
			else {
				setString = "";
			}
			var topPlayerYOffset = 0;
			if (i >= 3 && i <= 7) {
				topPlayerYOffset = 21;
			}
			ct4.clearRect(self.seatsArray[i][0] + (myHeight * 13 / 100), self.seatsArray[i][1] + (myHeight * (1 + topPlayerYOffset) / 100) - parseInt(myHeight * 4 / 100), parseInt((myHeight * 4 / 100) * 6), parseInt(myHeight * 4 / 100));
			ct4.fillStyle = 'yellow';
			ct4.font = 'bold ' + parseInt(myHeight * 2.3 / 100) + 'px sans-serif';
			ct4.textBaseline = 'bottom';
			ct4.fillText(setString, self.seatsArray[i][0] + (myHeight * 14 / 100), self.seatsArray[i][1] + (myHeight * (1 + topPlayerYOffset) / 100));
		}
		self.refreshPot();
	};
	
	this.refreshPlayerAction = function()
	{
		var actionStringArray = new Array("", "Fold", "Check", "Call", "Bet", "Raise", "All-In");
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			ct7.font = 'bold ' + parseInt(myHeight * 3.2 / 100) + 'px sans-serif';
			ct7.strokeStyle = 'white';
			ct7.miterLimit = 1.4;
			ct7.lineJoin = 'circle';
			ct7.clearRect(self.seatsArray[i][0], self.seatsArray[i][1], seatWidth, seatHeight);
			ct7.lineWidth = parseInt(myHeight * 1.2 / 100);
			var topPlayerYOffset = 0;
			if (i >= 3 && i <= 7) {
				topPlayerYOffset = 5;
			}
			ct7.textBaseline = 'bottom';
			ct7.textAlign = 'center';
			ct7.strokeText(actionStringArray[myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.myAction], self.seatsArray[i][0] + (myHeight * 17 / 100), self.seatsArray[i][1] + (myHeight * (13.2 + topPlayerYOffset) / 100));
			ct7.lineWidth = parseInt(myHeight * 1 / 100);
			ct7.fillText(actionStringArray[myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.myAction], self.seatsArray[i][0] + (myHeight * 17 / 100), self.seatsArray[i][1] + (myHeight * (13.2 + topPlayerYOffset) / 100));
		}
		self.refreshPlayerSet();
		self.refreshPlayerCash();
	};
	
	this.refreshDealerButton = function()
	{
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		for (var i = 0; i < playerSeatsArray.length; i++) {
				var dealerCircleCenterX;
				var dealerCircleCenterY;
				var dealerCircleRadius = myHeight * 2.8 / 100;
				var dealerCircleLineWidth = myHeight * 0.25 / 100;
				var dealerFontSize = myHeight * 4 / 100;
				var dealerTopPlayerYOffset = 0;
				if (i >= 3 && i <= 7) {
					dealerTopPlayerYOffset = 20.5;
				}
				dealerCircleCenterY = self.seatsArray[i][1] + (myHeight * (1.5 + dealerTopPlayerYOffset) / 100);
				dealerCircleCenterX = self.seatsArray[i][0] + (myHeight * 5.0 / 100);
			if (myNetCache.getNetGame().getNetHand().getDealerId() == playerSeatsArray[i]) {	
				ct3.beginPath();
				ct3.moveTo(dealerCircleCenterX, dealerCircleCenterY);
				ct3.arc(dealerCircleCenterX, dealerCircleCenterY, dealerCircleRadius, 0, Math.PI * 2, false);
				ct3.closePath();
				ct3.fillStyle = 'black';
				ct3.fill();
				ct3.beginPath();
				ct3.moveTo(dealerCircleCenterX, dealerCircleCenterY);
				ct3.arc(dealerCircleCenterX, dealerCircleCenterY, dealerCircleRadius - dealerCircleLineWidth, 0, Math.PI * 2, false);
				ct3.closePath();
				ct3.fillStyle = 'white';
				ct3.fill();
				ct3.fillStyle = 'black';
				ct3.font = 'bold ' + parseInt(dealerFontSize) + 'px sans-serif';
				ct3.textBaseline = 'bottom';
				ct3.fillText("D", dealerCircleCenterX - (myHeight * 1.33 / 100), dealerCircleCenterY + (myHeight * 2.25 / 100));
			}
			else {
				//add some more space (e.g. -3 px) to clearRect because of anitalising 
				ct3.clearRect(dealerCircleCenterX-dealerCircleRadius-3, dealerCircleCenterY-dealerCircleRadius-3, 2*dealerCircleRadius+6, 2*dealerCircleRadius+6);
			}
		}
	};
	
	this.refreshPot = function()
	{
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		var betsSum = 0;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			betsSum += myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.mySet;
		}
		ct4.clearRect(myHeight * 54 / 100, (myHeight * 50 / 100) - parseInt(myHeight * 3.2 / 100), myWidth * 50 / 100, parseInt(myHeight * 4.5 / 100));
		ct4.fillStyle = '#5FC35F';
		ct4.font = 'bold ' + parseInt(myHeight * 3.2 / 100) + 'px sans-serif';
		ct4.textBaseline = 'bottom';
		ct4.fillText('Bets: $' + betsSum, myHeight * 55 / 100, myHeight * 51 / 100);
		ct4.fillStyle = '#5FC35F';
		ct4.font = 'bold ' + parseInt(myHeight * 3.2 / 100) + 'px sans-serif';
		ct4.textBaseline = 'bottom';
		ct4.fillText('Total: $' + myNetCache.getNetGame().getNetHand().getPot(), myHeight * 90 / 100, myHeight * 51 / 100);
	};
	
	this.distributePot = function()
	{
		//collect sets and refresh POT at first
		self.refreshPot();
		
		function clearAction(x,y) {
			return function () {
				ct7.clearRect(x, y, seatWidth, seatHeight);
			};
		}
		
		var playerSeatsArray = myNetCache.getNetGame().getGameData().playerSeats;
		var activePlayersCounter = 0;
		var activeNonFoldPlayersCounter = 0;
		for (var i = 0; i < playerSeatsArray.length; i++) {
			if(myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.active){
				++activePlayersCounter;
				if(myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.myAction != 1 /*fold*/) {
					++activeNonFoldPlayersCounter;
				}
			}
		}
		
		for (var i = 0; i < playerSeatsArray.length; i++) {
			var moneyWon = myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.moneyWon;
			var isActive = myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.active;
			var action = myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.myAction;
			var cardsValue = myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.cardsValue;
			if( isActive && action != 1 /*fold*/ && moneyWon > 0) {
				var topPlayerYOffset = 0;
				if(cardsValue === myNetCache.getNetGame().getNetHand().getHighestCardsValue()) {
					//show winner	
					$("#winnerLabel"+i).empty();
					$("#winnerLabel"+i).append("Winner")
					if (i >= 3 && i <= 7) {
						topPlayerYOffset = 5;
					}
					var seatX = self.seatsArray[i][0];
					var seatY = self.seatsArray[i][1];
					$("#winnerLabel"+i).css( {
							'position' : 'absolute',
							'color': 'black',
							'font': 'bold '+parseInt(myHeight * 3.5 / 100)+'px sans-serif',
							'text-shadow': '-5px 0 5px yellow, 0 5px 5px yellow, 5px 0 5px yellow, 0 -4px 4px yellow, -4px 0 4px yellow, 0 4px 4px yellow, 4px 0 4px yellow, 0 -4px 4px yellow, -3px 0 3px yellow, 0 3px 3px yellow, 3px 0 3px yellow, 0 -3px 3px yellow',
							'left': parseInt(self.seatsArray[i][0]+(myHeight * 11 / 100)),
							'top': parseInt(self.seatsArray[i][1] + (myHeight * (10 + topPlayerYOffset) / 100))
					} ).delay(2000).show(50, clearAction(seatX, seatY));
				}
				//clear animate pot distribution
				if (i >= 3 && i <= 7) {
					topPlayerYOffset = 11;
				}
				$("#distributePotAnimationLabel"+i).empty();
				$("#distributePotAnimationLabel"+i).append("$"+moneyWon)
				$("#distributePotAnimationLabel"+i).css( {
						'position' : 'absolute',
						'opacity' :'1.0',					
						'color': 'yellow',
						'font-weight' : 'bold',
						'font-size': parseInt(myHeight * 3.2 / 100)+'px',
						'left': parseInt(myHeight * 98.5 / 100),
						'top': parseInt(myHeight * 47.5 / 100)
				} ).delay(2500).show(1, function() { 
					//clear canvas POT 
					ct4.clearRect(myWidth *  57.5 / 100, (myHeight * 50 / 100) - parseInt(myHeight * 3.2 / 100), myWidth * 20 / 100, parseInt(myHeight * 4.5 / 100));
				}).animate({
						'left' : parseInt(self.seatsArray[i][0] + (myHeight * 11 / 100)),
						'top' : parseInt(self.seatsArray[i][1] + (myHeight * (15.0 - topPlayerYOffset) / 100)),
						'font-size': parseInt(myHeight * 2.3 / 100)+'px',
						'opacity' :'1.0'
				}, 1000, function() { self.refreshPlayerCash(); } ).hide(1);				
				
				if(activeNonFoldPlayersCounter >= 0 && cardsValue === myNetCache.getNetGame().getNetHand().getHighestCardsValue()) {
					//start fade out non winning cards
					var bestHandPosition = myNetCache.getPlayerData(playerSeatsArray[i]).gameValues.bestHandPosition;
					if (bestHandPosition.length > 0) {
						var index0 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 0 ) {
								index0 = false;
//								myCards.raiseHoleCard(playerSeatsArray[i], 0);
								break;
							}
						}
						if (index0) {
							myCards.fadeOutHoleCard(playerSeatsArray[i], 0);
						}

						var index1 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 1 ) {
								index1 = false;
//								myCards.raiseHoleCard(playerSeatsArray[i], 1);
								break;
							}
						}
						if (index1) {
							myCards.fadeOutHoleCard(playerSeatsArray[i], 1);
						}

						var index2 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 2 ) {
								index2 = false;
//								myCards.raiseTableCard(0)
								break;
							}
						}
						if (index2) {
							myCards.fadeOutTableCard(0);
						}

						var index3 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 3 ) {
								index3 = false;
//								myCards.raiseTableCard(1)
								break;
							}
						}
						if (index3) {
							myCards.fadeOutTableCard(1);
						}

						var index4 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 4 ) {
								index4 = false;
//								myCards.raiseTableCard(2)
								break;
							}
						}
						if (index4) {
							myCards.fadeOutTableCard(2);
						}

						var index5 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 5 ) {
								index5 = false;
//								myCards.raiseTableCard(3)
								break;
							}
						}
						if (index5) {
							myCards.fadeOutTableCard(3);
						}

						var index6 = true;
						for(var j=0; j<5; j++) {
							if (bestHandPosition[j] == 6 ) {
								index6 = false;
//								myCards.raiseTableCard(4)
								break;
							}
						}
						if (index6) {
							myCards.fadeOutTableCard(4);
						}
					}
				}
				else {
					myCards.fadeOutHoleCard(playerSeatsArray[i], 0);
					myCards.fadeOutHoleCard(playerSeatsArray[i], 1);
				}				
			}
			else {
				if(activePlayersCounter != 1 && action > 1 /*fold*/) {
					myCards.fadeOutHoleCard(playerSeatsArray[i], 0);
					myCards.fadeOutHoleCard(playerSeatsArray[i], 1);
				}
			}
		}		
	};
	
	this.refreshUIButtons = function()
	{
		myButtons.refreshAll();
	};
	
	this.refreshSpectatorLabel = function()
	{
		var spectatorNumber = myNetCache.getNetGame().getGameData().spectatorSeats.length;
		var spectatorImageWidth = parseInt(myWidth * 3.5 / 100);
		$("#spectatorLabel").html("<img border=0 style='margin-left: auto; margin-right: auto; width: "+spectatorImageWidth+"px; height: "+spectatorImageWidth+"px;' src='gfx/gametable/spectator.svg'><br><span style='margin-left: "+parseInt(myHeight * 2.7 / 100)+"px; vertical-align: top; font: bold "+parseInt(myHeight * 2.3 / 100)+"px sans-serif;'>"+spectatorNumber+"</span>");
		$("#spectatorLabel").css( {
				'display' : 'block',
				'border' : '0px solid white',
				'position' : 'absolute',
				'z-index' : '1000' ,
				'top' : parseInt(myHeight * 0.3 / 100) + 'px',
				'left' : parseInt(myWidth * 0.3 / 100) + 'px',
				'color' : 'white'
		} );
	};
	
	this.refreshChat = function()
	{
		$("#table-chat-textArea").textinput();
		$("#table-chat-textArea").css( {
				'top' : parseInt(myHeight * 80 / 100) + 'px',
				'left' : parseInt(myWidth * 0.3 / 100) + 'px',
				'height' : parseInt(myHeight * 15 / 100) + 'px',
				'width' : parseInt(myWidth * 33 / 100) + 'px',
				'font-size' : parseInt(myHeight * 2.1 / 100)
		} );
		
		if(self.chatCache.length > 0) {
			for (var i = 0; i < self.chatCache.length; i++) {
				var refresh = true;
				self.finalReceiveChatMsg(self.chatCache[i], refresh);
			}
		}
	
	};
	
	this.receiveChatMessage = function(playerId, msgText)
	{	
		var playerName = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
		var tmpMsg;
		if(msgText.match("^/me ")=="/me ") {
			msgText = msgText.replace(/\/me /g, "<b>*"+playerName+"</b> ");
			tmpMsg = '<span class="table-chat-textArea_text" style="font-style:italic;">'+msgText+'</span></br>';
		}
		else {
			tmpMsg = '<span class="table-chat-textArea_text"><b>'+playerName+':</b> '+msgText+'</span></br>';
		}
		self.finalReceiveChatMsg(tmpMsg);
	};
	
	this.finalReceiveChatMsg = function(msgText, refresh) 
	{
		if(self.isActive) {
		$("#table-chat-textArea").append(msgText);
		$("#table-chat-textArea").scrollTop($('#table-chat-textArea')[0].scrollHeight);
		}
		if(!refresh) {
			self.chatCache.push(msgText);
		}
	};
	
	this.resizeGameTable = function()
	{
		var gameArea = document.getElementById('gameArea');
		var widthToHeight = 1024 / 600;
		var newWidth = parseInt(window.innerWidth);
		var newHeight = parseInt(window.innerHeight);
		var newWidthToHeight = newWidth / newHeight;
		if (newWidthToHeight > widthToHeight) {
			newWidth = parseInt(newHeight * widthToHeight);
//set minimum size
			if (newWidth <= 669) {
				newWidth = 669;
				newHeight = 392;
			}
			gameArea.style.height = newHeight + 'px';
			gameArea.style.width = newWidth + 'px';
		}
		else {
			newHeight = parseInt(newWidth / widthToHeight);
// set minimum size
			if (newHeight <= 392) {
				newWidth = 669;
				newHeight = 392;
			}
			gameArea.style.width = newWidth + 'px';
			gameArea.style.height = newHeight + 'px';
		}
		gameArea.style.marginTop = 0 + 'px';
		gameArea.style.marginLeft = 0 + 'px';
		var gameCanvas = document.getElementById('gameCanvas');
		gameCanvas.width = newWidth;
		gameCanvas.height = newHeight;
		var gameCanvas2 = document.getElementById('gameCanvas2');
		gameCanvas2.width = newWidth;
		gameCanvas2.height = newHeight;
		var gameCanvas3 = document.getElementById('gameCanvas3');
		gameCanvas3.width = newWidth;
		gameCanvas3.height = newHeight;
		var gameCanvas4 = document.getElementById('gameCanvas4');
		gameCanvas4.width = newWidth;
		gameCanvas4.height = newHeight;
		var gameCanvas5 = document.getElementById('gameCanvas5');
		gameCanvas5.width = newWidth;
		gameCanvas5.height = newHeight;
		var gameCanvas6 = document.getElementById('gameCanvas6');
		gameCanvas6.width = newWidth;
		gameCanvas6.height = newHeight;
		var gameCanvas7 = document.getElementById('gameCanvas7');
		gameCanvas7.width = newWidth;
		gameCanvas7.height = newHeight;//write global variables
		myWidth = newWidth;
		myHeight = newHeight;
//now draw again
		self.refreshAll();
		myCards.refreshAll();
	};
	
	this.setActiveState = function(active) {
		if (active) {
			self.isActive = true;
			window.addEventListener('resize', self.resizeGameTable, false);
			window.addEventListener('orientationchange', self.resizeGameTable, false);
			self.resizeGameTable();
		}
		else {
			self.isActive = false;
			window.removeEventListener('resize', self.resizeGameTable, false);
			window.removeEventListener('orientationchange', self.resizeGameTable, false);
		}
	};
	
//HELPER
	this.getCurrentSeatState = function(playerId)
	{
		if(myNetCache.getPlayerData(playerId).gameValues.active) {
			if(myNetCache.getPlayerData(playerId).gameValues.sessionActive) {
				return self.SEAT_STATE.ACTIVE;
			} else {
				return self.SEAT_STATE.AUTOFOLD;
			}
		} else {
			if(myNetCache.getPlayerData(playerId).gameValues.stayOnTable) {
				return self.SEAT_STATE.STAYONTABLE;
			} else {
				return self.SEAT_STATE.CLEAR;
			}
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

function initGameTableImpl()
{
	myGameTable = new GameTableImpl();
	myGameTable.setupSeats();
}

window.addEventListener("load", initGameTableImpl, false);
