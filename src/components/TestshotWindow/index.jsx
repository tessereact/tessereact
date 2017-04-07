import React, {PropTypes} from 'react'
import {find} from 'lodash'
import {HtmlDiffer} from 'html-differ'
import Diff from '../../components/Diff'
import Navigation from '../../components/Navigation'
import {postJSON} from '../../lib/fetch'
import {
  buildInitialState,
  requestScenariosList,
  mergeWithPayload,
  acceptCurrentScenario,
  requestScenarioAcceptance,
  generateTreeNodes
} from './helpers'
import {BrowserRouter, Route} from 'react-router-dom'
import {Redirect} from 'react-router'

// styled components
import TestshotContainer from '../../styled/TestshotContainer'
import Header from '../../styled/Header'
import TestshotContent from '../../styled/TestshotContent'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'
import AcceptButton from '../../styled/AcceptButton'
import Text from '../../styled/Text'

const htmlDiffer = new HtmlDiffer({
  ignoreWhitespaces: false
})

const TestshotWindow = React.createClass({
  propTypes: {
    data: PropTypes.array.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired
  },

  getInitialState () {
    return buildInitialState(this.props.data)
  },

  componentWillMount () {
    const url = `//${this.props.host}:${this.props.port}/snapshots-list`
    postJSON(url, requestScenariosList(this.state.scenarios)).then((response) => {
      response.json().then((json) => {
        this.setState(mergeWithPayload(this.state, json))

        // Report to CI
        const failingScenarios = this.state.scenarios
          .filter(({hasDiff}) => hasDiff)
          .map(({context, name}) => ({context, name}))

        const ws = new window.WebSocket(window.__testshotWSURL)
        ws.addEventListener('open', () => {
          if (failingScenarios.length > 0) {
            ws.send(JSON.stringify(failingScenarios))
          } else {
            ws.send('OK')
          }
        })
      })
    }, _ => {
      window.alert('Snapshot server is not available!')
    })
  },

  render () {
    return (
      <BrowserRouter>
        <TestshotContainer>
          <Navigation
            failedScenariosCount={this.state.scenarios.filter(c => c.hasDiff).length}
            scenariosCount={this.state.scenarios.length}
            nodes={generateTreeNodes(this.state.scenarios)}
          />
          {this.state.scenarios[0].hasOwnProperty('hasDiff') && <TestshotContent>
            <Route exact path='/' render={_ => {
              const scenario = find(this.state.scenarios, (s) => s.hasDiff) || this.state.scenarios[0]
              return <Redirect to={`/contexts/${scenario.context}/scenarios/${scenario.name}`} />
            }} />
            <Route exact path='/contexts/:context' render={({match}) => {
              return this._renderContext(match.params.context)
            }} />
            <Route path='/contexts/:context/scenarios/:scenario' render={routerContext => {
              const {match, history} = routerContext
              return this._renderScenario(history, match.params.context, match.params.scenario)
            }} />
          </TestshotContent>}
        </TestshotContainer>
      </BrowserRouter>
    )
  },

  _renderScenario (history, contextName, scenarioName) {
    const scenario = find(this.state.scenarios, s => {
      if (contextName !== 'null') {
        return s.name === scenarioName && s.context === contextName
      } else {
        return s.name === scenarioName && !s.context
      }
    })
    return <TestshotContent.Wrapper>
      <Header>
        <span>{scenario.name}</span>
        {scenario.hasDiff && <AcceptButton onClick={_ => this._acceptSnapshot(scenario, history)}>Accept & next</AcceptButton>}
      </Header>
      <ComponentPreview>
        {scenario.element}
      </ComponentPreview>
      {this._renderDiff(scenario)}
    </TestshotContent.Wrapper>
  },

  _renderContext (contextName) {
    const scenarios = this.state.scenarios.filter(s => (s.context === contextName))
    return <TestshotContent.Wrapper>
      <Header>
        <span>{contextName}</span>
      </Header>
      <ComponentPreview>
        {scenarios.map(s => (<ScenarioBlock key={s.name}>
          {this._renderSectionHeader(s)}
          <ScenarioBlockContent key={s.name}>
            {s.element}
          </ScenarioBlockContent>
        </ScenarioBlock>))}
      </ComponentPreview>
    </TestshotContent.Wrapper>
  },

  _renderSectionHeader (s) {
    return s.hasDiff ? <Text color='#e91e63' fontSize='14px'>{s.name}</Text> : <Text color='#8f9297' fontSize='14px'>{s.name}</Text>
  },

  _renderContent (node) {
    if (node.isScenario) {
      return node.element
    } else {
      const scenarios = this.state.scenarios.filter(s => (s.context === node.name))
      return scenarios.map(s => (<ScenarioBlock>
        {this._renderSectionHeader(s)}
        <ScenarioBlockContent key={s.name}>
          {s.element}
        </ScenarioBlockContent>
      </ScenarioBlock>))
    }
  },

  _acceptSnapshot (scenario, history) {
    const url = `//${this.props.host}:${this.props.port}/snapshots`
    postJSON(url, requestScenarioAcceptance(scenario)).then(_ => {
      this.setState(acceptCurrentScenario(this.state, scenario))
      history.push('/')
    })
  },

  _renderDiff (scenario) {
    if (scenario.hasDiff) {
      return this._computeDiff(scenario)
    }
  },

  _computeDiff (scenario) {
    const previousSnapshot = scenario.previousSnapshot
    const snapshot = scenario.snapshot
    if (!snapshot.length) { return null }
    const diff = htmlDiffer.diffHtml(previousSnapshot, snapshot)
    return <Diff nodes={diff} />
  }
})

export default TestshotWindow
