export function postJSON (url, body) {
  return fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify(body)
  })
}
