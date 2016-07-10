/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myLobbyChat = new Object();

/**
 * class LobbyChatImpl
 * @constructor
 */
function LobbyChatImpl()
{
	var self = this;	
	this.isActive = false;
//	this.chatCache = new Array();
	var height = $(window).height();
	height = height-90;
	$("#lobbyChat").append('<div id="chatTextArea" style="padding: 0px; width:100%; height:'+height+'px; overflow-y:scroll;"></div>');	
	$("#lobbyChatButton").html("Chat");

	//class members
	this.prepare = function() {
		$("#lobbyChat").append('<div id="chatTextArea" style="padding: 0px; width:100%; height:'+height+'px; overflow-y:scroll;"></div>');	
	};
	
	this.receiveMessage = function(playerId, msgText) 
	{
		var playerName = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
		var tmpMsg;
		if(msgText.match("^/me ")=="/me ") {
			msgText = msgText.replace(/\/me /g, "<b>*"+playerName+"</b> ");
			tmpMsg = '<span id="game_chat_text" style="font-style:italic;">'+msgText+'</span></br>';
		}
		else {
			tmpMsg = '<span id="game_chat_text"><b>'+playerName+':</b> '+msgText+'</span></br>';
		}
		self.finalReceiveMsg(tmpMsg);
	};
	
	this.receivePrivateMessage = function(playerId, msgText) 
	{
		var playerName = myNetCache.getPlayerData(playerId).playerInfoData.playerName;
		var tmpMsg = '<span id="lobby_chat_text" style="font-style:italic;">'+playerName+'(pm): '+msgText+'</span></br>'
		self.finalReceiveMsg(tmpMsg);
	};
	
	this.receiveGlobalNotice = function(msgText) 
	{
		var tmpMsg = '<span id="lobby_chat_text" style="font-weight:bold;">(global notice) '+msgText+'</span></br>';
		self.finalReceiveMsg(tmpMsg);
	};
	
	this.receiveChatBotNotice = function(msgText) 
	{
		var tmpMsg = '<span id="lobby_chat_text" style="color:red;">(chat bot) '+msgText+'</span></br>';
		self.finalReceiveMsg(tmpMsg);
	};
	
	this.finalReceiveMsg = function(msgText, refresh) 
	{
//		if(self.isActive) {
		$("#chatTextArea").append(msgText);
		$("#chatTextArea").scrollTop($('#chatTextArea')[0].scrollHeight);
//		}
//		if(!refresh) {
//			self.chatCache.push(msgText);
//		}
	};
	
	
	this.resize = function() 
	{
		var height = $(window).height();
		height = height-90;
		$("#chatTextArea").css( {'height' : height+'px' });
		$("#chatTextArea").scrollTop($('#chatTextArea')[0].scrollHeight);
	};

	this.updateChatStats = function()
	{
		$("#lobbyChatButton").html("Chat");
	}
	
	this.setActiveState = function(active) 
	{
		if(active) {
			self.isActive = true;
			$("#lobbyChat").show();
//			if(self.chatCache.length > 0) {
//				for (var i = 0; i < self.chatCache.length; i++) {
//					var refresh = true;
//					self.finalReceiveMsg(self.chatCache[i], refresh);
//				}
//			}
		}
		else {
			self.isActive = false;
			$("#lobbyChat").hide();
		}
	};
	
};

function initLobbyChatImpl()
{
	myLobbyChat = new LobbyChatImpl();
}

window.addEventListener("load", initLobbyChatImpl, false);
