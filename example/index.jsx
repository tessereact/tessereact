import React from 'react'

import './index.css'
import {init, scenario, context} from 'src/index'

console.log('--- WELCOME TO TESSEREACT DEVELOPMENT ---')

// TODO: Fix linter issues and get rid of comments
class Service extends React.Component {
  render () {
    return (
      /* eslint-disable react/prop-types */
      <p className={this.props.selected ? 'active' : ''} onClick={this.props.onClick}>
        {this.props.name} <b>$ {this.props.price.toFixed(2)}</b>
      </p>
    )
  }
}

class Cart extends React.Component {
  constructor (props, context) {
    super(props, context)

    this.state = {
      items: props.items,
      total: props.items.filter(i => i.selected).map(i => i.price).reduce((x, i) => x + i, 0)
    }
  }

  addTotal (service) {
    let items = this.state.items.slice(0)
    items.forEach((i) => {
      if (i.name === service.name) {
        i.selected = !service.selected
      }
    })
    if (!service.selected) {
      this.setState({items: items, total: this.state.total - service.price})
    } else {
      this.setState({items: items, total: this.state.total + service.price})
    }
  }

  render () {
    /* eslint-disable react/prop-types */
    const services = this.props.items.map(function (s, i) {
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
      <div id='services'>
        {services}
        <p id='total'>Total <b>${this.state.total.toFixed(2)}</b></p>
      </div>
    </div>
  }
}

// TODO: Move to snapshots.js file
context('Cart', () => {
  scenario('Basic', () => {
    return <Service name='UI Design' price={332} />
  })

  scenario('With a service', () => {
    const services = [
      { name: 'Web Development', price: 300, selected: false },
      { name: 'UI Design', price: 2500 },
      { name: 'New service', price: 1201 }
    ]

    return <Cart items={services} />
  }, {css: true, screenshot: true})
})

context('Service', () => {
  scenario('Basic', () => {
    return <Service name='UI Designer' price={6687} />
  })

  scenario('Expensive', () => {
    return <Service name='MacBook Pro' price={200} />
  })
})

scenario('Single scenario', () => {
  return <Service name='MacBook Pro' price={200} />
})

scenario('Empty component', () => {
  return null
})

document.addEventListener('DOMContentLoaded', () => {
  init()
})

if (module.hot) module.hot.accept()
