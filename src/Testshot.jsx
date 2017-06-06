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
    if (data.length) {
      return <TestshotWindow host={this.props.server.host} port={this.props.server.port} data={data} routeData={this.props.routeData} />
    } else {
      // TODO: Replace with nice and stylish welcome page :)
      return <div style={{'text-align': 'center'}}>
        <h1>Welcome to Testshot</h1>
        <p>It's time to add your first scenario.</p>
        <p>Don't know how? Have a look <a href='https://github.com/toptal/testshot/blob/docs/docs/usage.md'>here</a>.</p>
      </div>
    }
  }
})

export default Testshot
