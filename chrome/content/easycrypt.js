window.addEventListener("load", function() { easycrypt.init(); }, false);

var easycrypt = {
	 init: function() {
		  var appcontent = document.getElementById("appcontent");   // browser
		  if(appcontent)
				appcontent.addEventListener("DOMContentLoaded", easycrypt.onPageLoad, true);
		  var messagepane = document.getElementById("messagepane"); // mail
		  if(messagepane)
				messagepane.addEventListener("load", function(event) { easycrypt.onPageLoad(event); }, true);
	 },


	 onPageLoad: function(aEvent) {
		  var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
		  var win = doc.defaultView;
		  if (win.frameElement) return;
		  //! Todo: popup little textfields over easycrypt[[[...]]] found in the page and decrypt them with the current password
	 },

	 onPageUnload: function(aEvent) {
		  // do something
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
		  for (i = 0; i < matches.length; i++) {
				cyphers[i] = matches[i].substring(12, matches[i].length - 3);
				text = text.replace("easycrypt[[[" + cyphers[i] + "]]]", Crypto.AES.decrypt(cyphers[i], document.getElementById("easycrypt-password-textfield").value));
		  }
		  document.getElementById("easycrypt-clear-textfield").value = text;
	 },

	 encrypt: function() {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  var cleartext = document.getElementById("easycrypt-clear-textfield").value;
		  // alert("foo");
		  // document.getElementById("easycrypt-cypher-textfield").value = "ugh";
		  // TODO: encrypt :D
		  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		  document.getElementById("easycrypt-crypt-textfield").value = "easycrypt[[[" + Crypto.AES.encrypt(cleartext, document.getElementById("easycrypt-password-textfield").value) + "]]]";   
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

