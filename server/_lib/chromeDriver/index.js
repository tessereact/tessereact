const {execFile} = require('child_process')
const chromeDriverPath = require('chromedriver').path
const fetch = require('node-fetch')

module.exports = {
  startChromeDriver
}

function startChromeDriver (userOptions = {}) {
  const options = Object.assign({
    port: 9515, // Default ChromeDriver port
    retryCount: 5,
    retryDelay: 500
  }, userOptions)

  const chromeArgs = [
    `--port=${options.port}`
  ]

  return new Promise((resolve, reject) => {
    const chromeDriverInstance = execFile(chromeDriverPath, chromeArgs, err => {
      if (err) reject(err)
    })

    var retries = 0

    getStatus()

    function retry () {
      if (retries < options.retryCount) {
        retries++
        setTimeout(getStatus, options.retryDelay)
      } else {
        reject(new Error("Can't connect to the ChromeDriver instance"))
      }
    }

    function getStatus () {
      fetch(`http://localhost:${options.port}/status`)
        .then(resp => resp.json())
        .then(({status}) => {
          if (status === 0) {
            resolve({
              kill: () => chromeDriverInstance.kill(),
              open: (url) => {
                return createSession(options.port)
                  .then(sessionId => open(options.port, sessionId, url))
              }
            })
          } else {
            retry()
          }
        })
        .catch(retry)
    }
  })
}

function createSession (port) {
  return postJSON(`http://localhost:${port}/session`, {desiredCapabilities: {browserName: 'chrome'}})
    .then(({sessionId}) => sessionId)
}

function open (port, sessionId, url) {
  return postJSON(`http://localhost:${port}/session/${sessionId}/url`, {url})
}

function postJSON (url, body) {
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(json => {
      if (json.status === 0) {
        return json
      } else {
        throw new Error(json.value.message)
      }
    })
}
