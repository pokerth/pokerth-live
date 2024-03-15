/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myGui = new Object();

/**
 * class GuiImpl
 * @constructor
 */
function GuiImpl()
{
	var self = this;
	this.currentVisibleMessageBoxId = "";
	$("#lobbyGameListButton").click(function(){ myLobby.showGameList(); });
	$("#lobbyPlayerListButton").click(function(){ myLobby.showPlayerList(); });
	$("#lobbyChatButton").click(function(){ myLobby.showChat(); });

	// interface functions
	this.signalNetClientShowLoginDialog = function() { 
		myLoginDialog.showLogin();
	};
	this.signalNetClientReload = function() { 
		location.reload();
	};
	this.signalNetClientConnected = function(nickName) { 
		myLobby.clientConnected(nickName);  
		myLoginDialog.hideLogin();
	};
	this.signalNetClientDisconnected = function() { 
		myLobby.clientDisconnected(); 
	};
	this.signalBeginInitialLobbyUpdate = function() { myLobby.showLoadingMsg(); };
	this.signalEndInitialLobbyUpdate = function() { myLobby.hideLoadingMsg(); };
	this.signalNetClientNetworkError = function(msg) { this.showMyMessageBox("NetworkError", "Network Error", msg, "Close"); };
	this.signalNetClientServerError = function(msg) { this.showMyMessageBox("ServerError", "Server Error", msg, "Close"); };
	this.signalNetClientServerMessage = function(msg) { this.showMyMessageBox("ServerMessage", "Server Message", msg, "Close"); };
	this.signalNetClientShowGameTable = function(gameId) { 
		myGui.gameTableVisible(true); 
		myGui.lobbyVisible(false); 
	};
	this.signalNetClientPlayerJoined = function(playerId) { myLobbyPlayerList.addPlayer(playerId); };
	this.signalNetClientPlayerLeft = function(playerId) { myLobbyPlayerList.removePlayer(playerId); };
	this.signalNetClientGameListNew = function(gameId) { 
		myLobbyGameList.addGame(gameId); 
		myLobbyPlayerList.addGameInfos(gameId); 
	};
	this.signalNetClientGameListUpdate = function(gameId) { myLobbyGameList.updateGame(gameId); };
	this.signalNetClientGameListRemove = function(gameId) { myLobbyGameList.removeGame(gameId); };
	this.signalNetClientGameListPlayerJoined = function(gameId, playerId) { 
		myLobbyGameList.gameAddPlayer(gameId, playerId); 
		myLobbyPlayerList.playerAddGame(gameId, playerId); 
	};
	this.signalNetClientGameListPlayerLeft = function(gameId, playerId) { 
		myLobbyGameList.gameRemovePlayer(gameId, playerId); 
		myLobbyPlayerList.playerRemoveGame(gameId, playerId); 
	};
	this.signalNetClientGameListSpectatorJoined = function(gameId, playerId) { 
		if(myLobby.isActive) {
			myLobbyGameList.updateGame(gameId);
			myLobbyPlayerList.spectatorAddGame(gameId, playerId); 
		} 
	};
	this.signalNetClientGameListSpectatorLeft = function(gameId, playerId) { 
		if(myLobby.isActive) {
			myLobbyGameList.updateGame(gameId);
			myLobbyPlayerList.spectatorRemoveGame(gameId, playerId); 
		}
	};
	this.signalNetClientPlayerChanged = function(playerId) { 
		myLobbyPlayerList.updatePlayer(playerId); 
		myLobbyGameList.updatePlayer(playerId); 
		myGameTable.refreshPlayerNicks(); 
	};
	this.signalNetClientPlayerIdChanged = function(oldPlayerId, newPlayerId) { };
	this.signalNetClientWaitGameStart = function(gameId) { 
		var waitText = "Please wait until <b>the game</b> starts ...";
		myLobby.showWaitStartMsg(gameId, waitText); 
	};
	this.signalNetClientWaitHandStart = function(gameId) { 
		var waitText = "Please wait until <b>the next hand</b> starts ...";
		myLobby.showWaitStartMsg(gameId, waitText); 
	};
	this.signalNetClientGameSpectatorJoined = function(playerId) { 
		if(myGameTable.isActive) {
			myGameTable.refreshSpectatorLabel();
		} 
	};
	this.signalNetClientGameSpectatorLeft = function(playerId) { 
		if(myGameTable.isActive) {
			myGameTable.refreshSpectatorLabel();
		}
	};
	this.signalNetClientHandStart = function() { myGameTable.handStart(); };
	this.signalNetClientCurrentPlayerChanged = function() { myGameTable.refreshActivePlayer(); };
	this.signalNetClientPlayersActionDone = function(playerId) { myGameTable.playersActionDone(playerId); };
	this.signalNetClientDealFlopCards = function() { myGameTable.dealTableCards(BERO.FLOP); };
	this.signalNetClientDealTurnCard = function() { myGameTable.dealTableCards(BERO.TURN); };
	this.signalNetClientDealRiverCard = function() { myGameTable.dealTableCards(BERO.RIVER); };
	this.signalNetClientShowCards = function(playerId) { myGameTable.showHoleCards(playerId); };
	this.signalNetClientEndOfHand = function() { myGameTable.distributePot(); };
	this.signalNetClientRemovedFromGame = function(gameId) { 
		if(!myLobby.isActive) {
			myGui.gameTableVisible(false); 
			myLobby.clearLobby();
			myGui.lobbyVisible(true);
		}
		else {
			myLobby.hideWaitStartGameMsg();
		}
	};
	this.signalNetClientLobbyChatMsg = function(playerId, msg) { myLobbyChat.receiveMessage(playerId, msg); };
	this.signalNetClientPrivateChatMsg = function(playerId, msg) { myLobbyChat.receivePrivateMessage(playerId, msg); };
	// this.signalNetClientGameChatMsg = function(gameId, playerId, msg) { myGameTable.receiveChatMessage(playerId, msg); };
	this.signalNetClientGlobalNotice = function(msg) { myLobbyChat.receiveGlobalNotice(msg); };
	this.signalNetClientChatBotNotice = function(playerId, msg) { myLobbyChat.receiveChatBotNotice(playerId, msg); };
	this.signalNetClientMsgBox = function(msg) { this.showMyMessageBox("GlobalNotice", "Global Notice", msg, "Close"); };
	this.signalNetClientShowTimeoutDialog = function(msgId, timeout) { this.showTimeOutMessageBox(msgId, timeout); };
	
	// DEFINE public funtions
	this.showMyMessageBox = function(id, title, message, buttonText) 
	{   
		var show = function(){
			self.currentVisibleMessageBoxId = id;
			var page = $('#lobbyPage');
			var popup = $('<div data-role="popup" id="'+id+'" data-overlay-theme="a" data-theme="c" style="max-width:400px;" class="ui-corner-all"></div>').appendTo( page );
			var header = $('<div data-role="header" data-theme="a" class="ui-corner-top"><h1>'+title+'</h1></div>').appendTo( popup );
			var content = $('<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content"><h3 class="ui-title">'+message+'</h3><a href="" data-role="button" data-inline="true" data-rel="back" data-theme="c">'+buttonText+'</a></div> ').appendTo( popup );
			popup.popup();
			popup.popup("open");
			popup.popup("option", "positionTo", "window" );
			page.page('destroy').page();
			
			// HACK until the reload signal is triggered from network engine
			if(message == "Your player name is already in use.")
			{
				var reload = function(){ location.reload(); }
				setTimeout(reload, 2000);
			}
		};
		
		if(self.currentVisibleMessageBoxId != "") {
			$("#"+self.currentVisibleMessageBoxId).popup("close");
			$("#"+self.currentVisibleMessageBoxId).remove();
			setTimeout(show, 100);
		}
		else {
			show();
		}
		
	};
	
	this.showTimeOutMessageBox = function(msgId, timeout)
	{
		var msgText;
		msgText = "Your connection is about to time out due to inactivity in <span>"+timeout+"</span> seconds.<br><br>Please click OK to stop the countdown!";
        
		var show = function(){
			self.currentVisibleMessageBoxId = "timeOutMessageBox";
			var page;
			// differend pages for lobby or gametable
			if(myLobby.isActive) {
				page = $('#lobbyPage');
			}
			else if(myGameTable.isActive) {
				 page = $('#gameArea');
			}
			var popup = $('<div data-role="popup" id="timeOutMessageBox" data-overlay-theme="a" data-theme="c" style="max-width:400px;" class="ui-corner-all"></div>').appendTo( page );
			var header = $('<div data-role="header" id="header_timeOutMessageBox" data-theme="a" class="ui-corner-top ui-header ui-bar-a" role="banner"><h1 class="ui-title" role="heading" aria-level="1">Timeout Warning</h1></div>').appendTo( popup );
			var content = $('<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content"> '+
								'<h3 class="ui-title" id="countdown">'+msgText+'</h3> '+
								'<a id="timeOutMessageBoxResetButton" href="" data-role="button" data-inline="true" data-theme="c">OK</a> '+
							'</div> ').appendTo( popup );
			popup.popup();
			$("#timeOutMessageBoxResetButton").button();
			popup.popup("open");
			popup.popup("option", "positionTo", "window" );	
			var sec = timeout;
			var timer = setInterval(function() {
				$('#countdown span').animate({
					opacity: 0.25,
					fontSize: '1.5em'
				}, 500, function() {
					$('#countdown span').css('opacity', 1);
					$('#countdown span').css('font-size', '1.5em');
					$('#countdown span').text(sec--);
				})

				if (sec == 0) {
					$('#countdown span').text(0);
					clearInterval(timer);
				}
			}, 1000);
			$("#timeOutMessageBoxResetButton").click(function(){
				myGui.resetServerTimeOut();
			});
        };
		
		if(self.currentVisibleMessageBoxId != "") {
			$("#"+self.currentVisibleMessageBoxId).popup("close");
			$("#"+self.currentVisibleMessageBoxId).remove();
			setTimeout(show, 100);
		}
		else {
			show();
		}
		
	};
	
	this.resetServerTimeOut = function() 
	{	
		myNetCache.callbackResetServerTimeout();
		$("#timeOutMessageBox").popup("close");
		$("#timeOutMessageBox").remove();
			
	};
	
	this.gameTableVisible = function(visible) 
	{ 
		if(visible === true) {
			var gameArea = document.getElementById('gameArea');
			var gameAreaBg = document.getElementById('gameAreaBg');
			gameArea.style.display = "";
			gameAreaBg.style.display = "";
			myGameTable.setActiveState(true);
		} 
		else {
			var gameArea = document.getElementById('gameArea');
			var gameAreaBg = document.getElementById('gameAreaBg');
			gameArea.style.display = "none";
			gameAreaBg.style.display = "none";
			myGameTable.setActiveState(false);
		}
	};
	
	this.lobbyVisible = function(visible) 
	{ 
		if(visible === true) {
			var lobbyArea = document.getElementById('lobbyArea');
			lobbyArea.style.display = "";
			myLobby.setActiveState(true);
		} 
		else {
			var lobbyArea = document.getElementById('lobbyArea');
			lobbyArea.style.display = "none";
			myLobby.setActiveState(false);
		}
	};
};

function initGuiImpl()
{
	myGui = new GuiImpl();
	myGui.gameTableVisible(false);
	myLobby.clearLobby();
	myGui.lobbyVisible(true);
	
	myLoginDialog.showLogin();
}

window.addEventListener("load", initGuiImpl, false);
