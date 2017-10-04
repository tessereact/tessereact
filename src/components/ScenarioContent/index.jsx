import React from 'react'
import Header from '../../styled/Header'
import StyledContent from '../../styled/Content'
import ComponentPreview from '../../styled/ComponentPreview'
import AcceptButton from '../../styled/AcceptButton'
import Button from '../../styled/Button'
import SmallButton from '../../styled/SmallButton'
import ScenarioFrame from './ScenarioFrame'
import PanelGroup from './PanelGroup'
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
 * @property {ScenarioObject} props.scenario - list of scenarios created by user
 * @property {Function} props.onAcceptSnapshot
 * @property {Function} props.onRequestScreenshot
 */
class ScenarioContent extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      tab: 'component',
      twoColumns: true,
      resizing: false
    }
  }

  componentWillReceiveProps (nextProps) {
    if (
      this.props.scenario.name !== nextProps.scenario.name ||
        this.props.scenario.context !== nextProps.scenario.context
    ) {
      this.setState({tab: 'component'})
    }
  }

  render () {
    const {scenario} = this.props
    const {tab, twoColumns} = this.state

    if (scenario.hasDiff && twoColumns) {
      return this._renderTwoColumns(scenario)
    } else {
      return this._renderSingleColumn(scenario, tab)
    }
  }

  _renderTwoColumns (scenario) {
    const {onAcceptSnapshot} = this.props

    return <StyledContent.Wrapper>
      <Header>
        <div>
          <span>{scenario.name}</span>
          {/* TODO: enable single column mode */}
          {/* scenario.hasDiff && <Button selected={true} onClick={this._toggleTwoColumns.bind(this)}>Single column mode</Button> */}
        </div>
        <div>
          <a href={`/contexts/${scenario.context}/scenarios/${scenario.name}/view`} target='_blank'>
            <Button>View</Button>
          </a>
          {scenario.hasDiff && <AcceptButton onClick={onAcceptSnapshot}>Accept & next</AcceptButton>}
        </div>
      </Header>
      <PanelGroup
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
            {/* Move screenshot diff to the end of the list if the demo mode is on */}
            {!window.__tessereactDemoMode && this._renderContent(scenario, 'screenshot')}
            {this._renderContent(scenario, 'html')}
            {this._renderContent(scenario, 'css')}
            {window.__tessereactDemoMode && this._renderContent(scenario, 'screenshot')}
          </ComponentPreview>
        </ComponentPreview.RightPane>
      </PanelGroup>
    </StyledContent.Wrapper>
  }

  _renderSingleColumn (scenario, tab) {
    const {onAcceptSnapshot} = this.props

    const {name, context, hasDiff, diff, diffCSS, screenshotData} = scenario

    return <StyledContent.Wrapper>
      <Header>
        <div>
          <span>{name}</span>
          {hasDiff && <Button selected={false} onClick={this._toggleTwoColumns.bind(this)}>Two column mode</Button>}
          {hasDiff && <Button selected={tab === 'component'} onClick={() => this.setState({tab: 'component'})}>Component</Button>}
          {hasDiff && diff && <Button selected={tab === 'html'} onClick={() => this.setState({tab: 'html'})}>HTML</Button>}
          {hasDiff && diffCSS && <Button selected={tab === 'css'} onClick={() => this.setState({tab: 'css'})}>CSS</Button>}
          {screenshotData && <Button selected={tab === 'screenshot'} onClick={() => this.setState({tab: 'screenshot'})}>Screenshot</Button>}
        </div>
        <div>
          <a href={`/contexts/${context}/scenarios/${name}/view`} target='_blank'>
            <Button>View</Button>
          </a>
          {hasDiff && <AcceptButton onClick={onAcceptSnapshot}>Accept & next</AcceptButton>}
        </div>
      </Header>

      <ComponentPreview>
        {this._renderContent(scenario, this.state.tab)}
      </ComponentPreview>
    </StyledContent.Wrapper>
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
        return <div dangerouslySetInnerHTML={{ __html: this._renderDiff(scenario.diff) }} />
      case 'css':
        return <div dangerouslySetInnerHTML={{ __html: this._renderDiff(scenario.diffCSS) }} />
      case 'screenshot':
        return this._renderScreenshotData(scenario)
      case 'resizingComponent':
      case 'component':
      default:
        return <div className='component-iframe_container'>
          {tab === 'resizingComponent' && <div className='component-iframe_overlay' />}
          <ScenarioFrame className='component-iframe' context={scenario.context} name={scenario.name} />
        </div>
    }
  }

  /**
   * Render diff if it not null.
   * @param {String} diff
   */
  _renderDiff (diff) {
    if (diff) {
      return diff
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
      return <div className='d2h-screenshot-diff'>Loading...</div>
    }

    const {height, width} = screenshotSizes[index]

    return <div className='d2h-screenshot-diff'>
      <img style={{height, width, minWidth: width}} src={savedScreenshots[index].url} />
    </div>
  }

  _toggleTwoColumns () {
    this.setState({twoColumns: !this.state.twoColumns})
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
