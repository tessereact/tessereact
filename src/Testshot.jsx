import React from 'react'
import ReactDOMServer from 'react-dom/server'
import TestshotWindow from './components/TestshotWindow'
import ScenarioView from './components/ScenarioView'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

const names = []
const data = []
var currentContext = null

export function scenario (name, type, {css, screenshot} = {}) {
  const contextCopy = currentContext
  if (names.some(([existingName, existingContext]) =>
    name === existingName && currentContext === existingContext
  )) {
    throw new Error(`Scenario with name "${name}" already exists`)
  }
  names.push([name, currentContext])

  data.push({
    name,
    getElement: () => React.createElement(type, {key: name}),
    // TODO: Handle exception during rendering,
    // store and then display it
    getSnapshot: () => ReactDOMServer.renderToStaticMarkup(React.createElement(type, {key: name})),
    context: contextCopy,
    options: {
      css: css || screenshot,
      screenshot
    }
  })
}

export function context (contextName, func) {
  currentContext = contextName
  func()
  currentContext = null
}

class Testshot extends React.Component {
  render () {
    if (!data.length) {
      // TODO: Replace with nice and stylish welcome page :)
      return <div style={{'text-align': 'center'}}>
        <h1>Welcome to Testshot</h1>
        <p>It's time to add your first scenario.</p>
        <p>Don't know how? Have a look <a href='https://github.com/toptal/testshot/blob/master/docs/usage.md'>here</a>.</p>
      </div>
    }

    if (this.props.routeData.route.name === 'view') {
      return <ScenarioView data={data} routeData={this.props.routeData} />
    }

    return <TestshotWindow host={this.props.server.host} port={this.props.server.port} data={data} routeData={this.props.routeData} />
  }
}

if (PropTypes) {
  Testshot.propTypes = {
    data: PropTypes.array,
    server: PropTypes.shape({
      host: PropTypes.string,
      port: PropTypes.string
    }),
    routeData: PropTypes.object
  }
}

export default Testshot
