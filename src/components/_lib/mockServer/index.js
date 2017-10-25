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

  if (method === 'GET' && url.match(/\/api\/config\/?$/)) {
    return {}
  } else if (method === 'POST' && url.match(/\/api\/read-snapshots\/?$/)) {
    return {
      scenarios: body.scenarios.map(({name, context}) => ({
        name,
        context,
        snapshot: data.snapshots[getSnapshotFileName(context, name, 'html')],
        snapshotCSS: data.snapshots[getSnapshotFileName(context, name, 'css')]
      }))
    }
  } else if (method === 'POST' && url.match(/\/api\/write-snapshot\/?$/)) {
    return { status: 'OK' }
  } else if (method === 'GET' && url.match(/\/api\/css\/?$/)) {
    return { scenarios: data.css }
  } else if (method === 'POST' && url.match(/\/api\/screenshot\/?$/)) {
    return (data.screenshots && data.screenshots[getScreenshotId(body.context, body.name, body.sizeIndex)]) ||
      data.defaultScreenshotURL
  } else {
    throw new Error(`Request is invalid: ${method} ${url} ${body}`)
  }
}

function getSnapshotFileName (context, name, extension) {
  if (!context) {
    return `${name}.${extension}`
  }

  return `${context}/${context} - ${name}.${extension}`
}

function getScreenshotId (context, name, sizeIndex) {
  return `${context}/${name}/${sizeIndex}`
}
