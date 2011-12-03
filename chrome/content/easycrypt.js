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

  pimp_textarea: function(doc, t) {
    var table = doc.createElement('table'),
        tbody = doc.createElement('tbody'),
        tr1 = doc.createElement('tr'),
        tr2 = doc.createElement('tr'),
        tr3 = doc.createElement('tr'),
        td1 = doc.createElement('td'),
        td2 = doc.createElement('td'),
        td3 = doc.createElement('td'),
        td4 = doc.createElement('td'),
        cleartext = doc.createElement('textarea'),
        toggle = doc.createElement('input'),
        encrypt = doc.createElement('input'),
		  textarea = t;

    // cleartext = doc.createElement('div');
    tr1.appendChild(td1);
    tr1.appendChild(td2);
    tr1.appendChild(td3);
    tr1.appendChild(td4);

    tbody.appendChild(tr1);    
    tbody.appendChild(tr2);    
    tbody.appendChild(tr3);    

    table.appendChild(tbody);

    t.parentNode.replaceChild(table, t);

    // t.style.display = 'none';
    t = td1.appendChild(t);
	 // t.style.display = '';

    cleartext.rows = t.rows;
    cleartext.cols = t.cols;
    // cleartext.style.display = 'none';
	 cleartext.id = "easycryptcleartext";
    cleartext = td2.appendChild(cleartext);

    toggle.type = 'checkbox';
	 toggle.cleartext = cleartext;
    toggle.addEventListener("click", function() { doc.getElementById("easycryptcleartext").style.display = 'none'; }, false);
    td3.appendChild(toggle);

    encrypt.type = 'button';
    encrypt.value = 'encrypt';
    //encrypt.style.display = 'none';

    encrypt.addEventListener("click", function() { textarea.value = cleartext.value; }, false);
    td4.appendChild(encrypt);
  },

  onPageLoad: function(aEvent) {
    var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
    var win = doc.defaultView;
    if (win.frameElement) return;
    //if (doc.nodeName == "#document") return;

    var inputfields = doc.getElementsByTagName('input');
    for (var i = 0; i < inputfields.length; i++)
    {
      if (inputfields[i].type == "text")
      {
        inputfields[i].value = "bla";
      }
    }

    var textareas = Array.slice(doc.getElementsByTagName('textarea'));
    for (var j = 0; j < textareas.length; j++) 
    {
      // easycrypt.pimp_textarea(doc, textareas[j]);
      // textareas[j].value = "bla";
    }

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

