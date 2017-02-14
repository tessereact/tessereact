'use strict';

var _require = require('child_process'),
    execFile = _require.execFile;

var chromeDriverPath = require('chromedriver').path;
var fetch = require('node-fetch');

module.exports = {
  startChromeDriver: startChromeDriver
};

function startChromeDriver() {
  var userOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var options = Object.assign({
    port: 9515, // Default ChromeDriver port
    retryCount: 5,
    retryDelay: 500
  }, userOptions);

  var chromeArgs = ['--port=' + options.port];

  return new Promise(function (resolve, reject) {
    var chromeDriverInstance = execFile(chromeDriverPath, chromeArgs, function (err) {
      if (err) reject(err);
    });

    var retries = 0;

    getStatus();

    function retry() {
      if (retries < options.retryCount) {
        retries++;
        setTimeout(getStatus, options.retryDelay);
      } else {
        reject(new Error("Can't connect to the ChromeDriver instance"));
      }
    }

    function getStatus() {
      fetch('http://localhost:' + options.port + '/status').then(function (resp) {
        return resp.json();
      }).then(function (_ref) {
        var status = _ref.status;

        if (status === 0) {
          resolve({
            kill: function kill() {
              return chromeDriverInstance.kill();
            },
            open: function open(url) {
              return createSession(options.port).then(function (sessionId) {
                return _open(options.port, sessionId, url);
              });
            }
          });
        } else {
          retry();
        }
      }).catch(retry);
    }
  });
}

function createSession(port) {
  return postJSON('http://localhost:' + port + '/session', { desiredCapabilities: { browserName: 'chrome' } }).then(function (_ref2) {
    var sessionId = _ref2.sessionId;
    return sessionId;
  });
}

function _open(port, sessionId, url) {
  return postJSON('http://localhost:' + port + '/session/' + sessionId + '/url', { url: url });
}

function postJSON(url, body) {
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(function (resp) {
    return resp.json();
  }).then(function (json) {
    if (json.status === 0) {
      return json;
    } else {
      throw new Error(json.value.message);
    }
  });
}