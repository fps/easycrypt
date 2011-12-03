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

    var matches = doc.body.innerHTML.match(/easycrypt\[\[\[.*?\]\]\]/g);
    var cyphers = matches;
    // alert(matches);
    for (i = 0; i < matches.length; i++) {
      cyphers[i] = matches[i].substring(12, matches[i].length - 3);
      doc.body.innerHTML = doc.body.innerHTML.replace(cyphers[i], easycrypt.rot13(cyphers[i]));
    }
    // alert(cyphers);


  },

  onPageUnload: function(aEvent) {
    // do something
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

  show: function(e) {
    var panel =  document.getElementById("easycryptpanel");
    panel.openPopup(document.getElementById("navigator-toolbox"), "after_start");
    panel.textthingy = document.popupNode;

    var b = document.getElementById("easycrypt-button");
    b.removeEventListener("click", easycrypt.encrypt, false);
    b.addEventListener("click", easycrypt.encrypt, false);
    // var doc = aEvent.originalTarget;

  },

  encrypt: function(e) {
    var panel =  document.getElementById("easycryptpanel");
    var cleartext = document.getElementById("easycrypt-textfield").value;

    // TODO: encrypt :D
    panel.textthingy.value = "easycrypt[[[" + easycrypt.rot13(cleartext) +"]]]";   
  }
}

function easycrypt_run()
{

}

