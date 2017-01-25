// XXX: Main entry point
// Exposes public methods of the application
import React from 'react'
import ReactDOM from 'react-dom'
import Testshot, {scenario as testshotScenario} from 'src/Testshot'

export const init = () => {
  const wrapperElement = document.createElement('div')
  document.body.appendChild(wrapperElement)

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

export const scenario = testshotScenario
