export function postJSON (url, body) {
  return window.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(body)
  })
}
