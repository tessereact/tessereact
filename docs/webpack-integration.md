# How to integrate Tessereact with Webpack

In this tutorial we are going to integrate Tessereact with webpack,
using an app created by [create-react-app](https://github.com/facebookincubator/create-react-app).

## Let's bootstrap an application

NOTE: Skip this step if you are integrating Tessereact with your own Webpack application.

Install `create-react-app` if you did not do that already:

```sh
npm install -g create-react-app
```

Run `create-react-app` global script in console to bootstrap the application:

```sh
create-react-app react-app
cd react-app
```

### `yarn eject`

By default all configs of `create-react-app` are hidden, including Webpack config.
We need to get access to those config files and have them directly in our appliction.
Luckily `create-react-app` provides a command for that called `eject`.

```sh
yarn eject
```

To integrate your app without ejecting, check [create-react-app integration guide](../create-react-app-integration.md)

## Actual Integration

You can have a look on this [commit](https://github.com/tessereact/tessereact/commit/118575ba8a5e95530b2fe5f169fc69131e22addd) or continue reading this document.

### 1. Add Tessereact to your project

```sh
yarn add -D tessereact
```

### 2. Create Tessereact folder

```sh
mkdir tessereact
```

First we need to add Tessereact HTML template

```sh
touch tessereact/template.ejs
```

with following content:

```html
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

Second, we need to create Tessereact initialization script:

```sh
touch tessereact/init.js
```

with following content:

```js
// Path to CSS of your application
require('../src/index.css')

const Tessereact = require('tessereact')

const scenariosContext = require.context('../src', true, /\/scenarios\.jsx?$/)
scenariosContext.keys().forEach(scenariosContext)

Tessereact.init({className: 'tessereact'})
```

This file imports all styles and scenarios which will be running inside Tessereact,
and also runs Tessereact itself.

### 3. Add Tessereact config

Add Tessereact config

```sh
touch tessereact.config.json
```

with following content:

```json
{
  "port": 5001,
  "snapshotsPath": "snapshots",
  "entryURL": "http://localhost:5000/static/js/init.js",
  "templatePath": "tessereact/template.ejs"
}
```

[Look here](config.md) for all available configuration options.

### 4. Create Webpack Tessereact config

We need to create a separate Webpack config for Tessereact.
Having a separate config for Tessereact you will be able to customize
it in any way you need, mock different libraries in Tessereact environment and so on.
Let's copy it from the development one:

```sh
cp config/webpack.config.dev.js config/webpack.config.tessereact.js
```

Open `config/webpack.config.tessereact.js`

- Change `output.filename` to `'static/js/tessereact.js'`.
- Replace `paths.appIndexJs` with `path.resolve(process.cwd(), './tessereact/init.js')`.

By that, we changed output script to the one listed in `tessereact.config.json` as `"entryURL"`,
and also replaced the app's entry point, with Tessereact's one.

### 5. Add package.json scripts

Add following scripts to `package.json`:

```js
{
  // ...
  "scripts": {
    // ...
    "tessereact-webpack": "NODE_ENV='development' webpack-dev-server --config ./config/webpack.config.tessereact.js --port 5000",
    "tessereact-server": "tessereact-server"
  }
}
```

`"tessereact-webpack"` builds the front-end of Tessereact, and "`tessereact-server`" runs the back-end.

### Run

Run Tessereact webpack server

```sh
yarn tessereact-webpack
```

Run Tessereact server

```sh
yarn tessereact-server
```

Open Tessereact

```sh
open localhost:5001
```

If you see Tessereact welcome screen then it's time to [add your first Tessereact scenario].
In case you have some issue with integration or some ideas how to improve this process feel free to [open an issue].

This integration does look a little bit verbose, but it provides you full flexibility and understanding of what is going on under the hood.
