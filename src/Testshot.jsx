import React, {PropTypes} from 'react'
import ReactDOMServer from 'react-dom/server'
import TestshotWindow from './components/TestshotWindow'

const names = []
const data = []
var currentContext = null

export function scenario (name, type) {
  const contextCopy = currentContext
  if (names.indexOf([name, currentContext]) > -1) {
    throw new Error(`Scenario with name "${name}" already exists`)
  }
  names.push([name, currentContext])

  data.push(() => {
    const scenarioElement = React.createElement(type, {key: name})
    return {
      name,
      element: scenarioElement,
      // TODO: Handle exception during rendering,
      // store and then display it
      snapshot: ReactDOMServer.renderToStaticMarkup(scenarioElement),
      context: contextCopy
    }
  })
}

export function context (contextName, func) {
  currentContext = contextName
  func()
  currentContext = null
}

const Testshot = React.createClass({
  propTypes: {
    data: PropTypes.array,
    server: PropTypes.shape({
      host: PropTypes.string,
      port: PropTypes.string
    }),
    routeData: PropTypes.object
  },

  render () {
    return <div>
      <TestshotWindow host={this.props.server.host} port={this.props.server.port} data={data} routeData={this.props.routeData} />
    </div>
  }
})

export default Testshot
