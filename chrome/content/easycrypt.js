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

    var div = doc.createElement("div");
    div.id = "easycryptpopupdiv";
    div.style.display = 'none';

    var cleartext = doc.createElement("textarea");
    cleartext.id = "easycryptcleartext";
    cleartext.rows = "5";
    cleartext.columns = "60";
    div.appendChild(cleartext);

    doc.body.appendChild(div);

    doc.body.innerHTML = doc.body.innerHTML.replace(/bla/g, "blub");
  },

  onPageUnload: function(aEvent) {
    // do something
  },

  show: function(e) {
    document.popupNode.value = "ewfwefhwef";
    document.getElementById("easycryptpanel").openPopup(document.getElementById("navigator-toolbox"), "after_start");
    var b = document.getElementById("easycrypt-button");
    b.removeEventListener("click", easycrypt.encrypt, false);
    b.addEventListener("click", easycrypt.encrypt, false);
    // var doc = aEvent.originalTarget;

  },

  encrypt: function(e) {
    alert("bla");
  }
}

function easycrypt_run()
{

}

