/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
mySoundPlayer = new Object();

/**
 * class SoundPlayer
 * @constructor
 */
function SoundPlayer()
{
	var self = this;
	this.extension = "";
	this.sounds = {};
	this.activeSounds = [];

	this.initialize = function()
	{
		var audioElement = document.createElement("audio");
		
		if (typeof audioElement.canPlayType == "function")
		{
			if (audioElement.canPlayType("audio/mpeg") === "probably")
			{
				self.extension = "mp3";
			}
			else if (audioElement.canPlayType("audio/ogg codecs='vorbis'") === "probably")
			{
				self.extension = "ogg";
			}
			else if (audioElement.canPlayType("audio/mpeg") === "maybe")
			{
				self.extension = "mp3";
			}
			else if (audioElement.canPlayType("audio/ogg codecs='vorbis'") === "maybe")
			{
				self.extension = "ogg";
			}
		}
	};

	this.createAudio = function(name)
	{
		var audioElement = new Audio("sounds/" + name + "." + self.extension);
		audioElement.addEventListener("ended", function(){ self.cleanActive(); }, false);

		self.sounds[name] = self.sounds[name] || [];
		self.sounds[name].push(audioElement);
		return audioElement;
	};

	this.cleanActive = function()
	{
		for (var i = 0; i < self.activeSounds.length; i++)
		{
			if (self.activeSounds[i].ended)
			{
				self.activeSounds.splice(i, 1);
			}
		}
	};

	this.getAudioElement = function(name)
	{
		if (self.sounds[name])
		{
			for (var i = 0, n = self.sounds[name].length; i < n; i++)
			{
				if (self.sounds[name][i].ended)
				{
					return self.sounds[name][i];
				}
			}
		}
		return self.createAudio(name);
	};

	this.play = function(name)
	{
		if (self.extension !== "")
		{
			var audioObj = self.getAudioElement(name);
			audioObj.play();
			self.activeSounds.push(audioObj);
		}
	};

	this.stop = function()
	{
		for (var i = self.activeSounds.length-1; i >= 0; i--)
		{
			self.activeSounds[i].stop();
		}
		self.activeSounds = [];
	};
}


function initSoundPlayer()
{
	mySoundPlayer = new SoundPlayer();
	mySoundPlayer.initialize();
}

window.addEventListener("load", initSoundPlayer, false);
