import {Component, createElement} from 'react'
import router from '../../routes'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

class Link extends Component {
  render () {
    const {className, name, params, children} = this.props

    return createElement('a', {
      className: className,
      onClick: (e) => {
        e.preventDefault()
        router.navigateToRoute(name, params)
      }
    }, children)
  }
}

if (PropTypes) {
  Link.propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    params: PropTypes.object,
    children: PropTypes.node
  }
}

export default Link
