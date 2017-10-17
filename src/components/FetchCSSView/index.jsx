import React from 'react'
import queryString from 'qs'
import onLoad from '../_lib/onLoad'
import {
  generateScenarioId,
  prepareStyles,
  buildSnapshotCSS
} from '../_lib/styles'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Component which renders all scenarios with styles needed to be fetched.
 * Also fetches them.
 * @extends React.Component
 * @property {Array<ScenarioObject>} props.data - list of scenarios created by user
 */
class FetchCSSView extends React.Component {
  componentWillMount () {
    onLoad()
      .then(() => {
        const styles = prepareStyles(document.styleSheets)
        const scenariosToFetch = this.props.data.filter(({options: {css}}) => css)
        const scenarios = scenariosToFetch.map((scenario) => ({
          name: scenario.name,
          context: scenario.context,
          snapshotCSS: buildSnapshotCSS(
            styles,
            document.getElementById(generateScenarioId(scenario)),
            document.documentElement,
            document.body
          )
        }))

        const search = window.location.search.slice(1)
        const { wsPort } = queryString.parse(search)
        if (wsPort) {
          const ws = new window.WebSocket(`ws://localhost:${wsPort}`)
          ws.addEventListener('open', () => {
            ws.send(JSON.stringify({ scenarios }))
          })
        }
      })
  }

  render () {
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
}

if (PropTypes) {
  FetchCSSView.propTypes = {
    data: PropTypes.array.isRequired
  }
}

export default FetchCSSView
