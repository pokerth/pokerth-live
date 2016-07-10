/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
myLoginDialog = new Object();

/**
 * class LoginDialogImpl
 * @constructor
 */
function LoginDialogImpl()
{
	var self = this;
	
	this.showLogin = function()
	{
		var show = function() {
			myGui.currentVisibleMessageBoxId = "loginDialog";
			var page = $('#lobbyPage');
			var popup = $('<div data-role="popup" id="loginDialog" data-dismissible="false" data-overlay-theme="a" data-theme="c" style="max-width:400px;" class="ui-corner-all" data-history="false"></div>').appendTo( page );
			var header = $('<div data-role="header" data-theme="a" class="ui-corner-top"><h1>Login</h1></div>').appendTo( popup );
			var content = $('<div data-role="content" data-theme="d" class="ui-corner-bottom ui-content"> '+
								'<form> '+
									'<label for="checkbox-registeredPlayer">Registered player login</label> '+
									'<input type="checkbox" name="checkbox-registeredPlayer" id="checkbox-registeredPlayer" checked="checked"></input> '+
									'<input type="text" name="text-LoginDialog-username" id="text-LoginDialog-username" value="" placeholder="username"> '+
									'<input type="password" name="text-LoginDialog-password" id="text-LoginDialog-password" value="" autocomplete="off" placeholder="password"> '+
									'<label for="checkbox-guestPlayer">Guest player login</label> '+
									'<input type="checkbox" name="checkbox-guestPlayer" id="checkbox-guestPlayer"></input> '+
								'</form> '+
								'<p style="font-style:italic;">Login may take some time, please be patient ...</p> '+
								'<a id="loginDialogLoginButton" href="" data-role="button" data-inline="true" data-theme="c">Login</a> '+
								'<a id="loginDialogCancelButton" href="" data-role="button" data-inline="true" data-theme="c">Cancel</a> '+
								'<br><a target="_blank" href="http://www.poker-heroes.com/register.html">Create your PokerTH gaming account ...</a> '+
							'</div> ').appendTo( popup );

			popup.popup();
			popup.popup("open");
			popup.popup("option", "positionTo", "window" );
			page.page('destroy').page();
			$('#loginDialogLoginButton').removeClass('ui-disabled');
			$('#text-LoginDialog-username').focus();
			//enter should click the login button
			$(function() {
				$("#text-LoginDialog-password").keypress(function (e) {
					if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
						if(!$('#loginDialogLoginButton').hasClass('ui-disabled')) {
							$('#loginDialogLoginButton').click();
						}
						return false;
					} else {
						return true;
					}
				});
			});
			$('#loginDialogLoginButton').click(function(){
				$('#loginDialogLoginButton').addClass('ui-disabled');
				if($("#checkbox-registeredPlayer").is(':checked')) {
					var userName = $( "#text-LoginDialog-username" ).val();
					var password = $( "#text-LoginDialog-password" ).val();
					myNetEventHandler.connect(userName, password);
				}
				else {
					myNetEventHandler.connect();
				}
			});
			$('#loginDialogCancelButton').click(function(){
				self.hideLogin();
			});
			$('#checkbox-registeredPlayer').click(function(){
				if($("#checkbox-registeredPlayer").is(':checked')) {
					$("#checkbox-guestPlayer").prop( "checked", false ).checkboxradio( "refresh" );
					$("#text-LoginDialog-username").textinput( "enable" );
					$("#text-LoginDialog-password").textinput( "enable" );
				}
				else {
					$('#checkbox-guestPlayer').click();
				}
			});
			$('#checkbox-guestPlayer').click(function(){
				if($("#checkbox-guestPlayer").is(':checked')) {
					$("#checkbox-registeredPlayer").prop( "checked", false ).checkboxradio( "refresh" );
					$("#text-LoginDialog-username").textinput( "disable" );
					$("#text-LoginDialog-password").textinput( "disable" );
				}
				else {
					$('#checkbox-registeredPlayer').click();
				}
			});
		};
		if(myGui.currentVisibleMessageBoxId != "") {
			$("#"+myGui.currentVisibleMessageBoxId).popup("close");
			$("#"+myGui.currentVisibleMessageBoxId).remove();
			setTimeout(show, 100);
		}
		else {
			show();
		}
	};
	
	this.hideLogin = function() 
	{
		$("#loginDialog").popup( "close" );
		$("#loginDialog").remove();
	};
};

function initLoginDialogImpl()
{
	myLoginDialog = new LoginDialogImpl();
}

window.addEventListener("load", initLoginDialogImpl, false);

