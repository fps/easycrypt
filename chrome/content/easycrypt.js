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

  show: function() {
    window.document.getElementById("thepanel").popup();
    // var doc = aEvent.originalTarget;
    var div = content.document.getElementById("easycryptpopupdiv");
    if (div.style.display == 'none') {
      div.style.display = '';
      div.style.position = "relative";
      div.style.targetTop = "0";
      div.style.targetLeft = "0";
   } else {
     div.style.display = 'none';
   }

  }
}

function easycrypt_run()
{

}

