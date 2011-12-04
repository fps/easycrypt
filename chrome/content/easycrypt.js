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
		  //if (doc.nodeName == "#document") return;

		  // alert(cyphers);


	 },

	 onPageUnload: function(aEvent) {
		  // do something
	 },


	 easycrypt_show: function() {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  panel.openPopup(document.getElementById("navigator-toolbox"), "after_start");
		  panel.textthingy = document.popupNode;

		  var b = document.getElementById("easycrypt-encrypt-button");
		  b.removeEventListener("click", easycrypt.encrypt, false);
		  b.addEventListener("click", easycrypt.encrypt, false);

		  var b3 = document.getElementById("easycrypt-decrypt-button");
		  b3.removeEventListener("click", easycrypt.decrypt, false);
		  b3.addEventListener("click", easycrypt.decrypt, false);

		  var b2 = document.getElementById("easycrypt-encrypt-and-insert-button");
		  b2.removeEventListener("click", easycrypt.encrypt_and_insert, false);
		  b2.addEventListener("click", easycrypt.encrypt_and_insert, false);
		  // var doc = aEvent.originalTarget;
		  
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
				text = text.replace("easycrypt[[[" + cyphers[i] + "]]]", Crypto.AES.decrypt(cyphers[i], prefManager.getCharPref("extensions.easycrypt.pw1")));
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
		  document.getElementById("easycrypt-crypt-textfield").value = "easycrypt[[[" + Crypto.AES.encrypt(cleartext, prefManager.getCharPref("extensions.easycrypt.pw1")) + "]]]";   
	 },

	 encrypt_and_insert: function(e) {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  var cleartext = document.getElementById("easycrypt-clear-textfield").value;

		  var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		  // TODO: encrypt :D
		  panel.textthingy.value = "easycrypt[[[" + Crypto.AES.encrypt(cleartext, prefManager.getCharPref("extensions.easycrypt.pw1")) + "]]]";   
	 }
}

function easycrypt_run()
{

}

