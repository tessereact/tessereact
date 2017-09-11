import {Component, createElement} from 'react'
import router from '../../routes'

let PropTypes
try {
  PropTypes = require('prop-types')
} catch (e) {
  // Ignore optional peer dependency
}

/**
 * Component which renders a single-page application style link to a route.
 * @extends React.Component
 * @property {String} props.name - name of the route
 * @property {Object} props.params - search params of the route
 * @property {Node} props.children - children nodes of the element
 * @property {RouteData} [props.className] - CSS class name of the resulting element
 */
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
