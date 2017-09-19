import React from 'react'

class ScenarioFrame extends React.Component {
  constructor (props, componentContext) {
    super(props, componentContext)
    const {context, name} = props
    this.url = `/contexts/${context}/scenarios/${name}/view`
  }

  componentDidUpdate () {
    const {context, name} = this.props
    this.iframe.contentWindow.postMessage({context: context || 'null', scenario: name}, '*')
  }

  render () {
    const {className} = this.props

    return <iframe
      src={this.url}
      className={className}
      ref={iframe => this.iframe = iframe}
    />
  }
}

export default ScenarioFrame
