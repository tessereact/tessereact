const React = require('react')
const lodash = require('lodash')
const classnames = require('classnames')

import HighligthedDiff from './styled/HighligthedDiff'

// TODO: Change to smth reasonable
const DELIMETER = '+++'

export const Formatter = React.createClass({

  render() {
    return <pre>
      {lodash.flatten(this._nodes()).map((n, i) => {
        return <HighligthedDiff key={i} added={n.added} removed={n.removed}>
          {(n.tag ? lodash.pad('', n.indent) : '') + n.value}
          {n.tag && <br />}
        </HighligthedDiff>
      })}
    </pre>
  },

  _nodes () {
    var indent = 0
    return this.props.nodes.map((n, i) => {
      return n.value.replace(/\>\</g, '>'+DELIMETER+'<').split(DELIMETER).map((el) => {
        // TODO: Rewrite it so it actually works :D
        if (el.slice(0, 2) == '</') {
          indent = indent - 2
        } else if (el[0] == '<') {
          indent = indent + 2
        }

        return {
          value: el,
          added: n.added,
          removed: n.removed,
          tag: !!el.match('>'),
          indent: indent
        }
      })
    })
  }
})

