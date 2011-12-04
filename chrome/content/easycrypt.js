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

	 SHA1: function  (msg) {
		  
		  function rotate_left(n,s) {
				var t4 = ( n<<s ) | (n>>>(32-s));
				return t4;
		  };
		  
		  function lsb_hex(val) {
				var str="";
				var i;
				var vh;
				var vl;
				
				for( i=0; i<=6; i+=2 ) {
					 vh = (val>>>(i*4+4))&0x0f;
					 vl = (val>>>(i*4))&0x0f;
					 str += vh.toString(16) + vl.toString(16);
				}
				return str;
		  };
		  
		  function cvt_hex(val) {
				var str="";
				var i;
				var v;
				
				for( i=7; i>=0; i-- ) {
					 v = (val>>>(i*4))&0x0f;
					 str += v.toString(16);
				}
				return str;
		  };
		  
		  
		  function Utf8Encode(string) {
				string = string.replace(/\r\n/g,"\n");
				var utftext = "";
				
				for (var n = 0; n < string.length; n++) {
					 
					 var c = string.charCodeAt(n);
					 
					 if (c < 128) {
						  utftext += String.fromCharCode(c);
					 }
					 else if((c > 127) && (c < 2048)) {
						  utftext += String.fromCharCode((c >> 6) | 192);
						  utftext += String.fromCharCode((c & 63) | 128);
					 }
					 else {
						  utftext += String.fromCharCode((c >> 12) | 224);
						  utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						  utftext += String.fromCharCode((c & 63) | 128);
					 }
					 
				}
				
				return utftext;
		  };
		  
		  var blockstart;
		  var i, j;
		  var W = new Array(80);
		  var H0 = 0x67452301;
		  var H1 = 0xEFCDAB89;
		  var H2 = 0x98BADCFE;
		  var H3 = 0x10325476;
		  var H4 = 0xC3D2E1F0;
		  var A, B, C, D, E;
		  var temp;
		  
		  msg = Utf8Encode(msg);
		  
		  var msg_len = msg.length;
		  
		  var word_array = new Array();
		  for( i=0; i<msg_len-3; i+=4 ) {
				j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
					 msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
				word_array.push( j );
		  }
		  
		  switch( msg_len % 4 ) {
		  case 0:
				i = 0x080000000;
				break;
		  case 1:
				i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
				break;
				
		  case 2:
				i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
				break;
				
		  case 3:
				i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
				break;
		  }
		  
		  word_array.push( i );
		  
		  while( (word_array.length % 16) != 14 ) word_array.push( 0 );
		  
		  word_array.push( msg_len>>>29 );
		  word_array.push( (msg_len<<3)&0x0ffffffff );
		  
		  
		  for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
				
				for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
				for( i=16; i<=79; i++ ) W[i] = rotate_left(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
				
				A = H0;
				B = H1;
				C = H2;
				D = H3;
				E = H4;
				
				for( i= 0; i<=19; i++ ) {
					 temp = (rotate_left(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
					 E = D;
					 D = C;
					 C = rotate_left(B,30);
					 B = A;
					 A = temp;
				}
				
				for( i=20; i<=39; i++ ) {
					 temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
					 E = D;
					 D = C;
					 C = rotate_left(B,30);
					 B = A;
					 A = temp;
				}
				
				for( i=40; i<=59; i++ ) {
					 temp = (rotate_left(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
					 E = D;
					 D = C;
					 C = rotate_left(B,30);
					 B = A;
					 A = temp;
				}
				
				for( i=60; i<=79; i++ ) {
					 temp = (rotate_left(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
					 E = D;
					 D = C;
					 C = rotate_left(B,30);
					 B = A;
					 A = temp;
				}
				
				H0 = (H0 + A) & 0x0ffffffff;
				H1 = (H1 + B) & 0x0ffffffff;
				H2 = (H2 + C) & 0x0ffffffff;
				H3 = (H3 + D) & 0x0ffffffff;
				H4 = (H4 + E) & 0x0ffffffff;
				
		  }
		  
		  var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
		  
		  return temp.toLowerCase();
		  
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

