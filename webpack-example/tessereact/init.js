require('../src/index.css')

const Tessereact = require('tessereact')

const scenariosContext = require.context('../src', true, /\/scenarios\.jsx?$/)
scenariosContext.keys().forEach(scenariosContext)

Tessereact.init({className: 'tessereact'})
