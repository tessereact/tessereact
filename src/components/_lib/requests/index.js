import mockServer from '../mockServer'

/**
 * Fetch url with method GET.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response JSON
 */
export function getJSON (url) {
  if (window.__tessereactDemoMode) {
    return Promise.resolve(mockServer(url, {method: 'GET'}))
  }

  return window.fetch(url, {
    method: 'GET',
    mode: 'cors'
  }).then(response => response.json())
}

/**
 * Fetch url with method POST and with the given request body.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response JSON
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
  }).then(response => response.json())
}

/**
 * Fetch url with method POST and with the given request body.
 * Get URL from the blob.
 *
 * @param {String} url
 * @param {Object} body - request body
 * @returns {Promise<Object>} promise with response URL
 */
export function postJSONAndGetURL (url, body) {
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
  }).then((response) => {
    return response.blob()
  }).then((blob) => window.URL.createObjectURL(blob))
}
