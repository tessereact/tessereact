/**
 * Fetch url with method POST and with the given request body.
 * Return object, parsed from response JSON.
 *
 * @param {String} url
 * @param {Object} requestBody
 * @returns {Promise<Object>} promise with response
 */
export function fetchJSON (url, requestBody) {
  return new Promise(resolve => {
    const request = new XMLHttpRequest()
    request.open('POST', url)
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(requestBody))
    request.onload = function () {
      resolve(JSON.parse(this.responseText))
    }
  })
}

/**
 * Fetch url with method POST and with the given request body.
 * Return a Blob.
 *
 * @param {String} url
 * @param {Object} requestBody
 * @returns {Promise<Blob>} promise with Blob response
 */
export function fetchFile (url, requestBody) {
  return new Promise(resolve => {
    const request = new XMLHttpRequest()
    request.open('POST', url)
    request.responseType = 'blob'
    request.setRequestHeader('Content-Type', 'application/json')
    request.send(JSON.stringify(requestBody))
    request.onload = function () {
      resolve(new Blob([this.response], {type: 'image/gif'}))
    }
  })
}
