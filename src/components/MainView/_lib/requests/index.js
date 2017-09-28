/**
 * Fetch url with method GET.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response
 */
export function getJSON (url) {
  return window.fetch(url, {
    method: 'GET',
    mode: 'cors'
  })
}

/**
 * Fetch url with method POST and with the given request body.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response
 */
export function postJSON (url, body) {
  return window.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(body)
  })
}
