const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

const env = process.env.NODE_ENV
const isDevelopment = env === 'development'
const isProduction = env === 'production'

const entry = {
  app: ['./src/index']
}

if (isDevelopment) {
  entry.dev = [
    './example/index',
    'webpack-hot-middleware/client'
  ]
}

const plugins = []

if (isDevelopment) {
  plugins.push(new webpack.HotModuleReplacementPlugin())
  plugins.push(new webpack.NoErrorsPlugin())
}

// TODO: Check if it makes sense to build 2 versions:
// Minified and not minified. Or think about sourcemaps.
if (isProduction) {
  plugins.push(new webpack.optimize.DedupePlugin())
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {warnings: false},
    comments: false
  }))
}

module.exports = {
  entry,
  plugins,
  output: {
    path: path.join(process.cwd(), 'dist'),
    publicPath: '/assets/',
    filename: '[name].js',
    library: 'testshot',
    libraryTarget: 'umd'
  },
  resolve: {
    root: process.cwd(),
    extensions: ['', '.js', '.json', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css?sourceMap!postcss'
      },
      {
        test: /\.sass$/,
        loader: 'style!css?sourceMap!postcss!sass?sourceMap&indentedSyntax'
      }
    ]
  },
  postcss () {
    return [autoprefixer]
  },
  externals: {
    'react/lib/ReactContext': true,
    'react/lib/ExecutionEnvironment': true,
    'react/addons': true
  },
  devServer: {
    stats: 'errors-only'
  }
}
