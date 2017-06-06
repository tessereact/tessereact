# Testshot

Presentational snapshot testing for React components.

![Screenshot](https://d2ppvlu71ri8gs.cloudfront.net/items/1G231j0K2e0l45011G11/Image%202017-05-28%20at%2012.21.33%20PM.png)

[More Screenshots](https://github.com/toptal/testshot/blob/master/docs/sceenshots.md)

## Demo & Examples

### Basic example

To build the basic example locally, run:

```
yarn install
yarn dev
yarn dev-server
```

Then open [`localhost:5000`](http://localhost:5000) in a browser.

### create-react-app example

```
cd create-react-app-example
yarn start-testshot
```

## Installation

```
yarn add toptal/testshot
```

[Configuring Webpack](docs/integration.md)

## Basic Usage

For the complete usage guide take a look [here](docs/usage.md).

``` js
import React from 'react'
import {context, scenario} from 'testshot'
import Text from '.'

context('Text', () => {
  scenario('Default', () => (
    <Text>Text</Text>
  ))

  scenario('Purple', () => (
    <Text color='purple'>Purple text</Text>
  ))
})
```

## Contributors

[See here](https://github.com/toptal/testshot/graphs/contributors)

Special thanks to:
  - Team Portal Toptal Team
  - [Aleksandar Djuric](https://dribbble.com/mnmalt)
  - [Nadya Tsech](https://twitter.com/n_tsech)
  - [Sasha Koss](https://github.com/kossnocorp)
