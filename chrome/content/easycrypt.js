window.addEventListener("load", function() { easycrypt.init(); }, false);

var easycrypt = {
	 init: function() {
		  this.crypto = {};
		  Components.utils.import("resource://cryptojs/crypto-sha1-hmac-pbkdf2-blockmodes-aes/crypto-sha1-hmac-pbkdf2-blockmodes-aes.js", this.crypto);
	 /*
		  var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
            .getService(Components.interfaces.mozIJSSubScriptLoader);
		  this.cryptojs = loader.loadSubScript("resource://cryptojs/crypto-sha1-hmac-pbkdf2-blockmodes-aes/crypto-sha1-hmac-pbkdf2-blockmodes-aes.js");
	 */
	 },


	 easycrypt_show: function() {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  panel.openPopup(document.getElementById("navigator-toolbox"), "after_start");
		  panel.textthingy = document.popupNode;

		  var list = document.getElementById("easycrypt-password-list")
		  var username = "Password" + list.value;

		  var nsloginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
		  
		  var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init");
		  
		  var hostname = 'chrome://easycrypt';
		  var formSubmitURL = null;
		  var httprealm = 'Password Storage';
		  var retrievedpassword;

		  var logins = nsloginManager.findLogins({}, hostname, formSubmitURL, httprealm);
		  var results = [];
		  for (var i = 0; i < logins.length; i++) {
				if (logins[i].username == username) 
					 results.push(i);
		  }

		  if (results.length != 0) {
				// alert(logins);
				document.getElementById("easycrypt-password-textfield").value = logins[results[0]].password;
		  }
	 },

	 password_selected: function() {

		  easycrypt.easycrypt_show();
		  // var extLoginInfo = new nsLoginInfo(hostname, formSubmitURL, httprealm, username, '123', "", "");
	 },

	 store_password: function() {
		  var list = document.getElementById("easycrypt-password-list")
		  var username = "Password" + list.value;

		  var nsloginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
		  
		  var nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1", Components.interfaces.nsILoginInfo, "init");
		  
		  var hostname = 'chrome://easycrypt';
		  var formSubmitURL = null;
		  var httprealm = 'Password Storage';
		  var retrievedpassword;

		  var logins = nsloginManager.findLogins({}, hostname, formSubmitURL, httprealm);
		  var results = [];
		  for (var i = 0; i < logins.length; i++) {
				if (logins[i].username == username) 
					 results.push(i);
		  }

		  var extLoginInfo = new nsLoginInfo(hostname, formSubmitURL, httprealm, username, document.getElementById("easycrypt-password-textfield").value, "", "");

		  if (results.length == 0) {
				nsloginManager.addLogin(extLoginInfo);
		  }

		  if (results.length == 1) {
				// alert(logins);
				// document.getElementById("easycrypt-password-textfield").value = logins[results[0]].password;

				// store login details first time through
				// var setlogin = promptserv.confirm(null, "Store Login for 'bob' ?", "If you have already stored the login choose Cancel");
				nsloginManager.removeLogin(logins[results[0]]);
				nsloginManager.addLogin(extLoginInfo);
		  }
	 },

	 encrypt_show: function(e) {
		  // var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
		  easycrypt.easycrypt_show();

		  var focusedWindow = document.commandDispatcher.focusedWindow;
		  var text = focusedWindow.getSelection().toString();
		  document.getElementById("easycrypt-clear-textfield").value = text;

		  easycrypt.encrypt();
	 },

	 decrypt_show: function(e) {
		  easycrypt.easycrypt_show();

		  var doc = document.popupNode;
		  var focusedWindow = document.commandDispatcher.focusedWindow;
		  var text = focusedWindow.getSelection().toString();
		  document.getElementById("easycrypt-crypt-textfield").value = text;
		  // alert(text);

		  easycrypt.decrypt();
	 },

	 decrypt: function(e) {
		  var text = document.getElementById("easycrypt-crypt-textfield").value;
		  var matches = text.match(/easycrypt\[\[\[.*?\]\]\]/g);
		  var cyphers = matches;

		  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		  // alert(matches);
		  try {
		  		  for (i = 0; i < matches.length; i++) {
				  		cyphers[i] = matches[i].substring(12, matches[i].length - 3);
						text = text.replace("easycrypt[[[" + cyphers[i] + "]]]", Crypto.AES.decrypt(cyphers[i], document.getElementById("easycrypt-password-textfield").value));
				  }
				document.getElementById("easycrypt-clear-textfield").value = text;
		  } catch (e) {
				document.getElementById("easycrypt-clear-textfield").value = "Decryption failed for some reason. Wrong password? Broken text? Exception: " + e;
		  }
	 },

	 encrypt: function() {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  var cleartext = document.getElementById("easycrypt-clear-textfield").value;
		  // alert("foo");
		  // document.getElementById("easycrypt-cypher-textfield").value = "ugh";
		  // TODO: encrypt :D
		  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		  try {
				document.getElementById("easycrypt-crypt-textfield").value = "easycrypt[[[" + easycrypt.crypto.Crypto.AES.encrypt(cleartext, document.getElementById("easycrypt-password-textfield").value) + "]]]";   
		  } catch(e) {
				document.getElementById("easycrypt-crypt-textfield").value = "Encryption failed for some reason. Exception: " + e;
		  }
	 },

	 encrypt_and_insert: function(e) {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  var cleartext = document.getElementById("easycrypt-clear-textfield").value;

		  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		  // TODO: encrypt :D
		  panel.textthingy.value = "easycrypt[[[" + Crypto.AES.encrypt(cleartext, document.getElementById("easycrypt-password-textfield").value) + "]]]";   
	 }
}

function easycrypt_run()
{

}

