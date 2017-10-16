# How to integrate Tessereact with Webpack

In this tutorial we are going to integrate Tessereact with [create-react-app](https://github.com/facebookincubator/create-react-app) what uses Webpack.

## Let's bootstrap an application

NOTE: Skip this step if you are integrating Tessereact with your own Webpack application.

```
create-react-app react-app
cd react-app
```

### `yarn eject`

By default all configs of `create-react-app` are hidden, including Webpack config.
We need to get access to those config files and have them directly in our appliction.
Luckily `create-react-app` provides command for that called `eject`.

`yarn eject`

## Actual Integration

You can have a look on this [commit](https://github.com/tessereact/tessereact/commit/118575ba8a5e95530b2fe5f169fc69131e22addd) or continue reading this document.

### 1. Add Tessereact to your project

`yarn add -D tessereact`

### 2. Create Tessereact folder

`mkdir tessereact`

First we need to add Tessereact HTML template

`touch tessereact/template.ejs`

with following content:

```
<!doctype html>
<html>
  <head>
    <title>Tessereact</title>
  </head>
  <body>
    <script>
      window.__tessereactWSURL = "<%= wsURL %>"
      window.__tessereactServerPort = <%= tessereactServerPort %>
      window.__tessereactConfig = <%- config %>
    </script>
    <script src="<%= entryPath %>"></script>
  </body>
</html>

```

Second, we need to create Tessereact initialization script

`touch tessereact/init.js`

with following content

```
// Path to CSS of your application
require('../src/index.css')

const Tessereact = require('tessereact')

const scenariosContext = require.context('../src', true, /\/scenarios\.jsx?$/)
scenariosContext.keys().forEach(scenariosContext)

Tessereact.init({className: 'tessereact'})
```


### 3. Create Webpack Tessereact config

Let's add path to Tessereact init file:

Open `config/paths.js`

Add following line to `module.exports`

```
tessereact: resolveApp('tessereact/init.js'),
```

We need to create a separate Webpack config for Tessereact.
Having a separate config for Tessereact you will be able to customize
it in any way you need, mock different libraries in Tessereact environment and so on.
Let's copy it from the development one:

`cp config/webpack.config.dev.js config/webpack.config.tessereact.js`

Open `config/webpack.config.tessereact.js`

- Change `output.filename` to `'static/js/tessereact.js'`.
- Replace `paths.appIndexJs` with `paths.tessereact`.

### 4. Add Tessereact config

Add Tessereact config

`touch tessereact.config.json`

with following content

```
{
  "port": 5001,
  "snapshotsPath": "snapshots",
  "entryURL": "http://localhost:5000/static/js/init.js",
  "templatePath": "tessereact/template.ejs",
  "chromedriverPort": 5003
}
```

[Take a look here](config.md) for all available configuration options

5. Add following scripts to `package.json`:

```
"scripts": {
  "tessereact-webpack": "NODE_ENV='development' webpack-dev-server --config ./config/webpack.config.tessereact.js --port 5000",
  "tessereact-server": "tessereact-server"
}
```

### Run

Run Tessereact webpack server

`yarn tessereact-webpack`

Run Tessereact server

`yarn tessereact-server`

Open Tessereact

`open localhost:5001`

If you see Tessereact welcome screen then it's time to [add your first Tessereact scenario].
In case you have some issue with integration or some ideas how to improve this process feel free to [open an issue].

This integration does look a little bit verbose, but it provides you full flexibility and understanding of what is going on under the hood.
