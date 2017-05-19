# Testshot

Experimental snapshot testing for React components.

[Some screenshots](https://github.com/toptal/testshot/blob/master/docs/sceenshots.md)

## Demo & Examples

### Basic example

To build the basic example locally, run:

```
yarn install
yarn run dev
yarn run dev-server
```

Then open [`localhost:5000`](http://localhost:5000) in a browser.

### create-react-app example

```
cd create-react-app-example
npm run start-testshot
```

## Installation

```
npm install toptal/testshot
```

## Integration

For Webpack integration take a look on this commit https://github.com/toptal/testshot/commit/118575ba8a5e95530b2fe5f169fc69131e22addd

It illustrates how to integrate Testshot into create-react-app.

### Open Testshot

```
cd create-react-app-example
npm run start-testshot
```

## Basic Usage

Let's write a Testshot scenario for this component.

``` js
class Text extends Component {
  render() {
    return (
      <span style={{color: this.props.color}}>{this.props.children}</span>
    );
  }
}
```

### Creating a `scenario`

``` js
scenario('Default', () => (
  <Text>Text</Text>
))
```

### Adding a `context`

When you have multiple scenarios for the component it's a good idea to
group them into a context.

``` js
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
