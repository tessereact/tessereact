import {Component, createElement, PropTypes} from 'react'
import router from '../../routes'

class Link extends Component {
  static propTypes = {
    className: PropTypes.string,
    name: PropTypes.string,
    params: PropTypes.object,
    children: PropTypes.node
  }

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

export default Link
