const React = require('react')
const lodash = require('lodash')
// const enzyme = require('enzyme')
const ReactTestRenderer = require('react-test-renderer')
const classnames = require('classnames')
const jsondiffpatch = require('jsondiffpatch').create({})
const jsondiffpatchHtmlFormatter = require('jsondiffpatch/src/formatters/html')
const ReactDOMServer = require('react-dom/server')
const HtmlDiffer = require("html-differ").HtmlDiffer
const logger = require('html-differ/lib/logger');
var escape = require('escape-html');

console.log(jsondiffpatchHtmlFormatter)

var data = [];

// TODO: Do it properly
export function context(callback) {
  callback()
}

var Formatter = React.createClass({
  render() {
    const nodes = this.props.nodes.map((n, i) => {
      return n.value.replace(/\>\</g, '>+++<').split('+++').map((el) => {
        return {
          value: el,
          added: n.added,
          removed: n.removed,
          tag: !!el.match('>')
        }
      })
    })

    console.log(lodash.flatten(nodes))

    return <pre>
      {lodash.flatten(nodes).map((n, i) => {
        return <span key={i} className={classnames({'Testshot-green': n.added, 'Testshot-red': n.removed})}>
          {n.value}
          {n.tag && <br />}
        </span>
      })}
    </pre>
  }
})


// TODO: Delay this function execution
// TODO: Validate name uniqueness
// TODO: Add simulations from prev implementation
export function scenario(testName, componentBuilder) {
  const json = ReactTestRenderer.create(componentBuilder()).toJSON()
  return data.push({
    name: testName,
    component: componentBuilder(),
    // TODO: Remove this hack
    // snapshot: JSON.parse(JSON.stringify(json))
    snapshot: ReactDOMServer.renderToStaticMarkup(componentBuilder())
  })
}

var Testshot = React.createClass({

  getInitialState () {
    return {
      selectedSnapshot: this.props.snapshots[0] || {},
      snapshots: this.props.snapshots
    }
  },

  // Simulation tricks
  // componentDidMount () {
  //   eval('('+this.state.selectedSnapshot.simulate+')($(".Testshot-component"))')
  // },

  // TODO: Pass URL from config
  componentWillMount () {
    fetch('//localhost:3001/snapshots-list', {
      method: 'post',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: this.state.snapshots
      })})
      .then((response) => {
        response.json().then((json) => {
          const newData = this.state.snapshots.map((s) => {
            s.previousSnapshot = lodash.find(json, {name: s.name}).previousSnapshot
            return s
          })
          // TODO: Avoid setting states few times in a row
          this.setState({snapshots: newData})
          this.pickNextFailingScenario()
        })
      })
  },

  render() {
    return (
      <div className='Testshot show'>
        <div className="Testshot-sidebar">
          <h3 className="Testshot-header">Scenarios</h3>
          <ul>
          {lodash.map(this.state.snapshots, (value, i) => {
            return (<li key={i}>
              <a onClick={this.handleSelect.bind(this, value.name)} key={value.name} className={classnames('Testshot-btn', {active: this.state.selectedSnapshot.name === value.name, 'btn-success': this.noDiff(value), 'btn-danger': !this.noDiff(value)})}>
                {value.name}
              </a>
            </li>)
          })}
          </ul>
        </div>
        <div className="Testshot-content">
          <h3 className="Testshot-componentHeader">{this.state.selectedSnapshot.name}</h3>
          <div className="Testshot-component">
            {this.state.selectedSnapshot.component}
          </div>
          {!lodash.isEqual(this.state.selectedSnapshot.snapshot, this.state.selectedSnapshot.previousSnapshot) && <button className="Testshot-acceptButton" type="button" onClick={this.acceptSnapshot.bind(this)} >Accept</button> }
        </div>
        <div className="Testshot-sidebar right">
          <h3 className="Testshot-header">Diff</h3>
          {this.renderDiff()}
        </div>
      </div>
    );
  },

  acceptSnapshot () {
    console.log('acceptSnapshot')
    fetch('//localhost:3001/snapshots', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({
        name: this.state.selectedSnapshot.name,
        snapshot: this.state.selectedSnapshot.snapshot
    })}).then(function() {
      console.log('previousSnapshot accepted', this.state.selectedSnapshot.snapshot)
      window.location.href = '/'
    }.bind(this))
  },

  pickNextFailingScenario () {
    const failingScenario = lodash.find(this.state.snapshots, (s) => !lodash.isEqual(s.snapshot, s.previousSnapshot))
    if (failingScenario) {
      const newState = Object.assign({}, this.state)
      newState.selectedSnapshot = failingScenario
      this.setState(newState)
    }
  },

  noDiff(scenario) {
    return lodash.isEqual(scenario.snapshot, scenario.previousSnapshot)
  },

  renderDiff() {
    if (this.noDiff(this.state.selectedSnapshot)) {
      return <div className="alert alert-success" role="alert">Snapshots are identical!</div>
    } else {
      return <div>
      <pre>{this.computeDiff()}</pre>
    </div>
    }
  },

  computeDiff() {
    const delta = jsondiffpatch.diff(this.state.selectedSnapshot.previousSnapshot, this.state.selectedSnapshot.snapshot);
    const data = jsondiffpatchHtmlFormatter.format(delta, this.state.selectedSnapshot.previousSnapshot)
    var htmlDiffer = new HtmlDiffer({});
    var diff = htmlDiffer.diffHtml(this.state.selectedSnapshot.previousSnapshot, this.state.selectedSnapshot.snapshot)
    return <Formatter nodes={diff} />
  },

  renderPreviousSnapshot() {
    if (this.state.selectedSnapshot.previousSnapshot) {
      return <div>
        <h4>Previous snapshot:</h4>
        <div><pre>{JSON.stringify(this.state.selectedSnapshot.previousSnapshot, null, 2) }</pre></div>
      </div>
    }
  },

  handleSelect (key) {
    this.setState({selectedSnapshot: lodash.find(this.state.snapshots, ['name', key])})
  }

})

// TODO: Button and Testshot workspace should be rendered only in Dev environment
export const TestshotWrapper = React.createClass({
  getInitialState () {
    return {
      show: localStorage.getItem('testing') == 'true'
    }
  },

  render () {
    return <div>
      {this.props.children}
      {this.state.show && <Testshot snapshots={data} />}
      <a onClick={this.toggleTestshot.bind(this)} className="Testshot-button" href="#">Testshot</a>
    </div>
  },

  toggleTestshot () {
    localStorage.setItem('testing', !this.state.show);
    this.setState({show: !this.state.show})
  }
})
