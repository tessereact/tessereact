import React from 'react'
import { chunk } from 'lodash'
import Navigation from '../../components/Navigation'
import { getJSON, postJSON, postJSONAndGetURL } from '../_lib/requests'
import onLoad from '../_lib/onLoad'
import {
  checkIfRouteExists,
  checkForHomeRoute,
  checkForHomeRouteDemoMode,
  redirectToFirstFailingScenario
} from '../_lib/routes'
import {
  findScenario,
  getChunksToLoad,
  acceptScenario,
  resolveScenario,
  changeScenarioScreenshotData,
  requestScenarioAcceptance,
  prepareCIReport
} from '../_lib/scenarios'
import generateTreeNodes from '../_lib/generateTreeNodes'
import {
  generateScenarioId,
  prepareStyles
} from '../_lib/styles'
import { detect } from 'detect-browser'

// react components
import Link from '../../lib/link'
import ScenarioContent from '../ScenarioContent'
import DemoContent from '../DemoContent'

// styled components
import Container from '../../styled/Container'
import Header from '../../styled/Header'
import Content from '../../styled/Content'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'
import ScenarioBlockHeader from '../../styled/ScenarioBlockHeader'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

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
      scenarios: props.data,
      cssLoaded: false
    }
  }

  /**
   * Load snapshot diffs from the server
   */
  componentWillMount () {
    const { routeData } = this.props
    const url = `//${this.props.host}:${this.props.port}/read-snapshots`

    const startDate = Date.now()

    onLoad()
      .then(() => {
        // Get config from server if not supplied via ejs
        if (!window.__tessereactConfig) {
          return getJSON(`//${this.props.host}:${this.props.port}/config`)
            .then(config => {
              window.__tessereactConfig = config
            })
        }
      })
      .then(() => {
        const styles = prepareStyles(document.styleSheets)

        const chunksToLoad = getChunksToLoad(routeData, this.state.scenarios, SCENARIO_CHUNK_SIZE || Infinity)
          .map(chunk =>
            chunk.map(scenario => {
              return {
                name: scenario.name,
                context: scenario.context,
                options: scenario.options
              }
            })
          )

        return Promise.all(
          chunksToLoad.map(scenariosChunk =>
            postJSON(url, { scenarios: scenariosChunk })
              .then(({scenarios: responseScenarios}) => {
                const newScenarios = responseScenarios.reduce((acc, s) => resolveScenario(acc, s, styles), this.state.scenarios)
                this.setState({scenarios: newScenarios})
              })
              .catch(e => console.log('Snapshot server is not available!', e))
          )
        )
      })
      .then(() => {
        const { scenarios } = this.state

        this.setState({cssLoaded: true})

        console.log(`Finished loading in ${Date.now() - startDate}`)

        if (window.__tessereactDemoMode) {
          checkForHomeRouteDemoMode(routeData)
        } else {
          checkForHomeRoute(routeData, scenarios)
          checkIfRouteExists(routeData, scenarios)
        }

        // Report to CI
        if (window.__tessereactWSURL) {
          const ws = new window.WebSocket(window.__tessereactWSURL)
          ws.addEventListener('open', () => {
            ws.send(JSON.stringify(prepareCIReport(scenarios)))
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
        {this._renderFetchCSS()}
        <Navigation
          loadedScenariosCount={scenarios.filter(c => c.status === 'resolved').length}
          failedScenariosCount={scenarios.filter(c => c.hasDiff).length}
          scenariosCount={scenarios.length}
          nodes={generateTreeNodes(scenarios.filter(c => c.status === 'resolved'))}
          selectedRoute={{context, scenario, name: routeName}}
        />
        <Content>
          {routeName === 'context' && this._renderContext(context)}
          {routeName === 'scenario' && this._renderScenario(findScenario(scenarios, context, scenario))}
          {routeName === 'demo' && <DemoContent />}
        </Content>
      </Container>
    )
  }

  /**
   * Render UI element, which contains all of the scenarios with option `css`=true.
   * From it we will fetch the css snapshots
   */
  _renderFetchCSS () {
    if (this.state.cssLoaded) {
      return null
    }

    const scenarios = this.props.data.filter(({options: {css}}) => css)
    return <div style={{display: 'none'}}>
      {
        scenarios.map((scenario, index) =>
          <div
            id={generateScenarioId(scenario)}
            key={index}
            dangerouslySetInnerHTML={{ __html: scenario.getSnapshot() }}
          />)
      }
    </div>
  }

  /**
   * Render UI element, which contains header, scenario and diffs.
   * Represents selected scenario.
   * @param {ScenarioObject} scenario
   */
  _renderScenario (scenario) {
    return <ScenarioContent
      scenario={scenario}
      onAcceptSnapshot={() => this._acceptSnapshot(scenario)}
      onRequestScreenshot={(sizeIndex) => this._requestScreenshot(scenario, sizeIndex)}
    />
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
        {scenarios.map(s => {
          const params = {context: s.context || 'null', scenario: s.name}
          return <ScenarioBlock key={s.name}>
            <Link
              name='scenario'
              params={params}
              component={(props) =>
                <ScenarioBlockHeader hasDiff={s.hasDiff} {...props} />
              }
            >
              {s.name}
            </Link>
            <Link name='scenario' params={params} component='div'>
              <ScenarioBlockContent key={s.name}>
                {s.snapshot ? <div dangerouslySetInnerHTML={{__html: s.snapshot}} /> : <div>Loading...</div>}
              </ScenarioBlockContent>
            </Link>
          </ScenarioBlock>
        })}
      </ComponentPreview>
    </Content.Wrapper>
  }

  /**
   * Mark the selected scenario as accepted.
   * Request the server to accept the snapshot.
   * Redirect to the next failing scenario.
   * @param {ScenarioObject} scenario
   */
  _acceptSnapshot (scenario) {
    const {host, port} = this.props
    const url = `//${host}:${port}/write-snapshot`

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
    const url = `//${host}:${port}/screenshot`
    const {name, context} = scenario
    const {before, after, screenshotSizes, savedScreenshots} = scenario.screenshotData

    const screenshotIsAlreadyCached = savedScreenshots && savedScreenshots[screenshotSizeIndex]

    const size = screenshotSizes[screenshotSizeIndex]
    this.setState({
      scenarios: changeScenarioScreenshotData(
        this.state.scenarios,
        scenario,
        ({selectedScreenshotSizeIndex, savedScreenshots}) => ({
          selectedScreenshotSizeIndex: selectedScreenshotSizeIndex === screenshotSizeIndex
            ? null
            : screenshotSizeIndex,
          savedScreenshots: screenshotIsAlreadyCached
            ? savedScreenshots
            : Object.assign({}, savedScreenshots, {
              [screenshotSizeIndex]: {
                status: 'loading'
              }
            })
        })
      )
    })

    if (screenshotIsAlreadyCached) {
      return null
    }

    postJSONAndGetURL(url, {name, context, before, after, size, sizeIndex: screenshotSizeIndex})
      .then((url) => {
        const scenarios = changeScenarioScreenshotData(
          this.state.scenarios,
          scenario,
          ({savedScreenshots}) => ({
            savedScreenshots: Object.assign([], savedScreenshots, {
              [screenshotSizeIndex]: {
                status: 'cached',
                url
              }
            })
          })
        )
        this.setState({scenarios})
      })
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
