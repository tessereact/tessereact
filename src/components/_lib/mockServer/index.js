/**
 * Mock server for Tessereact demo mode.
 *
 * @param {String} url
 * @param {Object} options
 * @param {Object} options.method - 'GET' or 'POST'
 * @param {Object} [options.body] - JSON body of POST request
 * @returns {Object} response
 */
export default function mockServer (url, { method, body }) {
  const data = window.__tessereactDemoMode

  if (!(data instanceof Object) || !data.snapshots) {
    throw new Error('window.__tessereactDemoMode must be an object with `snapshots` property')
  }

  if (method === 'GET' && url.match(/\/config\/?$/)) {
    return {}
  } else if (method === 'POST' && url.match(/\/read-snapshots\/?$/)) {
    return {
      scenarios: body.scenarios.map(({name, context}) => ({
        name,
        context,
        snapshot: data.snapshots[getSnapshotFileName(context, name, 'html')],
        snapshotCSS: data.snapshots[getSnapshotFileName(context, name, 'css')]
      }))
    }
  } else if (method === 'POST' && url.match(/\/write-snapshot\/?$/)) {
    return {status: 'OK'}
  } else {
    return data.screenshotURL
  }
}

function getSnapshotFileName (context, name, extension) {
  if (!context) {
    return `${name}.${extension}`
  }

  return `${context}/${context} - ${name}.${extension}`
}
