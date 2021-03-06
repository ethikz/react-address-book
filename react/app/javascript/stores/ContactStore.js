var API = './javascript/api/people.json';
var _contacts = {};
var _changeListeners = [];
var _initCalled = false;

var ContactStore = module.exports = {
  init: function () {
    if ( _initCalled ) {
      return;
    }

    _initCalled = true;

    getJSON( API, function ( err, res ) {
      res.contacts.forEach(function ( contact ) {
        _contacts[contact.id] = contact;
      });

      ContactStore.notifyChange();
    });
  },

  getContacts: function () {
    var array = [];

    for (var id in _contacts) {
      array.push(_contacts[id]);
    }
    
    return array;
  },

  getContact: function ( id ) {
    return _contacts[id];
  },

  notifyChange: function () {
    _changeListeners.forEach(function ( listener ) {
      listener();
    });
  },

  addChangeListener: function ( listener ) {
    _changeListeners.push(listener);
  },

  removeChangeListener: function ( listener ) {
    _changeListeners = _changeListeners.filter(function ( l ) {
      return listener !== l;
    });
  }

};

function getJSON( url, cb ) {
  var req = new XMLHttpRequest();
  req.onload = function () {
    if ( req.status === 404 ) {
      cb(new Error('not found'));
    } else {
      cb(null, JSON.parse(req.response));
    }
  };
  
  req.open('GET', url);
  req.send();
}


