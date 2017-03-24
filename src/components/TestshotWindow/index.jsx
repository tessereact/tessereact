import React, {PropTypes} from 'react'
import {find} from 'lodash'
import {HtmlDiffer} from 'html-differ'
import Diff from '../../components/Diff'
import Navigation from '../../components/Navigation'
import {postJSON} from '../../lib/fetch'
import {
  buildInitialState,
  pickFailingScenario,
  requestScenariosList,
  mergeWithPayload,
  acceptCurrentScenario,
  requestScenarioAcceptance,
  generateTreeNodes
} from './helpers'

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
        this.setState(pickFailingScenario(mergeWithPayload(this.state, json)))

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
      <TestshotContainer>
        <Navigation
          failedScenariosCount={this.state.scenarios.filter(c => c.hasDiff).length}
          scenariosCount={this.state.scenarios.length}
          nodes={generateTreeNodes(this.state.scenarios)}
          selectedNode={this.state.selectedNode}
          selectNode={this._handleSelect}
        />
        <TestshotContent>
          <div>
            <Header color='#32363d'>
              <span>{this.state.selectedNode.name}</span>
              {this.state.selectedNode.hasDiff && <AcceptButton onClick={this._acceptSnapshot}>Accept & next</AcceptButton>}
            </Header>
            <ComponentPreview>
              {this._renderContent()}
            </ComponentPreview>
          </div>
          {this._renderDiff()}
        </TestshotContent>
      </TestshotContainer>
    )
  },

  _renderSectionHeader (s) {
    return s.hasDiff ? <Text color='#e91e63' fontSize='14px'>{s.name}</Text> : <Text color='#8f9297' fontSize='14px'>{s.name}</Text>
  },

  _renderContent () {
    if (this.state.selectedNode.isScenario) {
      return this.state.selectedNode.element
    } else {
      const scenarios = this.state.scenarios.filter(s => (s.context === this.state.selectedNode.name))
      return scenarios.map(s => (<ScenarioBlock>
        {this._renderSectionHeader(s)}
        <ScenarioBlockContent key={s.name}>
          {s.element}
        </ScenarioBlockContent>
      </ScenarioBlock>))
    }
  },

  _acceptSnapshot () {
    const url = `//${this.props.host}:${this.props.port}/snapshots`
    postJSON(url, requestScenarioAcceptance(this.state.selectedNode)).then(() => {
      this.setState(pickFailingScenario(acceptCurrentScenario(this.state)))
    })
  },

  _renderDiff () {
    if (this.state.selectedNode.hasDiff) {
      return this._computeDiff()
    }
  },

  _computeDiff () {
    const previousSnapshot = this.state.selectedNode.previousSnapshot
    const snapshot = this.state.selectedNode.snapshot
    const diff = htmlDiffer.diffHtml(previousSnapshot, snapshot)
    return <Diff nodes={diff} />
  },

  _handleSelect (context, scenario) {
    if (scenario) {
      this.setState({selectedNode: find(this.state.scenarios, {name: scenario, context: context})})
    } else {
      this.setState({selectedNode: {name: context}})
    }
  }
})

export default TestshotWindow

