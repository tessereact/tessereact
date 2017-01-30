import React from 'react'
import ReactDOM from 'react-dom'
import TestshotComponent from '../Testshot'

export default function init (userOptions = {}) {
  const options = Object.assign({
    server: {
      host: 'localhost',
      port: '5001'
    }
  }, userOptions)

  const wrapperElement = document.createElement('div')
  if (options.className) {
    wrapperElement.classList.add(options.className)
  }
  document.body.appendChild(wrapperElement)

  ReactDOM.render(
    React.createElement(TestshotComponent, options),
    wrapperElement
  )
}
