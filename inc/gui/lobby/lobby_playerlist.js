/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myLobbyPlayerList = new Object();

/**
 * class LobbyPlayerListImpl
 * @constructor
 */
function LobbyPlayerListImpl()
{
	var self = this;	
	this.isActive = false;
	$("#lobbyPlayerList").append('<ul id="playerList" data-role="listview data-filter="true"></ul>'); //data-autodividers="true" data-sort="true"
	$("#lobbyPlayerListButton").html("Players ("+$('.lobbyPlayerList-playerItem').length+")");

	// class members
	this.prepare = function() {
		$("#lobbyPlayerList").append('<ul id="playerList" data-role="listview data-filter="true""></ul>'); //data-autodividers="true" data-sort="true"
	};
	
	this.addPlayer = function(playerId) 
	{
		var playerNameString = "";
		var avatarFileName = "";
		if(myNetCache.hasPlayerData(playerId)) {
			playerNameString = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
			avatarFileName = myNetCache.getPlayerData(playerId).avatarFileName;
			if(avatarFileName != "") { avatarFileName = avatarServerURL + avatarFileName; }
			else { avatarFileName = "gfx/pokerTH_50x50_alpha50.png"; }
		}
		else {
			playerNameString = "id"+playerId;
			avatarFileName = "gfx/pokerTH_50x50_alpha50.png";
		}
		var playerString = '<li class="lobbyPlayerList-playerItem" id="lobbyPlayerList_playerId-'+playerId+'"> '+
			'<div class="lobbyPlayerList-playerAvatarDiv"><img class="lobbyPlayerList-playerAvatar" id="lobbyPlayerList_playerAvatar-'+playerId+'" width="50" height="50" border="0" src="'+avatarFileName+'"></div> '+
			'<div class="lobbyPlayerList-playerNameGameInfosDiv"><h3 class="lobbyPlayerList-playerName" id="lobbyPlayerList_playerName-'+playerId+'">'+playerNameString+'</h3> '+
			'<p id="lobbyPlayerList_gameInfos-'+playerId+'"><i>This player is currently idle &nbsp;</i></p></div> '+
			'<div class="lobbyPlayerList-spectatorButtonDiv" id="lobbyPlayerList_spectatorButton-'+playerId+'"></div>'+
			'</li>';
		$("#playerList").append(playerString);
		$("#playerList").listview({ filter: true });
		self.updatePlayerListView();
		self.updatePlayerStats();
	};
        
	this.removePlayer = function(playerId) 
	{
		$("#lobbyPlayerList_playerId-"+playerId).remove();	
		self.updatePlayerListView();
		self.updatePlayerStats();
	};

	this.updatePlayer = function(playerId) 
	{
		var playerName = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
		$('#lobbyPlayerList_playerName-'+playerId).html(playerName);
		var avatarFileName = myNetCache.getPlayerData(playerId).avatarFileName;
		if(avatarFileName != "") { avatarFileName = avatarServerURL + avatarFileName; }
		else { avatarFileName = "gfx/pokerTH_50x50_alpha50.png"; }
		$('#lobbyPlayerList_playerAvatar-'+playerId).attr("src", avatarFileName);
		self.updatePlayerListView();
	};
	
	this.playerAddGame = function(gameId, playerId)
	{
		var gameName = myNetCache.getGameData(gameId).gameInfo.gameName;
		$("#lobbyPlayerList_gameInfos-"+playerId).html("This player is playing at: <b>"+gameName+"</b>");
		$("#lobbyPlayerList_spectatorButton-"+playerId).append('<a class="lobbyPlayerList_spectatorButton" id="spectateButton-'+playerId+'" href="" data-gameid="'+gameId+'" data-role="button" data-icon="search">Spectate</a>');
		$("#spectateButton-"+playerId).button();
		$("#lobbyPlayerList").delegate('#spectateButton-'+playerId, "click", function(){
			var $this = $(this),
			myGameId = $this.data('gameid');
			myNetCache.callbackSpectateGame(myGameId);
		});
	};

	this.spectatorAddGame = function(gameId, playerId)
	{
		var gameName = myNetCache.getGameData(gameId).gameInfo.gameName;
		$("#lobbyPlayerList_gameInfos-"+playerId).html("This player is watching: <b>"+gameName+"</b>");
	};
	
	this.playerRemoveGame = function(gameId, playerId)
	{
		$("#lobbyPlayerList_gameInfos-"+playerId).html("<i>This player is currently idle &nbsp;</i>");
		$("#spectateButton-"+playerId).remove();
	};

	this.spectatorRemoveGame = function(gameId, playerId)
	{
		$("#lobbyPlayerList_gameInfos-"+playerId).html("<i>This player is currently idle &nbsp;</i>");
	};

	this.addGameInfos = function(gameId) 
	{
		playerIdArray = myNetCache.getGameData(gameId).playerIds;
		for (var i = 0; i < playerIdArray.length; i++) {      
			self.playerAddGame(gameId, playerIdArray[i]);
		}
		spectatorIdArray = myNetCache.getGameData(gameId).spectatorIds;
		for (var i = 0; i < spectatorIdArray.length; i++) {      
			self.spectatorAddGame(gameId, spectatorIdArray[i]);
		}
	};

	this.updatePlayerListView = function()
	{
		if(self.isActive) {
			$('#playerList').listview('refresh');
		}
	}

	this.updatePlayerStats = function()
	{
		$("#lobbyPlayerListButton").html("Players ("+$('.lobbyPlayerList-playerItem').length+")");
	}

	this.setActiveState = function(active) 
	{
		if(active) {
			self.isActive = true;
			$("#lobbyPlayerList").show();
		}
		else {
			self.isActive = false;
			$("#lobbyPlayerList").hide();
		}
	};
};

function initLobbyPlayerListImpl()
{
	myLobbyPlayerList = new LobbyPlayerListImpl();
}

window.addEventListener("load", initLobbyPlayerListImpl, false);
