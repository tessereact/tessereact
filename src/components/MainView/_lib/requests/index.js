import mockServer from '../mockServer'

/**
 * Fetch url with method GET.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response
 */
export function getJSON (url) {
  if (window.__tessereactDemoMode) {
    return Promise.resolve(mockServer(url, {method: 'GET'}))
  }

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
  if (window.__tessereactDemoMode) {
    return Promise.resolve(mockServer(url, {method: 'POST', body}))
  }

  return window.fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(body)
  })
}
