const React = require('react');
const ReactDOM = require('react-dom');
const TestshotWrapper = require('testshot').TestshotWrapper;
const scenario = require('testshot').scenario;

export const Service = React.createClass({
  render () {
    return  <p className={ this.props.selected ? 'active' : '' } onClick={this.props.onClick}>
      {this.props.name} <b>$ {this.props.price.toFixed(2)}</b>
    </p>;
  }
})

const Cart = React.createClass({
  getInitialState () {
    return {
      items: this.props.items,
      total: this.props.items.filter(i => i.selected).map(i => i.price).reduce(((x, i) => x + i), 0)
    };
  },

  addTotal (service) {
    let items = this.state.items.slice(0)
    items.forEach((i) => {
      if (i.name == service.name) {
        i.selected = !service.selected
      }
    })
    if (!service.selected) {
      this.setState({items: items, total: this.state.total - service.price});
    } else {
      this.setState({items: items, total: this.state.total + service.price});
    }
  },

  render () {
    var services = this.props.items.map(function (s, i) {
      return (
        <Service
          key={i}
          name={s.name}
          price={s.price}
          selected={s.selected}
          onClick={this.addTotal.bind(this, s)}
        />
      )
    }.bind(this))

    return <div>
      <h1>Our Services</h1>
      <div id="services">
        {services}
        <p id="total">Total <b>${this.state.total.toFixed(2)}</b></p>
      </div>
    </div>
  }
})

var App = React.createClass({
	render () {
    var services = [
      { name: 'Web Development', price: 300 },
      { name: 'Design', price: 400 },
      { name: 'Integration', price: 250 },
      { name: 'Training', price: 220 }
    ];
    console.log(TestshotWrapper)

		return (
			<TestshotWrapper server={{host: 'localhost', port: '3001'}}>
        <Cart items={services} />
      </TestshotWrapper>
		)
	}
})

// TODO: Move to snapshots.js file
scenario('Service: Basic', () => {
  return <Service name="UI Design" price={332} />
})

scenario('Cart: With a service', () => {
  const services = [
    { name: 'Web Development', price: 300, selected: false },
    { name: 'Design', price: 400 },
    { name: 'Integration', price: 250 },
    { name: 'New service', price: 123 }
  ]

  return <Cart items={services}/>
})

ReactDOM.render(<App />, document.getElementById('app'));
