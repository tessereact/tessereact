# Testshot

Presentational snapshot testing for React components.

[![npm version](https://badge.fury.io/js/%40toptal%2Ftestshot.svg)](https://badge.fury.io/js/%40toptal%2Ftestshot) [![Gitter](https://img.shields.io/badge/gitter-join_chat-1dce73.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIwIiB5PSI1IiBmaWxsPSIjZmZmIiB3aWR0aD0iMSIgaGVpZ2h0PSI1Ii8%2BPHJlY3QgeD0iMiIgeT0iNiIgZmlsbD0iI2ZmZiIgd2lkdGg9IjEiIGhlaWdodD0iNyIvPjxyZWN0IHg9IjQiIHk9IjYiIGZpbGw9IiNmZmYiIHdpZHRoPSIxIiBoZWlnaHQ9IjciLz48cmVjdCB4PSI2IiB5PSI2IiBmaWxsPSIjZmZmIiB3aWR0aD0iMSIgaGVpZ2h0PSI0Ii8%2BPC9zdmc%2B&logoWidth=8)](https://gitter.im/Testshot/Lobby?source=orgpage)

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

[See here](https://github.com/toptal/testshot/graphs/contributors)

Special thanks to:
  - Team Portal Toptal Team
  - [Aleksandar Djuric](https://dribbble.com/mnmalt)
  - [Nadya Tsech](https://twitter.com/n_tsech)
  - [Sasha Koss](https://github.com/kossnocorp)
