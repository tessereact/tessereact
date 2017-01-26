import React from 'react'
import ReactDOM from 'react-dom'
import Testshot from 'src/Testshot'

export default function init () {
  const wrapperElement = document.createElement('div')
  document.body.appendChild(wrapperElement)

  // TODO: Read from the config, set defaults as well.
  const options = {
    server: {
      host: 'localhost',
      port: '3001'
    }
  }

  ReactDOM.render(
    React.createElement(Testshot, options),
    wrapperElement
  )
}
