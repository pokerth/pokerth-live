/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myButtons = new Object();

/**
 * class ButtonsImpl
 * @constructor
 */
function ButtonsImpl()
{
	var self = this;
	$("#gameArea").append('<div id="tableMenuButtonContainer"><a id="tableMenuButton" href="" data-role="button" data-icon="gear" data-mini="true" data-theme="a">Settings</a></div>');
	$("#tabelMenuButtonContainer").hide();
	$("#gameArea").append('<div id="tableMenuPopup" data-role="popup" class="ui-content">' +
                                    '<a id="tableMenuPopupCloseIcon" href="" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>' +
                                    '<a id="tableLobbyButton" href="" data-mini="true" data-role="button" data-icon="back" data-iconpos="left" data-theme="a" data-inline="true">Back to the lobby</a> ' +
                                    '<div id="tableSettingsCheckboxes" data-role="fieldcontain"> ' +
                                        '<fieldset data-role="controlgroup"> ' +
                                            '<input type="checkbox" name="tableSettings_checkbox-soundOnOff" id="tableSettings_checkbox-soundOnOff" class="custom" /> ' +
                                            '<label for="tableSettings_checkbox-soundOnOff">Sound on</label> ' +
                                        '</fieldset> ' +
                                    '</div>' +
                                '</div>');
	$("#tableMenuPopup").popup();
	$("#tableMenuPopup").on("popupafterclose", function() { 
		if($("#tableSettings_checkbox-soundOnOff").is(':checked')) {
			myConfig.set("PlaySoundEvents", true);
		}
		else {
			myConfig.set("PlaySoundEvents", false);
		}
	});
	
	$("#tableMenuButton").click(function() {
		$("#tableMenuPopupCloseIcon").button();
		$("#tableLobbyButton").button();
		$("input[type='checkbox']").checkboxradio();
		$("#tableSettings_checkbox-soundOnOff").prop('checked', myConfig.get("PlaySoundEvents")).checkboxradio('refresh');
		$("#tableMenuPopup").show();
		$("#tableMenuPopup").popup( "open" );
	});
	
	$("#tableLobbyButton").click(function() {
		$("#tableMenuPopup").popup( "close" );
		$("#tableMenuPopup").hide();
		myNetCache.callbackLeaveGame(myNetCache.getNetGame().getGameData().gameId);
	});
	
	this.refreshAll = function() 
	{	
		self.refreshMenuButton();
	};

	this.refreshMenuButton = function() 
	{
		$("#tableMenuButtonContainer").show();
		$("#tableMenuButton").button().ready( function() {
			$("#tableMenuButtonContainer").css( {
				'top' : '0px',
				'position' : 'absolute',
				'z-index' : '1000' 
			} );
			$("#tableMenuButtonContainer").css( {
				'left' : (myWidth-$("#tableMenuButtonContainer").width())+'px'
			} );
		});
	};
};
