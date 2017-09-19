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

// react components
import ScenarioContent from '../ScenarioContent'

// styled components
import Container from '../../styled/Container'
import Header from '../../styled/Header'
import Content from '../../styled/Content'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'
import Text from '../../styled/Text'

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
          selectedRoute={{context, scenario}}
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

    const screenshotIsAlreadyCached = scenario.screenshotData.savedScreenshots &&
      scenario.screenshotData.savedScreenshots[screenshotSizeIndex]

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
            : Object.assign({
              [screenshotSizeIndex]: 'loading'
            })
        })
      )
    })

    if (screenshotIsAlreadyCached) {
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
