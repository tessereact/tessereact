import React from 'react'
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
  requestScenarioAcceptance
} from './_lib/scenarios'
import generateTreeNodes from './_lib/generateTreeNodes'
import prepareStyles from './_lib/prepareStyles'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

// styled components
import Container from '../../styled/Container'
import Header from '../../styled/Header'
import Content from '../../styled/Content'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'
import AcceptButton from '../../styled/AcceptButton'
import Button from '../../styled/Button'
import SmallButton from '../../styled/SmallButton'
import Text from '../../styled/Text'
import './diff2html.css'

const SCENARIO_CHUNK_SIZE = Infinity

/**
 * UI of main Tessereact window.
 * @extends React.Component
 * @property {Array<ScenarioObject>} props.data - list of scenarios created by user
 * @property {String} props.host - host of the Tessereact server
 * @property {String} props.port - port of the Tessereact server
 * @property {RouteData} props.routeData
 */
class MainView extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      scenarios: props.data
    }
  }

  /**
   * Load snapshots from the server
   */
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
        if (window.__tessereactWSURL) {
          const failingScenarios = scenarios
            .filter(({hasDiff}) => hasDiff)
            .map(({context, name}) => ({context, name}))

          const ws = new window.WebSocket(window.__tessereactWSURL)
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
  }

  componentWillReceiveProps (nextProps) {
    checkForHomeRoute(nextProps.routeData, this.state.scenarios)
  }

  render () {
    const {
      params: { context, scenario },
      route: { name: routeName }
    } = this.props.routeData

    const { scenarios } = this.state

    return (
      <Container>
        <Navigation
          loadedScenariosCount={scenarios.filter(c => c.status === 'resolved').length}
          failedScenariosCount={scenarios.filter(c => c.hasDiff).length}
          scenariosCount={scenarios.length}
          nodes={generateTreeNodes(scenarios.filter(c => c.status === 'resolved'))}
        />
        <Content>
          {routeName === 'context' && this._renderContext(context)}
          {routeName === 'scenario' && this._renderScenario(findScenario(scenarios, context, scenario))}
        </Content>
      </Container>
    )
  }

  /**
   * Render UI element, which contains header, scenario and diffs.
   * Represents selected scenario.
   * @param {ScenarioObject} scenario
   */
  _renderScenario (scenario) {
    if (!scenario) return null
    return <Content.Wrapper>
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
    </Content.Wrapper>
  }

  /**
   * Render UI element, which contains header and scenarios of the selected context.
   * @param {String} contextName
   */
  _renderContext (contextName) {
    const scenarios = this.state.scenarios
      .filter(s => s.context === contextName)
      .sort((a, b) => a.name.localeCompare(b.name))

    return <Content.Wrapper>
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
    </Content.Wrapper>
  }

  /**
   * Render scenario header inside the selected context.
   * @param {ScenarioObject} scenario
   */
  _renderSectionHeader (s) {
    return s.hasDiff
      ? <Text color='#e91e63' fontSize='14px'>{s.name}</Text>
      : <Text color='#8f9297' fontSize='14px'>{s.name}</Text>
  }

  /**
   * Mark the selected scenario as accepted.
   * Request the server to accept the snapshot.
   * Redirect to the next failing scenario.
   * @param {ScenarioObject} scenario
   */
  _acceptSnapshot (scenario) {
    const {host, port} = this.props
    const url = `//${host}:${port}/snapshots`

    postJSON(url, requestScenarioAcceptance(scenario)).then(() => {
      const scenarios = acceptScenario(this.state.scenarios, scenario)
      this.setState({scenarios})
      redirectToFirstFailingScenario(scenarios)
    })
  }

  /**
   * Request the server to send a screenshot diff of the selected scenario and dimensions.
   * Cache the screenshot when it arrives.
   * @param {ScenarioObject} scenario
   * @param {Number} screenshotSizeIndex
   */
  _requestScreenshot (scenario, screenshotSizeIndex) {
    const {host, port} = this.props
    const url = `//${host}:${port}/screenshots`
    const {before, after, screenshotSizes} = scenario.screenshotData

    const size = screenshotSizes[screenshotSizeIndex]
    this.setState({
      scenarios: changeScenarioScreenshotData(
        this.state.scenarios,
        scenario,
        () => ({selectedScreenshotSizeIndex: screenshotSizeIndex})
      )
    })

    if (
      scenario.screenshotData.savedScreenshots &&
        scenario.screenshotData.savedScreenshots[screenshotSizeIndex]
    ) {
      // Screenshot is already cached
      return null
    }

    postJSON(url, {before, after, size})
      .then((response) => {
        return response.blob()
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob) // eslint-disable-line no-undef
        const scenarios = changeScenarioScreenshotData(
          this.state.scenarios,
          scenario,
          ({savedScreenshots}) => ({
            savedScreenshots: Object.assign([], savedScreenshots, {
              [screenshotSizeIndex]: url
            })
          })
        )
        this.setState({scenarios})
      })
  }

  /**
   * Render diff of a scenario if it exists.
   * @param {ScenarioObject} scenario
   */
  _renderDiff (scenario) {
    if (scenario.hasDiff) {
      return scenario.diff
    }
  }

  /**
   * Render screenshot header and diff of the scenario.
   * @param {ScenarioObject} scenario
   */
  _renderScreenshotData (scenario) {
    const {screenshotData} = scenario

    if (!screenshotData) {
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
            Screenshots
          </span>
          {screenshotSizes.map(({alias, width, height}, index) =>
            <SmallButton
              key={index}
              onClick={() => this._requestScreenshot(scenario, index)}
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

    if (!savedScreenshots || !savedScreenshots[index]) {
      return <div className='d2h-screenshot-diff'>Loading...</div>
    }

    const {height, width} = screenshotSizes[index]

    return <div className='d2h-screenshot-diff'>
      <img style={{height, width}} src={savedScreenshots[index]} />
    </div>
  }
}

if (PropTypes) {
  MainView.propTypes = {
    data: PropTypes.array.isRequired,
    host: PropTypes.string.isRequired,
    port: PropTypes.string.isRequired,
    routeData: PropTypes.object.isRequired
  }
}

export default MainView
