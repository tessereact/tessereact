const express = require('express')
const path = require('path')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')

const app = express()
const compiler = webpack(webpackConfig)
const port = process.env.PORT || 5000

app.use(express.static(path.join(process.cwd(), 'assets')))

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))

app.set('view engine', 'ejs')
app.set('views', path.join(process.cwd(), 'example'))

app.get('*', (req, res) => {
  res.render('index')
})

app.listen(port, '0.0.0.0', err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Listening at http://localhost:${port}`)
})
