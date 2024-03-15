/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
mySoundEvents = new Object();

/**
 * class SoundEvents
 * @constructor
 */
function SoundEvents()
{
	var self = this;
	
	this.currentActionNotification = function(action) {
		if (myConfig.get("PlaySoundEvents"))
		{
			switch(action) {
				case 1: mySoundPlayer.play("fold");
					break;
				case 2: mySoundPlayer.play("check");
					break;
				case 3: mySoundPlayer.play("call");
					break;
				case 4: mySoundPlayer.play("bet");
					break;
				case 5: mySoundPlayer.play("raise");
					break;
				case 6: mySoundPlayer.play("allin");
					break;
				default:;
			}
		}
	};
}

function initSoundEvents()
{
	mySoundEvents = new SoundEvents();
}

window.addEventListener("load", initSoundEvents, false);
