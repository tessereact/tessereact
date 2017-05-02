require('../src/index.css')

const Testshot = require('testshot')

const scenariosContext = require.context('../src', true, /\/scenarios\.jsx?$/)
scenariosContext.keys().forEach(scenariosContext)

Testshot.init({className: 'testshot'})
