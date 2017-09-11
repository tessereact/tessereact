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

/**
 * Create a scenario.
 * @param {String} name - name of the scenario
 * @param {React.Component} type - component to create a scenario from
 * @param {Object} [options]
 * @param {Boolean} [options.css] - enable CSS diff
 * @param {Boolean} [options.screenshot] - enable CSS and screenshot diff.
 *   When true, ignore the value of `options.css`
 */
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

/**
 * Recieves the name of context and a function.
 * Any scenarios created inside the function would have that context.
 * @param {String} contextName
 * @param {Function} func
 */
export function context (contextName, func) {
  currentContext = contextName
  func()
  currentContext = null
}

/**
 * UI of Tessereact.
 * @extends React.Component
 * @property {String} props.host - host of the Tessereact server
 * @property {String} props.port - port of the Tessereact server
 * @property {RouteData} props.routeData
 */
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
    server: PropTypes.shape({
      host: PropTypes.string.isRequired,
      port: PropTypes.string.isRequired
    }),
    routeData: PropTypes.object.isRequired
  }
}

export default Testshot
