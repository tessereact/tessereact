import React, {PropTypes} from 'react'
import { chunk } from 'lodash'
import Navigation from '../../components/Navigation'
import postJSON from './_lib/postJSON'
import onLoad from './_lib/onLoad'
import {
  checkIfRouteExists,
  checkForHomeRoute,
  redirectToFirstFailingScenario
} from './_lib/routes'
import {
  findScenario,
  getScenariosToLoad,
  acceptScenario,
  resolveScenario,
  changeScenarioScreenshotData,
  requestScenarioAcceptance,
} from './_lib/scenarios'
import generateTreeNodes from './_lib/generateTreeNodes'
import prepareStyles from './_lib/prepareStyles'

// styled components
import TestshotContainer from '../../styled/TestshotContainer'
import Header from '../../styled/Header'
import TestshotContent from '../../styled/TestshotContent'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'
import AcceptButton from '../../styled/AcceptButton'
import Button from '../../styled/Button'
import SmallButton from '../../styled/SmallButton'
import Text from '../../styled/Text'
import './diff2html.css'

const SCENARIO_CHUNK_SIZE = Infinity

const TestshotWindow = React.createClass({
  propTypes: {
    data: PropTypes.array.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    routeData: PropTypes.object
  },

  getInitialState () {
    return {
      scenarios: this.props.data
    }
  },

  componentWillMount () {
    const { routeData } = this.props
    const url = `//${this.props.host}:${this.props.port}/snapshots-list`

    onLoad()
      .then(() => {
        const { scenarios } = this.state

        const styles = prepareStyles(document.styleSheets)

        const scenariosToLoad = getScenariosToLoad(routeData, scenarios)
          .map(scenario => ({
            name: scenario.name,
            context: scenario.context,
            snapshot: scenario.getSnapshot(),
            options: scenario.options
          }))

        const chunks = chunk(scenariosToLoad, SCENARIO_CHUNK_SIZE || Infinity)

        return Promise.all(
          chunks.map(scenariosChunk =>
            postJSON(url, { scenarios: scenariosChunk, styles })
              .then(response => response.json())
              .then(({scenarios: responseScenarios}) =>
                this.setState({
                  scenarios: responseScenarios.reduce(resolveScenario, scenarios)
                })
              )
              .catch(e => console.log('Snapshot server is not available!', e))
          )
        )
      })
      .then(() => {
        const { scenarios } = this.state

        checkForHomeRoute(routeData, scenarios)
        checkIfRouteExists(routeData, scenarios)

        // Report to CI
        if (window.__testshotWSURL) {
          const failingScenarios = scenarios
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
        }
      })
      .catch(e => {
        console.log('Unexpected error!', e)
      })
  },

  componentWillReceiveProps (nextProps) {
    checkForHomeRoute(nextProps.routeData, this.state.scenarios)
  },

  render () {
    const {
      params: { context, scenario },
      route: { name: routeName }
    } = this.props.routeData

    const { scenarios } = this.state

    return (
      <TestshotContainer>
        <Navigation
          loadedScenariosCount={scenarios.filter(c => c.status === 'resolved').length}
          failedScenariosCount={scenarios.filter(c => c.hasDiff).length}
          scenariosCount={scenarios.length}
          nodes={generateTreeNodes(scenarios.filter(c => c.status === 'resolved'))}
        />
        <TestshotContent>
          {routeName === 'context' && this._renderContext(context)}
          {routeName === 'scenario' && this._renderScenario(findScenario(scenarios, context, scenario))}
        </TestshotContent>
      </TestshotContainer>
    )
  },

  _renderScenario (scenario) {
    if (!scenario) return null
    return <TestshotContent.Wrapper>
      <Header>
        <span>{scenario.name}</span>
        <div>
          <a href={`/contexts/${scenario.context}/scenarios/${scenario.name}/view`} target='_blank'>
            <Button>View</Button>
          </a>
          {scenario.hasDiff && <AcceptButton onClick={() => this._acceptSnapshot(scenario)}>Accept & next</AcceptButton>}
        </div>
      </Header>
      <ComponentPreview>
        {scenario.element}
      </ComponentPreview>
      <div>
        {this._renderScreenshotData(scenario)}
        <div dangerouslySetInnerHTML={{ __html: this._renderDiff(scenario) }} />
      </div>
    </TestshotContent.Wrapper>
  },

  _renderContext (contextName) {
    const scenarios = this.state.scenarios
      .filter(s => s.context === contextName)
      .sort((a, b) => a.name.localeCompare(b.name))

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
    return s.hasDiff
      ? <Text color='#e91e63' fontSize='14px'>{s.name}</Text>
      : <Text color='#8f9297' fontSize='14px'>{s.name}</Text>
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

  _acceptSnapshot (scenario) {
    const {host, port} = this.props
    const url = `//${host}:${port}/snapshots`

    postJSON(url, requestScenarioAcceptance(scenario)).then(() => {
      const scenarios = acceptScenario(this.state.scenarios, scenario)
      this.setState({scenarios})
      redirectToFirstFailingScenario(scenarios)
    })
  },

  _requestScreenshot (scenario, size) {
    const {host, port} = this.props
    const url = `//${host}:${port}/screenshots`
    const {before, after} = scenario.screenshotData

    postJSON(url, {before, after, size})
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const scenarios = changeScenarioScreenshotData(this.state.scenarios, scenario, () => ({url}))
        this.setState({scenarios})
      })
  },

  _renderDiff (scenario) {
    if (scenario.hasDiff) {
      return scenario.diff
    }
  },

  _renderScreenshotData (scenario) {
    const {screenshotData} = scenario

    if (!screenshotData) {
      return null
    }

    return <div className='d2h-file-wrapper'>
      <div className='d2h-file-header'>
        <span className='d2h-file-name-wrapper'>
          <span className='d2h-icon-wrapper'>
            <svg className='d2h-icon' height='16' version='1.1' viewBox='0 0 12 16' width='12'>
              <path d='M6 5H2v-1h4v1zM2 8h7v-1H2v1z m0 2h7v-1H2v1z m0 2h7v-1H2v1z m10-7.5v9.5c0 0.55-0.45 1-1 1H1c-0.55 0-1-0.45-1-1V2c0-0.55 0.45-1 1-1h7.5l3.5 3.5z m-1 0.5L8 2H1v12h10V5z'></path>
            </svg>
          </span>
          <span className='d2h-file-name'>
            Screenshots
          </span>
          {screenshotData.screenshotSizes.map(({alias, width, height}, index) =>
            <SmallButton
              key={index}
              onClick={() => this._requestScreenshot(scenario, {width, height})}
            >
              {alias || `${width} ⨯ ${height}`}
            </SmallButton>
          )}
        </span>
      </div>

      {this._renderScreenshot(screenshotData.url)}
    </div>
  },

  _renderScreenshot (url) {
    if (!url) {
      return null
    }

    return <div className='d2h-screenshot-diff'>
      <img src={url} />
    </div>
  }
})

export default TestshotWindow
