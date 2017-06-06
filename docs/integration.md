# How to integrate Testshot with Webpack

In this tutorial we are going to integrate Testshot with [create-react-app](https://github.com/facebookincubator/create-react-app) what uses Webpack.

## Let's bootstrap an application

NOTE: Skip this step if you are integrating Testshot with your own Webpack application.

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

You can have a look on this [commit](https://github.com/toptal/testshot/commit/118575ba8a5e95530b2fe5f169fc69131e22addd) or continue reading this document.

### 1. Add Testshot to your project

`yarn add toptal/testshot`

### 2. Create Testshot folder

`mkdir testshot`

First we need to add Testshot HTML template

`touch testshot/template.ejs`

with following content:

```
<!doctype html>
<html>
  <head>
    <title>Testshot</title>
  </head>
  <body>
    <script type="text/javascript">
      // Web Socket URL for communication with CI
      window.__testshotWSURL = "<%= wsURL %>"
    </script>
    <script type="text/javascript" src="<%= entryPath %>"></script>
  </body>
</html>
```

Second, we need to create Testshot initialization script

`touch testshot/init.js`

with following content

```
// Path to CSS of your application
require('../src/index.css')

const Testshot = require('testshot')

const scenariosContext = require.context('../src', true, /\/scenarios\.jsx?$/)
scenariosContext.keys().forEach(scenariosContext)

Testshot.init({className: 'testshot'})
```


### 3. Create Webpack Testshot config

Let's add path to Testshot init file:

Open `config/paths.js`

Add following line to `module.exports`

```
testshot: resolveApp('testshot/init.js'),
```

We need to create a separate Webpack config for Testshot.
Having a separate config for Testshot you will be able to customize
it in any way you need, mock different libraries in Testshot environment and so on.
Let's copy it from the development one:

`cp config/webpack.config.dev.js config/webpack.config.testshot.js`

Open `config/webpack.config.testshot.js`

- Change `output.filename` to `static/js/testshot.js`.
- Replace `paths.appIndexJs` with `paths.testshot`.

### 4. Adjust starting script of your app

Open `scripts/start.js`

Change config variable like that:

`const config = require(process.env.TESTSHOT ? '../config/webpack.config.testshot' : '../config/webpack.config.dev');`

### 5. Add Testshot config

Add Testshot config

`touch testshot.config.json`

with following content

```
{
  "port": 5001,
  "snapshots_path": "snapshots",
  "entry_url": "http://localhost:5000/assets/js/init.js",
  "template_path": "testshot/template.ejs"
}
```

[Take a look here](config.md) for all available configuration options

### Run

Run your app

`TESTSHOT=true PORT=5000 yarn start`

Run Testshot

`yarn testshot-server`

Open Testshot

`open localhost:5001`

If you see Testshot welcome screen then it's time to [add your first Testshot scenario].
In case you have some issue with integration or some ideas how to improve this process feel free to [open an issue].

This integration does look a little bit verbose, but it provides you full flexibility and understanding of what is going on under the hood.
