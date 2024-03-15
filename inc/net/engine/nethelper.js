/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myNetHelper = new Object();

/**
 * class NetHelper
 * @constructor
 */
function NetHelper()
{
	this.convertBytesToHexString = function(bytesArray)
	{
		var hexArray = new Array();
		for (var pos = 0; pos < bytesArray.length; pos++)
		{
			hexArray.push((bytesArray[pos] >>> 4).toString(16));
			hexArray.push((bytesArray[pos] & 0x0F).toString(16));
		}
		return hexArray.join("");
	};

	this.convertAvatarTypeToString = function(avatarType)
	{
		var typeStr = "";
		switch(avatarType)
		{
			case PokerTH.NetAvatarType.netAvatarImagePng :
				typeStr = ".png";
				break;
			case PokerTH.NetAvatarType.netAvatarImageJpg :
				typeStr = ".jpg";
				break;
			case PokerTH.NetAvatarType.netAvatarImageGif :
				typeStr = ".gif";
				break;
		}
		return typeStr;
	};
}

function initNetHelper()
{
	myNetHelper = new NetHelper();
}

window.addEventListener("load", initNetHelper, false);
