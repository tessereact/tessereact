import React from 'react'
import Header from '../../styled/Header'
import StyledContent from '../../styled/Content'
import ComponentPreview from '../../styled/ComponentPreview'
import AcceptButton from '../../styled/AcceptButton'
import Button from '../../styled/Button'
import SmallButton from '../../styled/SmallButton'
import ScenarioFrame from './ScenarioFrame'
import PanelGroup from './PanelGroup'
import Diff from './Diff'
import './style.css'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * UI element, which contains header, scenario and diffs.
 * Represents selected scenario.
 * @extends React.Component
 * @property {ScenarioObject} props.scenario
 * @property {Function} props.onAcceptSnapshot
 * @property {Function} props.onRequestScreenshot
 */
class ScenarioContent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      resizing: false,
      splitView: window.localStorage.getItem('splitView') === 'true'
    }
  }

  render () {
    const {scenario} = this.props
    return <StyledContent.Wrapper>
      {this._renderScenarioHeader(scenario)}
      {this._renderScenarioContent(scenario)}
    </StyledContent.Wrapper>
  }

  _renderScenarioHeader (scenario) {
    const {name, context, hasDiff} = scenario
    const {onAcceptSnapshot} = this.props

    return <Header>
      <div>
        <span>{name}</span>
      </div>
      <div>
        {hasDiff && <Button selected={this.state.splitView} onClick={() => this._toggleSplitView()}>
          Split view
        </Button>}
        <a href={`/contexts/${context}/scenarios/${name}/view`} target='_blank'>
          <Button>Open in a new tab</Button>
        </a>
        {hasDiff && <AcceptButton onClick={onAcceptSnapshot}>Accept & next</AcceptButton>}
      </div>
    </Header>
  }

  _renderScenarioContent (scenario) {
    if (!scenario.hasDiff) {
      return <ComponentPreview>
        {this._renderContent(scenario, 'component')}
      </ComponentPreview>
    }

    if (this.state.splitView) {
      return <PanelGroup
        onStartResizing={() => this.setState({resizing: true})}
        onStopResizing={() => this.setState({resizing: false})}
        panelWidths={[
          {minSize: 100},
          {minSize: 400, size: 500}
        ]}
      >
        <ComponentPreview.LeftPane>
          <ComponentPreview>
            {this._renderContent(scenario, this.state.resizing ? 'resizingComponent' : 'component')}
          </ComponentPreview>
        </ComponentPreview.LeftPane>
        <ComponentPreview.RightPane>
          <ComponentPreview>
            {this._renderContent(scenario, 'screenshot')}
            {this._renderContent(scenario, 'html')}
            {this._renderContent(scenario, 'css')}
          </ComponentPreview>
        </ComponentPreview.RightPane>
      </PanelGroup>
    }

    return <ComponentPreview>
      {this._renderContent(scenario, 'component')}
      {this._renderContent(scenario, 'screenshot')}
      {this._renderContent(scenario, 'html')}
      {this._renderContent(scenario, 'css')}
    </ComponentPreview>
  }

  /**
   * Render an entity (tab) of the scenario.
   * @param {ScenarioObject} scenario
   * @param {'html'|'css'|'screenshot'|'component'|'resizingComponent'} tab
   */
  _renderContent (scenario, tab) {
    if (scenario.status !== 'resolved') {
      return <div>Loading...</div>
    }

    switch (tab) {
      case 'html':
        return <Diff scenario={scenario} type='html' sideBySide={!this.state.splitView} />
      case 'css':
        return <Diff scenario={scenario} type='css' sideBySide={!this.state.splitView} />
      case 'screenshot':
        return this._renderScreenshotData(scenario)
      case 'resizingComponent':
      case 'component':
      default:
        return <div className={this.state.splitView ? 'split_view-iframe_container' : 'component-iframe_container'}>
          {tab === 'resizingComponent' && <div className='component-iframe_overlay' />}
          <ScenarioFrame className='component-iframe' context={scenario.context} name={scenario.name} />
        </div>
    }
  }

  /**
   * Render screenshot header and diff of the scenario.
   * @param {ScenarioObject} scenario
   */
  _renderScreenshotData (scenario) {
    const {screenshotData} = scenario
    const {onRequestScreenshot} = this.props

    if (!screenshotData || !screenshotData.before || !screenshotData.after) {
      return null
    }

    const {screenshotSizes, selectedScreenshotSizeIndex, savedScreenshots} = screenshotData

    return <div className='d2h-file-wrapper'>
      <div className='d2h-file-header'>
        <span className='d2h-file-name-wrapper'>
          <span className='d2h-icon-wrapper'>
            <svg className='d2h-icon' height='16' version='1.1' viewBox='0 0 12 16' width='12'>
              <path d='M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z' />
            </svg>
          </span>
          <span className='d2h-file-name'>
            Visual Diff
          </span>
          {screenshotSizes.map(({alias, width, height}, index) =>
            <SmallButton
              key={index}
              onClick={() => onRequestScreenshot(index)}
              selected={index === selectedScreenshotSizeIndex}
            >
              {alias || `${width} × ${height}`}
            </SmallButton>
          )}
        </span>
      </div>

      {this._renderScreenshot(screenshotSizes, savedScreenshots, selectedScreenshotSizeIndex)}
    </div>
  }

  /**
   * Render the selected screenshot if it is cached.
   * @param {Array<Object>} screenshotSizes
   * @param {Array<String>} savedScreenshots
   * @param {Number} selectedScreenshotSizeIndex
   */
  _renderScreenshot (screenshotSizes, savedScreenshots, index) {
    if (index == null) {
      return null
    }

    if (!savedScreenshots || !savedScreenshots[index] || savedScreenshots[index].status === 'loading') {
      return <div
        className='d2h-screenshot-diff d2h-screenshot-loading'
      >
        Loading...
      </div>
    }

    const { width } = screenshotSizes[index]

    return <div className='d2h-screenshot-diff'>
      <img style={{width, minWidth: width}} src={savedScreenshots[index].url} />
    </div>
  }

  /**
   * Change from split view mode to single column mode and vice versa.
   */
  _toggleSplitView () {
    const splitView = !this.state.splitView
    window.localStorage.setItem('splitView', splitView)
    this.setState({ splitView })
  }
}

if (PropTypes) {
  ScenarioContent.propTypes = {
    scenario: PropTypes.object.isRequired,
    onAcceptSnapshot: PropTypes.func.isRequired,
    onRequestScreenshot: PropTypes.func.isRequired
  }
}

export default ScenarioContent
