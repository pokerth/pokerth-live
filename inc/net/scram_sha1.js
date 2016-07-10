/* Copyright (C) 2013-2016 Felix Hammer, Florian Thauer, Lothar May */
/**
 * class scram_sha1
 * @constructor
 */
function scram_sha1()
{
	var self = this;
	var clientFirstMessageBare = "";
	var saltedPassword = [];
	var authMessage = "";

	this.clear = function()
	{
		self.clientFirstMessageBare = "";
		self.saltedPassword = [];
		self.authMessage = "";
	};

	this.executeStep1 = function(username)
	{
		self.clear();
		// Build message containing user name and client salt (8 bytes).
		var salt = CryptoJS.lib.WordArray.random(8);
		var clientR = CryptoJS.enc.Base64.stringify(salt);
		self.clientFirstMessageBare = "n=" + username + ",r=" + clientR + "\n";
		var messageStr = "n,," + self.clientFirstMessageBare;
		var step1Bytes = [];
		for (var i = 0; i < messageStr.length; ++i)
		{
			step1Bytes.push(messageStr.charCodeAt(i));
		}
		return step1Bytes;
	};

	this.executeStep2 = function(password, serverFirstMessage)
	{
		var serverFirstMessageStr = "";
		for (var i = 0; i < serverFirstMessage.length; i++)
		{
			serverFirstMessageStr += String.fromCharCode(serverFirstMessage[i]);
		}
		var messageArray = serverFirstMessageStr.split(",");
		var serverR;
		var serverSalt;
		var iterationCount;

		// Parse attributes from server request.
		var pos = messageArray[0].indexOf("=");
		if (messageArray[0].substr(0, pos) === "r")
		{
			serverR = messageArray[0];
		}
		pos = messageArray[1].indexOf("=");
		if (messageArray[1].substr(0, pos) === "s")
		{
			serverSalt = CryptoJS.enc.Base64.parse(messageArray[1].substr(pos + 1));
		}
		pos = messageArray[2].indexOf("=");
		if (messageArray[2].substr(0, pos) === "i")
		{
			iterationCount = parseInt(messageArray[2].substr(pos + 1));
		}

		// SaltedPassword  := Hi(Normalize(password), salt, i)
		// Key size 20 bytes as words
		self.saltedPassword = CryptoJS.PBKDF2(password, serverSalt, { keySize: 160/32, iterations: iterationCount });

	    // ClientKey       := HMAC(SaltedPassword, "Client Key")
		var clientKey = CryptoJS.HmacSHA1("Client Key", self.saltedPassword);

		// StoredKey       := H(ClientKey)
		var storedKey = CryptoJS.SHA1(clientKey);

	    // AuthMessage     := client-first-message-bare + "," +
        // server-first-message + "," +
        // client-final-message-without-proof
		var clientFinalMessage = "c=biws," + serverR;
		self.authMessage = self.clientFirstMessageBare + "," + serverFirstMessageStr + "," + clientFinalMessage;

		// ClientSignature := HMAC(StoredKey, AuthMessage)
		var clientSignature = CryptoJS.HmacSHA1(self.authMessage, storedKey);

		// ClientProof     := ClientKey XOR ClientSignature
        for (var k = 0; k < 20/4; k++)
        {
        	clientKey.words[k] ^= clientSignature.words[k];
        }

		var clientProof = CryptoJS.enc.Base64.stringify(clientKey);
		clientFinalMessage += ",p=" + clientProof;

		var step2Bytes = [];
		for (var i = 0; i < clientFinalMessage.length; ++i)
		{
			step2Bytes.push(clientFinalMessage.charCodeAt(i));
		}
		return step2Bytes;
	};

	this.executeStep3 = function(serverVerification)
	{
		var serverVerificationStr = "";
		for (var i = 0; i < serverVerification.length; i++)
		{
			serverVerificationStr += String.fromCharCode(serverVerification[i]);
		}

		// Parse attributes from server request.
		var serverVerify;
		var pos = serverVerificationStr.indexOf("=");
		if (serverVerificationStr.substr(0, pos) === "v")
		{
			serverVerify = serverVerificationStr.substr(pos + 1);
		}

		// ServerKey       := HMAC(SaltedPassword, "Server Key")
		var serverKey = CryptoJS.HmacSHA1("Server Key", self.saltedPassword);

		// ServerSignature := HMAC(ServerKey, AuthMessage)
		var serverSignature = CryptoJS.HmacSHA1(self.authMessage, serverKey);

		self.clear();

		return serverVerify === CryptoJS.enc.Base64.stringify(serverSignature) ? 1 : 0;
	};
}
