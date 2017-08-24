/**
 * @returns {Promise} promise, resolved when document is fully loaded.
 */
export default function onLoad () {
  return new Promise((resolve, reject) => {
    if (document.readyState === 'complete') {
      resolve()
    } else {
      window.addEventListener('load', resolve)
    }
  })
}
