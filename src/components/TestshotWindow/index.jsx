import React, {PropTypes} from 'react'
import { find, chunk } from 'lodash'
import Navigation from '../../components/Navigation'
import {postJSON} from '../../lib/fetch'
import {
  asyncEach,
  acceptCurrentScenario,
  requestScenarioAcceptance,
  generateTreeNodes,
  resolveScenario,
  shiftCurrentScenario,
  shiftCurrentContext,
  toArray,
  onLoad
} from './helpers'
import History from '../../lib/router/history'

// styled components
import TestshotContainer from '../../styled/TestshotContainer'
import Header from '../../styled/Header'
import TestshotContent from '../../styled/TestshotContent'
import ComponentPreview from '../../styled/ComponentPreview'
import ScenarioBlock from '../../styled/ScenarioBlock'
import ScenarioBlockContent from '../../styled/ScenarioBlockContent'
import AcceptButton from '../../styled/AcceptButton'
import Button from '../../styled/Button'
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
        const styles = toArray(document.styleSheets)
          .reduce(
            (array, {rules}) =>
              array.concat(
                toArray(rules)
                  .map(rule => {
                    if (rule instanceof CSSMediaRule) {
                      return {
                        type: 'media',
                        selectorText: `@media ${rule.conditionText}`,
                        cssText: rule.cssText,
                        rules: toArray(rule.cssRules)
                          .map(({selectorText, cssText}) => ({selectorText, cssText}))
                      }
                    }

                    return {
                      selectorText: rule.selectorText,
                      cssText: rule.cssText
                    }
                  })
              ),
            []
          )

        const scenariosToLoad = this._scenariosToLoad()
          .map(scenario => ({
            name: scenario.name,
            context: scenario.context,
            snapshot: scenario.getSnapshot(),
            diffCSS: scenario.diffCSS
          }))

        const chunks = chunk(scenariosToLoad, SCENARIO_CHUNK_SIZE || Infinity)

        return Promise.all(
          chunks.map(scenarios =>
            postJSON(url, { scenarios, styles })
              .then(response => response.json())
              .then(({scenarios}) => this.setState({scenarios: scenarios.reduce(resolveScenario, this.state.scenarios)}))
              .catch(e => console.log('Snapshot server is not available!', e))
          )
        )
      })
      .then(() => {
        if (routeData.route.name === 'home') {
          this._redirectFromHomeToFirstFailingScenario()
        }
        this._checkForHomeRoute(this.props)
        this._checkIfRouteExists(this.props)

        // Report to CI
        const failingScenarios = this.state.scenarios
          .filter(({hasDiff}) => hasDiff)
          .map(({context, name}) => ({context, name}))

        if (window.__testshotWSURL) {
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
    this._checkForHomeRoute(nextProps)
  },

  _checkIfRouteExists (props) {
    const {context, scenario, routeName} = this.getRouteData(props)
    switch (routeName) {
      case 'scenario':
        !this._findScenario(context, scenario) &&
          History.push(`/contexts/${context}`)
        break
      case 'context':
        !this.state.scenarios.find((s) => { return s.context === context }) &&
          History.push('/')
        break
      case 'home':
        break
      default:
        History.push('/')
    }
  },

  _checkForHomeRoute (props) {
    const routeName = props.routeData.route.name
    const {scenarios} = this.state

    if (routeName === 'home') {
      let scenario = find(scenarios, (s) => { return s.hasDiff }) || scenarios[0]
      History.push(`/contexts/${scenario.context}/scenarios/${scenario.name}`)
    }
  },

  _scenariosToLoad () {
    const {
      routeData: {
        params: { context: contextName, scenario: name },
        route: { name: routeName }
      }
    } = this.props
    const { scenarios } = this.state
    const context = contextName === 'null' ? null : contextName
    if (routeName === 'scenario') {
      return shiftCurrentScenario(scenarios, { name, context })
    } else if (routeName === 'context') {
      return shiftCurrentContext(scenarios, { context })
    } else {
      return scenarios
    }
  },

  _areScenariosAvailable () {
    return this.state.scenarios[0].hasOwnProperty('hasDiff')
  },

  _redirectFromHomeToFirstScenario (routeName) {
    const { scenarios } = this.state
    const scenario = scenarios[0]
    this._redirectToScenario(scenario)
  },

  _redirectFromHomeToFirstFailingScenario () {
    const { scenarios } = this.state
    const scenario = find(scenarios, s => s.hasDiff)

    if (!scenario) {
      return this._redirectFromHomeToFirstScenario()
    }

    this._redirectToScenario(scenario)
  },

  _redirectToScenario (scenario) {
    const { context, name } = scenario
    scenario && History.push(`/contexts/${context}/scenarios/${name}`)
  },

  getRouteData (props) {
    const {
      routeData: {
        params: {
          context,
          scenario
        },
        route: {
          name: routeName
        }
      }
    } = props
    return {context, scenario, routeName}
  },

  render () {
    const {context, scenario, routeName} = this.getRouteData(this.props)
    const {scenarios} = this.state

    return (
      <TestshotContainer>
        <Navigation
          loadedScenariosCount={scenarios.filter(c => c.status === 'resolved').length}
          failedScenariosCount={scenarios.filter(c => c.hasDiff).length}
          scenariosCount={scenarios.length}
          nodes={generateTreeNodes(scenarios.filter(c => c.status === 'resolved'))}
        />
        {this._areScenariosAvailable && <TestshotContent>
          {routeName === 'context' && this._renderContext(context)}
          {routeName === 'scenario' && this._renderScenario(this._findScenario(context, scenario))}
        </TestshotContent>}
      </TestshotContainer>
    )
  },

  _findScenario (contextName, scenarioName) {
    return find(this.state.scenarios, s => {
      if (contextName !== 'null') {
        return s.name === scenarioName && s.context === contextName
      } else {
        return s.name === scenarioName && !s.context
      }
    })
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
          {scenario.hasDiff && <AcceptButton onClick={_ => this._acceptSnapshot(scenario)}>Accept & next</AcceptButton>}
        </div>
      </Header>
      <ComponentPreview>
        {scenario.element}
      </ComponentPreview>
      <div dangerouslySetInnerHTML={{ __html: this._renderDiff(scenario) }} />
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

    postJSON(url, requestScenarioAcceptance(scenario)).then(_ => {
      this.setState(acceptCurrentScenario(this.state, scenario))
      this._redirectFromHomeToFirstFailingScenario()
    })
  },

  _renderDiff (scenario) {
    if (scenario.hasDiff) {
      return this._computeDiff(scenario)
    }
  },

  _computeDiff (scenario) {
    const { diff } = scenario
    return diff
  }
})

export default TestshotWindow
