function init() {
  var NASH = window['nash-js'];
  
  var keyEl = document.getElementById('key');
  var plainEl = document.getElementById('plain');
  var encryptedEl = document.getElementById('encrypted');
  
  // randomize key
  var keybuf = new Uint32Array(2);
  crypto.getRandomValues(keybuf);

  keyEl.value = format1bHex(NASH.i2h(keybuf));
  keyEl.addEventListener('input', function(event) {
    keyEl.value = format1bHex(clear(event.target.value));
    encrypt(plainEl.value);
  });

  function encrypt(text) {
    try {
      var encryptedBuf = NASH.encrypt(text, NASH.h2i(clear(keyEl.value)));
      encryptedEl.value = format4bHex(NASH.i2h(encryptedBuf));
    } catch (e) {
      console.log(e);
    }
  }

  function decrypt(text) {
    try {
      var encryptedBuf = NASH.h2i(clear(text));
      var plainBuf = NASH.decrypt(encryptedBuf, NASH.h2i(clear(keyEl.value)));
      plainEl.value = NASH.i2s(plainBuf);
    } catch (e) {
      console.log(e);
    }
  }

  // encrypt example
  encrypt(plainEl.value);

  plainEl.addEventListener('input', function(event) {
    encrypt(event.target.value);
  });

  encryptedEl.addEventListener('input', function(event) {
    decrypt(event.target.value);
  });
}


function clear(text) {
  return text.replace(/\s/g, '');
}

function format1bHex(text) {
  return text.replace(/(..)/g, '$1 ').trim();
}

function format4bHex(text) {
  return text.replace(/(........)/g, '$1 ').trim();
}

document.addEventListener('DOMContentLoaded', init);
