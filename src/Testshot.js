const React = require('react')
import lodash from 'lodash'
// const enzyme = require('enzyme')
import ReactTestRenderer from 'react-test-renderer'
import classnames from 'classnames'
import ReactDOMServer from 'react-dom/server'
import {HtmlDiffer} from "html-differ"
import logger from 'html-differ/lib/logger'
import escape from 'escape-html'
import Formatter from './Formatter'
import {postJSON} from './Fetch'

// styled components
import TestshotContainer from './styled/TestshotContainer'
import TestshotToggle from './styled/TestshotToggle'
import Header from './styled/Header'
import Sidebar from './styled/Sidebar'
import AcceptButton from './styled/AcceptButton'
import TestshotContent from './styled/TestshotContent'
import ScenarioLink from './styled/ScenarioLink'

const htmlDiffer = new HtmlDiffer({});
var names = []
var data = []

// TODO: Do it properly
export const context = function (callback) {
  callback()
}

// TODO: Add simulations from prev implementation
export const scenario = function (testName, componentBuilder) {
  if (names.indexOf(testName) > -1) {
    throw new Error('Scenario with name "' + testName + '" already exists');
  }
  names.push(testName)
  data.push(function() {
    const component = componentBuilder()
    return {
      name: testName,
      component: component,
      snapshot: ReactDOMServer.renderToStaticMarkup(component)
    }
  })
}

const Testshot = React.createClass({

  getInitialState () {
    const scenarios = this.props.data.map((f) => (f()))
    return {
      selectedScenario: scenarios[0] || {},
      scenarios: scenarios
    }
  },

  // TODO: Pass URL from config
  componentWillMount () {
    if (!this.props.host || !this.props.port) throw new Error('Configure "host" and "port" please.')
    const url = `//${this.props.host}:${this.props.port}/snapshots-list`
    postJSON(url, {
      data: this.state.scenarios.map((s) => ({name: s.name}))
    }).then((response) => {
      response.json().then((json) => {
        const newData = this.state.scenarios.map((s) => {
          s.previousSnapshot = lodash.find(json, {name: s.name}).previousSnapshot
          return s
        })
        // TODO: Avoid setting states few times in a row
        this.setState({scenarios: newData})
        this.pickNextFailingScenario()
      })
    }, () => {
      alert('Snapshot server is not available!')
    })
  },

  render() {
    return (
      <TestshotContainer>
        <Sidebar>
          <Header>Scenarios</Header>
          <ul>
          {lodash.map(this.state.scenarios, (value, i) => {
            return (<li key={i}>
              <ScenarioLink
                noDiff={this.noDiff(value)}
                onClick={this.handleSelect.bind(this, value.name)}
                key={value.name}
                active={this.state.selectedScenario.name === value.name}
              >
                {value.name}
              </ScenarioLink>
            </li>)
          })}
          </ul>
        </Sidebar>
        <TestshotContent>
          <Header>{this.state.selectedScenario.name}</Header>
          {this.state.selectedScenario.component}
          {!lodash.isEqual(this.state.selectedScenario.snapshot, this.state.selectedScenario.previousSnapshot) &&
            <AcceptButton onClick={this.acceptSnapshot.bind(this)}>Accept</AcceptButton> }
        </TestshotContent>
        <Sidebar right>
          <Header>Diff</Header>
          {this.renderDiff()}
        </Sidebar>
      </TestshotContainer>
    )
  },

  // TODO: Extract requests to a different module
  acceptSnapshot () {
    const url = `//${this.props.host}:${this.props.port}/snapshots`
    postJSON(url, {
      name: this.state.selectedScenario.name,
      snapshot: this.state.selectedScenario.snapshot
    }).then(() => {
      const newState = Object.assign({}, this.state)
      newState.selectedScenario.previousSnapshot = newState.selectedScenario.snapshot
      this.setState(newState)
      this.pickNextFailingScenario()
    })
  },

  pickNextFailingScenario () {
    const failingScenario = lodash.find(this.state.scenarios, (s) => !lodash.isEqual(s.snapshot, s.previousSnapshot))
    if (failingScenario) {
      const newState = Object.assign({}, this.state)
      newState.selectedScenario = failingScenario
      this.setState(newState)
    }
  },

  noDiff(scenario) {
    return lodash.isEqual(scenario.snapshot, scenario.previousSnapshot)
  },

  renderDiff() {
    if (this.noDiff(this.state.selectedScenario)) {
      return <p>Snapshots are identical!</p>
    } else {
      return <div>
      <pre>{this.computeDiff()}</pre>
    </div>
    }
  },

  computeDiff() {
    var diff = htmlDiffer.diffHtml(this.state.selectedScenario.previousSnapshot, this.state.selectedScenario.snapshot)
    return <Formatter nodes={diff} />
  },

  renderPreviousSnapshot() {
    if (this.state.selectedScenario.previousSnapshot) {
      return <div>
        <h4>Previous snapshot:</h4>
        <div><pre>{JSON.stringify(this.state.selectedScenario.previousSnapshot, null, 2) }</pre></div>
      </div>
    }
  },

  handleSelect (key) {
    this.setState({selectedScenario: lodash.find(this.state.scenarios, ['name', key])})
  }
})

// TODO: Button and Testshot workspace should be rendered only in Dev environment
const TestshotWrapper = React.createClass({
  getInitialState () {
    return {
      show: localStorage.getItem('testing') == 'true'
    }
  },

  render () {
    return <div>
      {this.props.children}
      {this.state.show && <Testshot host={this.props.server.host} port={this.props.server.port} data={data} />}
      <TestshotToggle onClick={this.toggleTestshot.bind(this)} href="#">Testshot</TestshotToggle>
    </div>
  },

  toggleTestshot () {
    localStorage.setItem('testing', !this.state.show);
    this.setState({show: !this.state.show})
  }
})

export default TestshotWrapper
