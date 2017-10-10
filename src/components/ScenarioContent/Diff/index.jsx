import React from 'react'
import { getHTMLDiff, getCSSDiff } from '../../_lib/diff'

class Diff extends React.Component {
  shouldComponentUpdate (nextProps) {
    const { scenario, type } = this.props
    const { scenario: nextScenario, type: nextType } = nextProps

    return type !== nextType ||
      scenario.context !== nextScenario.context ||
      scenario.name !== nextScenario.name
  }

  render () {
    const { scenario, type } = this.props

    const diff = type === 'css'
      ? getCSSDiff(scenario)
      : getHTMLDiff(scenario)

    if (!diff) {
      return null
    }

    return <div dangerouslySetInnerHTML={{ __html: diff }} />
  }
}

export default Diff
