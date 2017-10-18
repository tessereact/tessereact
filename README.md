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
yarn start-tessereact
```

## Installation

```
yarn add -D https://github.com/tessereact/tessereact.git
```

See [Webpack integration guide](docs/webpack-integration.md)
or [create-react-app integration guide](docs/create-react-app-integration.md)
for the subsequent installation instructions.

## Basic Usage

For the complete usage guide take a look [here](docs/usage.md).

``` js
import React from 'react'
import {context, scenario} from 'tessereact'
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

## CI Support

Tessereact provides build in CI script

```
yarn tessereact-ci
```

## Authors

- [Lesha Koss](https://github.com/LeshaKoss)
- [Eduard Tsech](https://github.com/edtsech)

## Contributors

[Tessereact contributors](https://github.com/tessereact/tessereact/graphs/contributors)

Special thanks to Testshot contributors:
  - [Aleksandar Djuric](https://dribbble.com/mnmalt)
  - [Nadya Tsech](https://twitter.com/n_tsech)
  - [Sasha Koss](https://github.com/kossnocorp)
