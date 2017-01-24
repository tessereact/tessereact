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
import Link from './styled/Link'
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

// TODO: Delay this function execution
// TODO: Add simulations from prev implementation
export const scenario = function (testName, componentBuilder) {
  if (names.indexOf(testName) > -1) {
    throw new Error('Scenario with name "' + testName + '" already exists');
  }
  names.push(testName)
  const json = ReactTestRenderer.create(componentBuilder()).toJSON()
  return data.push({
    name: testName,
    component: componentBuilder(),
    snapshot: ReactDOMServer.renderToStaticMarkup(componentBuilder())
  })
}

const Testshot = React.createClass({

  getInitialState () {
    return {
      selectedSnapshot: this.props.snapshots[0] || {},
      snapshots: this.props.snapshots
    }
  },

  // TODO: Pass URL from config
  componentWillMount () {
    if (!this.props.host || !this.props.port) throw new Error('Configure "host" and "port" please.')
    const url = `//${this.props.host}:${this.props.port}/snapshots-list`
    postJSON(url, {
      data: this.state.snapshots
    }).then((response) => {
      response.json().then((json) => {
        const newData = this.state.snapshots.map((s) => {
          s.previousSnapshot = lodash.find(json, {name: s.name}).previousSnapshot
          return s
        })
        // TODO: Avoid setting states few times in a row
        this.setState({snapshots: newData})
        this.pickNextFailingScenario()
      })
    })
  },

  render() {
    return (
      <TestshotContainer>
        <Sidebar>
          <Header>Scenarios</Header>
          <ul>
          {lodash.map(this.state.snapshots, (value, i) => {
            return (<li key={i}>
              <ScenarioLink
                noDiff={this.noDiff(value)}
                onClick={this.handleSelect.bind(this, value.name)}
                key={value.name}
                active={this.state.selectedSnapshot.name === value.name}
              >
                {value.name}
              </ScenarioLink>
            </li>)
          })}
          </ul>
        </Sidebar>
        <TestshotContent>
          <Header>{this.state.selectedSnapshot.name}</Header>
          {this.state.selectedSnapshot.component}
          {!lodash.isEqual(this.state.selectedSnapshot.snapshot, this.state.selectedSnapshot.previousSnapshot) &&
            <AcceptButton onClick={this.acceptSnapshot.bind(this)}>Accept</AcceptButton> }
        </TestshotContent>
        <Sidebar right>
          <Header>Diff</Header>
          {this.renderDiff()}
        </Sidebar>
      </TestshotContainer>
    );
  },


  // TODO: Extract requests to a different module
  acceptSnapshot () {
    const url = `//${this.props.host}:${this.props.port}/snapshots`
    postJSON(url, {
      name: this.state.selectedSnapshot.name,
      snapshot: this.state.selectedSnapshot.snapshot
    }).then(function() {
      // TODO: Remove page reloading
      window.location.href = '/'
    })
  },

  pickNextFailingScenario () {
    const failingScenario = lodash.find(this.state.snapshots, (s) => !lodash.isEqual(s.snapshot, s.previousSnapshot))
    if (failingScenario) {
      const newState = Object.assign({}, this.state)
      newState.selectedSnapshot = failingScenario
      this.setState(newState)
    }
  },

  noDiff(scenario) {
    return lodash.isEqual(scenario.snapshot, scenario.previousSnapshot)
  },

  renderDiff() {
    if (this.noDiff(this.state.selectedSnapshot)) {
      return <p>Snapshots are identical!</p>
    } else {
      return <div>
      <pre>{this.computeDiff()}</pre>
    </div>
    }
  },

  computeDiff() {
    console.log(Formatter)
    var diff = htmlDiffer.diffHtml(this.state.selectedSnapshot.previousSnapshot, this.state.selectedSnapshot.snapshot)
    return <Formatter nodes={diff} />
  },

  renderPreviousSnapshot() {
    if (this.state.selectedSnapshot.previousSnapshot) {
      return <div>
        <h4>Previous snapshot:</h4>
        <div><pre>{JSON.stringify(this.state.selectedSnapshot.previousSnapshot, null, 2) }</pre></div>
      </div>
    }
  },

  handleSelect (key) {
    this.setState({selectedSnapshot: lodash.find(this.state.snapshots, ['name', key])})
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
      {this.state.show && <Testshot host={this.props.server.host} port={this.props.server.port} snapshots={data} />}
      <Link onClick={this.toggleTestshot.bind(this)} href="#">Testshot</Link>
    </div>
  },

  toggleTestshot () {
    localStorage.setItem('testing', !this.state.show);
    this.setState({show: !this.state.show})
  }
})

export default TestshotWrapper
