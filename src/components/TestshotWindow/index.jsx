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
          selectedScenario={this.state.selectedScenario}
          selectScenario={this._handleSelect}
        />
        <TestshotContent>
          <ComponentPreview>
            <Header>{this.state.selectedScenario.name}</Header>
            {this.state.selectedScenario.element}
          </ComponentPreview>
          {this._renderDiff()}
          {this.state.selectedScenario.hasDiff &&
            <AcceptButton onClick={this._acceptSnapshot}>Accept</AcceptButton> }
        </TestshotContent>
      </TestshotContainer>
    )
  },

  _acceptSnapshot () {
    const url = `//${this.props.host}:${this.props.port}/snapshots`
    postJSON(url, requestScenarioAcceptance(this.state.selectedScenario)).then(() => {
      this.setState(pickFailingScenario(acceptCurrentScenario(this.state)))
    })
  },

  _renderDiff () {
    if (this.state.selectedScenario.hasDiff) {
      return this._computeDiff()
    } else {
      return <p>Snapshots are identical!</p>
    }
  },

  _computeDiff () {
    const previousSnapshot = this.state.selectedScenario.previousSnapshot
    const snapshot = this.state.selectedScenario.snapshot
    const diff = htmlDiffer.diffHtml(previousSnapshot, snapshot)
    return <Diff nodes={diff} />
  },

  _handleSelect (key, context) {
    this.setState({selectedScenario: find(this.state.scenarios, {name: key, context: context})})
  }
})

export default TestshotWindow

