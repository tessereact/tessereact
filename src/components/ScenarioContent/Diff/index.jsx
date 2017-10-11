import React from 'react'
import { getHTMLDiff, getCSSDiff } from '../../_lib/diff'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Renders diff of a scenario.
 * @extends React.Component
 * @property {ScenarioObject} props.scenario
 * @property {'html'|'css'} props.type
 * @property {Boolean} [props.sideBySide]
 */
class Diff extends React.Component {
  shouldComponentUpdate (nextProps) {
    const { scenario, type } = this.props
    const { scenario: nextScenario, type: nextType } = nextProps

    return type !== nextType ||
      scenario.context !== nextScenario.context ||
      scenario.name !== nextScenario.name
  }

  render () {
    const { scenario, type, sideBySide } = this.props

    const options = { sideBySide }

    const diff = type === 'css'
      ? getCSSDiff(scenario, options)
      : getHTMLDiff(scenario, options)

    if (!diff) {
      return null
    }

    return <div dangerouslySetInnerHTML={{ __html: diff }} />
  }
}

if (PropTypes) {
  Diff.propTypes = {
    scenario: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    sideBySide: PropTypes.bool
  }
}

export default Diff
