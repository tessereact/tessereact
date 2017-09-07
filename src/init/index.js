import React from 'react'
import ReactDOM from 'react-dom'
import TestshotComponent from '../Testshot'
import routes from '../routes'

export default function init (userOptions = {}) {
  const options = Object.assign({
    server: {
      host: 'localhost',
      port: window.__tessereactServerPort ? String(window.__tessereactServerPort) : '5001'
    }
  }, userOptions)
  const wrapperElement = document.createElement('div')

  if (userOptions.className) {
    wrapperElement.classList.add(userOptions.className)
  }
  document.body.appendChild(wrapperElement)

  routes.start((routeData) => {
    ReactDOM.render(
      React.createElement(TestshotComponent, Object.assign({}, options, {routeData})),
      wrapperElement
    )
  })
}
