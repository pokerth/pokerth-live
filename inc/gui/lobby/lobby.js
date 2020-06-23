/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myLobby = new Object();

/**
 * class LobbyImpl
 * @constructor
 */
function LobbyImpl()
{
	var self = this;
	this.isActive = false;
	this.currentWaitingGameId = 0;
	$("#lobby-version-info").html("v"+POKERTH_BETA_RELEASE_STRING);
	
	this.clearLobby = function()
	{
		$("#lobbyGameList").html("");
		$("#lobbyPlayerList").html("");
		$("#lobbyChat").html("");
		myLobbyChat.prepare();
		myLobbyGameList.prepare();
		myLobbyGameList.updateGameStats();
		myLobbyPlayerList.prepare();
		myLobbyPlayerList.updatePlayerStats();
	};
        
	this.clientConnected = function(nickName) 
	{
		$("#lobby-user-loggedIn").html(nickName);
		$("#lobby-user-loggedIn").addClass('online');
	}
	
	this.clientDisconnected = function() 
	{
		$("#lobby-user-loggedIn").html("offline");
		$("#lobby-user-loggedIn").addClass('offline');
	}
		
	this.showGameList = function() 
	{
		myLobbyGameList.setActiveState(true);
		$('.header-navbar .navbar-btn > a').removeClass('btn-selected');
		$('#lobbyGameListButton').addClass('btn-selected');
		myLobbyChat.setActiveState(false);
		myLobbyPlayerList.setActiveState(false);
	};
       
	this.showPlayerList = function() 
	{
		myLobbyPlayerList.setActiveState(true);
		$('.header-navbar .navbar-btn > a').removeClass('btn-selected');
		$('#lobbyPlayerListButton').addClass('btn-selected');
		myLobbyChat.setActiveState(false);
		myLobbyGameList.setActiveState(false);
		myLobbyPlayerList.updatePlayerListView();
	};
	 
	this.showChat = function() 
	{
		myLobbyChat.setActiveState(true);
		$('.header-navbar .navbar-btn > a').removeClass('btn-selected');
		$('#lobbyChatButton').addClass('btn-selected');
		myLobbyGameList.setActiveState(false);
		myLobbyPlayerList.setActiveState(false);
	};
	
	this.showWaitStartMsg = function(gameId, waitText) 
	{
		var show = function() {
			myGui.currentVisibleMessageBoxId = "waitStartGameMsg";
			var page = $('#lobbyPage');
			var popup = $('<div data-role="popup" id="waitStartGameMsg" data-dismissible="false" data-overlay-theme="a" data-theme="c" style="max-width:400px;" class="ui-corner-all"></div>').appendTo( page );
			var header = $('<div data-role="header" data-theme="a" class="ui-corner-top"><h1>Waiting ...</h1></div>').appendTo( popup );
			var content = $('<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content">'+
								'<h3 class="ui-title">Joined game as Spectator. <br>'+waitText+'</h3>'+
								'<a id="waitStartGameMsgCancelButton" data-gameid="'+gameId+'" href="" data-role="button" data-inline="true" data-theme="c">Cancel</a>'+
							'</div> ').appendTo( popup );

			popup.popup();
			popup.popup("open");
			popup.popup("option", "positionTo", "window" );
			page.page('destroy').page();
			$('#waitStartGameMsgCancelButton').click(function(){
				var $this = $(this),
				myGameId = $this.data('gameid');
				myNetCache.callbackLeaveGame(myGameId);
			});
		
		}
		if(myGui.currentVisibleMessageBoxId != "") {
			$("#"+myGui.currentVisibleMessageBoxId).popup("close");
			$("#"+myGui.currentVisibleMessageBoxId).remove();
			setTimeout(show, 100);
		}
		else {
			show();
		}
	};
	
	this.hideWaitStartGameMsg = function() 
	{
		$("#waitStartGameMsg").popup("close");
		$("#waitStartGameMsg").remove();
	};
	
	this.showLoadingMsg = function()
	{
		var show = function() {
			myGui.currentVisibleMessageBoxId = "loadingLobbyMsg";
			var page = $('#lobbyPage');
			var popup = $('<div data-role="popup" id="loadingLobbyMsg" data-dismissible="false" data-overlay-theme="a" data-theme="c" style="width:300px;" class="ui-corner-all"></div>').appendTo( page );
			var header = $('<div data-role="header" data-theme="a" class="ui-corner-top"><h1>Please wait</h1></div>').appendTo( popup );
			var content = $('<div style="height: 40px;" data-role="content" data-theme="d" class="ui-corner-bottom ui-content">'+
								'<img style="float: left; margin-top: -13px; margin-right: 10px;" width="64" height="64" src="gfx/pokerth.png"><h3 class="ui-title">PokerTH-live is loading ...</h3> '+
							'</div> ').appendTo( popup );

			popup.popup();
			popup.popup("open");
			popup.popup("option", "positionTo", "window" );
			page.page('destroy').page();
		}
		
		// show loading msg only if there is no other popup visible currently, except login-dialog which will be closed
		if(myGui.currentVisibleMessageBoxId == "") {
			show();
		}
		else if(myGui.currentVisibleMessageBoxId == "loginDialog") {
			$("#"+myGui.currentVisibleMessageBoxId).popup("close");
			$("#"+myGui.currentVisibleMessageBoxId).remove();
			setTimeout(show, 100);
		}
		
	};
	
	this.hideLoadingMsg = function()
	{
		$("#loadingLobbyMsg").popup("close");
		$("#loadingLobbyMsg").remove();
	};
	
	this.setActiveState = function(active) {
		
		if(active) {
			self.isActive = true;
		}
		else {
			self.isActive = false;
			self.hideWaitStartGameMsg();		
		}
	};
};

function initLobbyImpl()
{
	myLobby = new LobbyImpl();
	myLobby.showGameList();
}

window.addEventListener("load", initLobbyImpl, false);
