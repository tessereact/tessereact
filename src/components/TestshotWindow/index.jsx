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
import AcceptButton from '../../styled/AcceptButton'
import TestshotContent from '../../styled/TestshotContent'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'

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
      })
    }, _ => {
      window.alert('Snapshot server is not available!')
    })
  },

  render () {
    return (
      <TestshotContainer>
        <Navigation
          nodes={generateTreeNodes(this.state.scenarios)}
          selectedNode={this.state.selectedNode}
          selectNode={this._handleSelect}
        />
        <TestshotContent>
          <ComponentPreview>
            <Header>{this.state.selectedNode.name}</Header>
            {this._renderContent()}
          </ComponentPreview>
          {this._renderDiff()}
          {this.state.selectedNode.hasDiff &&
            <AcceptButton onClick={this._acceptSnapshot}>Accept</AcceptButton> }
        </TestshotContent>
      </TestshotContainer>
    )
  },

  _renderContent () {
    if (this.state.selectedNode.isScenario) {
      return this.state.selectedNode.element
    } else {
      const scenarios = this.state.scenarios.filter(s => (s.context === this.state.selectedNode.name))
      return scenarios.map(s => (<ScenarioBlock>
        <h3>{s.name}</h3>
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

