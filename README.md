# Tessereact

Presentational snapshot testing for React components. 

Tessereact is ![Testshot](https://github.com/toptal/testshot) fork which supports CSS and screen snapshots based on resolutions you choose.

![Screenshot](https://github.com/toptal/testshot/blob/master/docs/images/failing_context.png?raw=true)

[Check usage guide for more screenshots](docs/usage.md).

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
yarn add @toptal/testshot
```

[Configuring Webpack](docs/integration.md)

## Basic Usage

For the complete usage guide take a look [here](docs/usage.md).

``` js
import React from 'react'
import {context, scenario} from '@toptal/testshot'
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

[See here](https://github.com/toptal/tessereact/graphs/contributors)

Special thanks to:
  - Team Portal Toptal Team
  - [Aleksandar Djuric](https://dribbble.com/mnmalt)
  - [Nadya Tsech](https://twitter.com/n_tsech)
  - [Sasha Koss](https://github.com/kossnocorp)
