dojo.require("dojo.event.*");
dojo.require("dojo.debug.*");
dojo.require("dojo.io.*");

dojo.event.connect(window, "onload", themeSetup);

var isWorking = 0;
var extrasIsOpen = 0;

function themeSetup() {
  dojo.debug("Welcome to the basic theme, setting up environemnt.");
  // FIXME - this should have a nice way of disabling AJAX.
  working(1);

  magify('start', goStart);
  magify('index', goIndex);
  magify('logout', goLogout);
  magify('blogpost', goBlogpost);
  magify('admin', goAdmin);
  magify('login', goLogin);
  magify('actions', goActions);

  working(0);
}

function magify(id, callback) {
  var elem = document.getElementById(id);
  if (elem) {
    disableLinks(elem);
    dojo.event.connect(elem, 'onclick', callback);
    elem.className = elem.className + ' fakeLink';
  }
}

function working(show) {
  var elem = document.getElementById("working");
  if (!elem) {
    elem = document.createElement("div");
    elem.id = 'working';
    document.getElementById('page').appendChild(elem);
    elem.visibility = 'hidden';
    elem.innerHTML = '<img src="/theme/basic/img/spinner_16.gif" alt="Spinner" title="FinScribe is working..." class="working" />';
  }
  if (elem && (isWorking != show)) {
    if (show)
      elem.innerHTML = '<img src="/theme/basic/img/spinner_16.gif" alt="Spinner" title="FinScribe is working..." class="working" />';
    else
      elem.innerHTML = '';
    isWorking = show;
  }
}

function disableLinks(elem) {
  if (elem) {
    if (elem.tagName && elem.tagName.toLowerCase() == "a") {
      elem.href='#';
    }
    for (i = 0; i < elem.childNodes.length; i++) {
      disableLinks(elem.childNodes[i]);
    }
  }
}

function goStart() {
  working(1);
  window.location = '/space/start/';
}

function goIndex() {
  working(1);
  window.location = '/space/object-index/';
}

function goLogout() {
  working(1);
  window.location = '/exec/logout?return_to = ' + window.location;
}

function goBlogpost() {
}

function goAdmin() {
}

function goLogin() {
  dojo.debug("doLogin()");
  working(1);
  if (document.getElementById('sidebar')) {
    var bindArgs = {
      url : '/exec/login?ajax=1',
      mimetype : 'text/html',
      sync : false,
      error : function(type, errObj) { 
		dojo.debug("retrieving /exec/login failed");
		//window.location = '/exec/login';
	      },
      load : showLoginForm
    };
    dojo.io.bind(bindArgs);
  }
  else
    window.location = '/exec/login?return_to=' + window.location;
}

function goActions() {
  dojo.debug("goActions()");
  working(1);
  if (document.getElementById('sidebar')) {
    var uri = String(window.location);
    uri = uri.replace("space", "exec/actions");
    var bindArgs = {
      url : uri,
      mimetype : 'text/html',
      sync : false,
      error : function(type, errObj) { 
		dojo.debug("retrieving " + uri + " failed");
		//window.location = '/exec/login';
	      },
      load : showActionsMenu
    };
    dojo.io.bind(bindArgs);
  }
  //else
    //window.location = '/exec/login?return_to=' + window.location;
}

function showActionsMenu(type, data, evt) {
  dojo.debug("showActionsMenu()");
  var elem = getExtras();
  if (elem) {
    elem.innerHTML = data.toString();
    elem.className = 'extras';
    elem.visibility = 'visible';
    dojo.fx.wipeIn(elem, 1000, showedActionsMenu);
  }
}

function showLoginForm(type, data, evt) {
  dojo.debug("showLoginForm()");
  var elem = getExtras();
  if (elem) {
    elem.innerHTML = data.toString();
    elem.className = 'extras';
    var username = document.getElementById('UserName');
    var password = document.getElementById('Password');
    var submit = document.getElementById('loginButton');
    if (username && password && submit) {
      dojo.event.connect(username, 'onfocus', unGrey);
      dojo.event.connect(password, 'onfocus', unGrey);
      submit.disabled = true;
    }
    else
      window.location = '/exec/login?return_to=' + window.location;
    elem.visibility = 'visible';
    dojo.fx.wipeIn(elem, 1000, showedLoginForm);
  }
  else
    dojo.debug('showLoginForm() failed 2');
    //window.location = '/exec/login';
}

function showedLoginForm() {
  extrasIsOpen = 1;
  dojo.event.disconnect(document.getElementById('login'), 'onclick', goLogin);
  magify('login', hideLoginForm);
  working(0);
}

function showedActionsMenu() {
  extrasIsOpen = 1;
  working(0);
}

function hideLoginForm() {
  dojo.debug("hideLoginForm()");
  working(1);
  var elem = document.getElementById('extras');
  if (elem) {
    dojo.fx.wipeOut(elem, 1000, hiddenLoginForm);
  }
}

function hiddenLoginForm() {
  dojo.event.disconnect(document.getElementById('login'), 'onclick', hideLoginForm);
  var elem = document.getElementById('extras');
  if (elem) {
    elem.visibility = 'hidden';
  }
  magify('login', goLogin);
  working(0);
  extrasIsOpen = 0;
}

function unGrey() {
  var username = document.getElementById('UserName');
  var password = document.getElementById('Password');
  var submit = document.getElementById('loginButton');
  if (username && password && submit) {
    dojo.event.disconnect(username, 'onfocus', unGrey);
    dojo.event.disconnect(password, 'onfocus', unGrey);
    username.className = 'login';
    username.value = '';
    password.className = 'login';
    password.setAttribute('type', 'password');
    password.value = '';
    submit.className = 'login';
    submit.disabled = false;
  }
}

function getExtras() {
  var elem = document.getElementById('extras');
  if (!elem) {
    elem = document.createElement("div");
    elem.id = 'extras';
    var sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (sidebar.childNodes.length)
	sidebar.insertBefore(elem, sidebar.childNodes[0]);
      else
	sidebar.appendChild(elem);
    }
  }
  return elem;
}
