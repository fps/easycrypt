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

	 xorencrypt: function (str, pwd) {
		  if(pwd == null || pwd.length <= 0) {
				alert("Please enter a password with which to encrypt the message.");
				return null;
		  }
		  var prand = "";
		  for(var i=0; i<pwd.length; i++) {
				prand += pwd.charCodeAt(i).toString();
		  }
		  var sPos = Math.floor(prand.length / 5);
		  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
		  var incr = Math.ceil(pwd.length / 2);
		  var modu = Math.pow(2, 31) - 1;
		  if(mult < 2) {
				alert("Algorithm cannot find a suitable hash. Please choose a different password. \nPossible considerations are to choose a more complex or longer password.");
				return null;
		  }
		  var salt = Math.round(Math.random() * 1000000000) % 100000000;
		  prand += salt;
		  while(prand.length > 10) {
				prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		  }
		  prand = (mult * prand + incr) % modu;
		  var enc_chr = "";
		  var enc_str = "";
		  for(var i=0; i<str.length; i++) {
				enc_chr = parseInt(str.charCodeAt(i) ^ Math.floor((prand / modu) * 255));
				if(enc_chr < 16) {
					 enc_str += "0" + enc_chr.toString(16);
				} else enc_str += enc_chr.toString(16);
				prand = (mult * prand + incr) % modu;
		  }
		  salt = salt.toString(16);
		  while(salt.length < 8)salt = "0" + salt;
		  enc_str += salt;
		  return enc_str;
	 },

	 xordecrypt: function(str, pwd) {
		  if(str == null || str.length < 8) {
				// alert("A salt value could not be extracted from the encrypted message because it's length is too short. The message cannot be decrypted.");
				return;
		  }
		  if(pwd == null || pwd.length <= 0) {
				alert("Please enter a password with which to decrypt the message.");
				return;
		  }
		  var prand = "";
		  for(var i=0; i<pwd.length; i++) {
				prand += pwd.charCodeAt(i).toString();
		  }
		  var sPos = Math.floor(prand.length / 5);
		  var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos*2) + prand.charAt(sPos*3) + prand.charAt(sPos*4) + prand.charAt(sPos*5));
		  var incr = Math.round(pwd.length / 2);
		  var modu = Math.pow(2, 31) - 1;
		  var salt = parseInt(str.substring(str.length - 8, str.length), 16);
		  str = str.substring(0, str.length - 8);
		  prand += salt;
		  while(prand.length > 10) {
				prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
		  }
		  prand = (mult * prand + incr) % modu;
		  var enc_chr = "";
		  var enc_str = "";
		  for(var i=0; i<str.length; i+=2) {
				enc_chr = parseInt(parseInt(str.substring(i, i+2), 16) ^ Math.floor((prand / modu) * 255));
				enc_str += String.fromCharCode(enc_chr);
				prand = (mult * prand + incr) % modu;
		  }
		  return enc_str;
	 },

	 rot13: function(text) {
		  var keycode	= "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		  var textrot	= new String();

		  for(var i = 0; i < text.length; i++)
		  {
				var codechar = text.substring(i, i + 1);
				var pos = keycode.indexOf(codechar.toUpperCase());

				if(pos >= 0)
				{
					 pos = (pos + keycode.length / 2) % keycode.length;
					 codechar = (codechar == codechar.toUpperCase()) ? keycode.substring(pos, pos + 1) : keycode.substring(pos, pos + 1).toLowerCase();
				}
				textrot	= textrot + codechar;
		  }
		  return textrot;
	 },

	 encrypt_show: function(e) {
		  // var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  panel.openPopup(document.getElementById("navigator-toolbox"), "after_start");
		  panel.textthingy = document.popupNode;

		  var b = document.getElementById("easycrypt-button");
		  b.removeEventListener("click", easycrypt.encrypt, false);
		  b.addEventListener("click", easycrypt.encrypt, false);

		  var b2 = document.getElementById("easycrypt-insert-button");
		  b2.removeEventListener("click", easycrypt.encrypt_and_insert, false);
		  b2.addEventListener("click", easycrypt.encrypt_and_insert, false);
		  // var doc = aEvent.originalTarget;

	 },

	 decrypt_show: function(e) {
		  var panel =  document.getElementById("easycryptDecryptpanel");
		  panel.openPopup(document.getElementById("navigator-toolbox"), "after_start");
		  panel.textthingy = document.popupNode;
		  var doc = document.popupNode;
		  var focusedWindow = document.commandDispatcher.focusedWindow;
		  var text = focusedWindow.getSelection().toString();
		  // alert(text);

		  var matches = text.match(/easycrypt\[\[\[.*?\]\]\]/g);
		  var cyphers = matches;
		  // alert(matches);
		  for (i = 0; i < matches.length; i++) {
				cyphers[i] = matches[i].substring(12, matches[i].length - 3);
				text = text.replace("easycrypt[[[" + cyphers[i] + "]]]", easycrypt.xordecrypt(cyphers[i], "blaa"));
		  }
		  document.getElementById("easycrypt-cleartext-textfield").value = text;
	 },

	 encrypt: function(e) {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  var cleartext = document.getElementById("easycrypt-textfield").value;
		  // alert("foo");
		  // document.getElementById("easycrypt-cypher-textfield").value = "ugh";
		  // TODO: encrypt :D
		  document.getElementById("easycrypt-cypher-textfield").value = "easycrypt[[[" + easycrypt.xorencrypt(cleartext, "blaa") + "]]]";   
	 },

	 encrypt_and_insert: function(e) {
		  var panel =  document.getElementById("easycryptEncryptpanel");
		  var cleartext = document.getElementById("easycrypt-textfield").value;

		  // TODO: encrypt :D
		  panel.textthingy.value = "easycrypt[[[" + easycrypt.xorencrypt(cleartext, "blaa") +"]]]";   
	 }
}

function easycrypt_run()
{

}

