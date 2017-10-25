import React from 'react'
import queryString from 'qs'
import Navigation from '../../components/Navigation'
import { getJSON, postJSON, postJSONAndGetURL } from '../_lib/requests'
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
      scenarios: props.data
    }
  }

  /**
   * Load snapshot diffs from the server
   */
  componentWillMount () {
    let css
    const { routeData } = this.props
    const url = `//${this.props.host}:${this.props.port}/api/read-snapshots`

    const startDate = Date.now()

    Promise
      .all([
        // Get config from server
        window.__tessereactConfig
          ? Promise.resolve(null)
          : getJSON(`//${this.props.host}:${this.props.port}/api/config`)
            .then(config => { window.__tessereactConfig = config }),

        // Get CSS from server
        this.props.data.some(({options: {css}}) => css)
          ? getJSON(`//${this.props.host}:${this.props.port}/api/css`)
            .then(({ scenarios }) => { css = scenarios })
          : Promise.resolve(null)
      ])
      .then(() => {
        const chunksToLoad = getChunksToLoad(routeData, this.state.scenarios, SCENARIO_CHUNK_SIZE || Infinity)
          .map(chunk =>
            chunk.map(scenario => ({
              name: scenario.name,
              context: scenario.context,
              options: scenario.options
            }))
          )

        // Get old snapshots from server
        return Promise.all(
          chunksToLoad.map(scenariosChunk =>
            postJSON(url, { scenarios: scenariosChunk })
              .then(({ scenarios: responseScenarios }) => {
                const newScenarios = responseScenarios.reduce(
                  (acc, s) => resolveScenario(acc, s, css),
                  this.state.scenarios
                )
                this.setState({scenarios: newScenarios})
              })
              .catch(e => console.log('Snapshot server is not available!', e))
          )
        )
      })
      .then(() => {
        const { scenarios } = this.state

        console.log(`Finished loading in ${Date.now() - startDate}`)

        const search = window.location.search.slice(1)
        const { wsPort } = queryString.parse(search)
        // Report to CI
        if (wsPort) {
          const ws = new window.WebSocket(`ws://localhost:${wsPort}`)
          ws.addEventListener('open', () => {
            ws.send(JSON.stringify(prepareCIReport(scenarios)))
          })
        } else {
          if (window.__tessereactDemoMode) {
            checkForHomeRouteDemoMode(routeData)
          } else {
            checkForHomeRoute(routeData, scenarios)
          }
          checkIfRouteExists(routeData, scenarios)
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
          selectedRoute={{context, scenario, name: routeName}}
        />
        <Content>
          {routeName === 'context' && this._renderContext(context)}
          {routeName === 'scenario' && this._renderScenario(findScenario(scenarios, context, scenario))}
          {routeName === 'demo' && <DemoContent />}
        </Content>
        {window.__tessereactDemoMode && window.__tessereactDemoMode.ribbon}
      </Container>
    )
  }

  /**
   * Render UI element, which contains header, scenario and diffs.
   * Represents selected scenario.
   * @param {ScenarioObject} scenario
   */
  _renderScenario (scenario) {
    const {
      params: { context, scenario: name }
    } = this.props.routeData

    return <ScenarioContent
      scenario={scenario || { name, context }}
      onAcceptSnapshot={scenario ? () => this._acceptSnapshot(scenario) : null}
      onRequestScreenshot={scenario ? (sizeIndex) => this._requestScreenshot(scenario, sizeIndex) : null}
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
    const url = `//${host}:${port}/api/write-snapshot`

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
    const url = `//${host}:${port}/api/screenshot`
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
