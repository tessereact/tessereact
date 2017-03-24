import test from 'ava'
import {
  buildInitialState,
  pickFailingScenario,
  requestScenariosList,
  mergeWithPayload,
  acceptCurrentScenario,
  requestScenarioAcceptance,
  generateTreeNodes
} from './helpers'

test('buildInitialState', t => {
  const data = [_ => 1, _ => 2]
  t.deepEqual(buildInitialState(data), {
    selectedNode: 1,
    scenarios: [1, 2]
  })
})

test('buildInitialState empty', t => {
  const data = []
  t.deepEqual(buildInitialState(data), {
    selectedNode: {},
    scenarios: []
  })
})

test('pickFailingScenario w/o failing scenarios', t => {
  const state = {
    scenarios: [{
      hasDiff: false
    }]
  }
  t.is(pickFailingScenario(state), state)
})

test('pickFailingScenario w/ failing scenarios', t => {
  const state = {
    scenarios: [{
      name: 'First',
      hasDiff: false
    }, {
      name: 'Second',
      hasDiff: true
    }]
  }
  const expectedState = Object.assign({}, state)
  expectedState.selectedNode = {name: 'Second', hasDiff: true}
  t.deepEqual(pickFailingScenario(state), expectedState)
})

test('requestScenariosList', t => {
  const scenarios = [{
    name: 'First',
    context: 'Boom',
    snapshot: 'snapshot'
  }, {
    name: 'Second',
    snapshot: 'snapshot'
  }]
  t.deepEqual(requestScenariosList(scenarios), {data: [{
    name: 'First',
    context: 'Boom'
  }, {
    name: 'Second',
    context: undefined
  }]})
})

test('mergeWithPayload w/o previously stored snapshots', t => {
  const state = {
    scenarios: [{
      name: 'First',
      snapshot: ''
    }]
  }
  t.deepEqual(mergeWithPayload(state, {}), {
    scenarios: [{
      name: 'First',
      isScenario: true,
      snapshot: '',
      hasDiff: true,
      previousSnapshot: undefined
    }]
  })
})

test('mergeWithPayload w/ previous snapshot', t => {
  const state = {
    scenarios: [{
      name: 'Default',
      context: 'Button',
      snapshot: '<input type="submit" />'
    }, {
      name: 'Default',
      context: 'Checkbox',
      snapshot: '<input type="checkbox" />'
    }]
  }
  const payload = [{
    name: 'Default',
    context: 'Checkbox',
    previousSnapshot: '<input>'
  }, {
    name: 'Default',
    context: 'Button',
    previousSnapshot: '<button>'
  }]
  t.deepEqual(mergeWithPayload(state, payload), {
    scenarios: [{
      name: 'Default',
      context: 'Button',
      // FIXME: Sorry for not true black box test formatHTML should be stubed
      snapshot: '<input type="submit" />\n',
      hasDiff: true,
      isScenario: true,
      previousSnapshot: '<button>'
    }, {
      name: 'Default',
      context: 'Checkbox',
      snapshot: '<input type="checkbox" />\n',
      hasDiff: true,
      isScenario: true,
      previousSnapshot: '<input>'
    }]
  })
})

test('mergeWithPayload w/ matching snapshots', t => {
  const state = {
    scenarios: [{
      name: 'First',
      snapshot: '<span></span>'
    }]
  }
  const payload = [{
    name: 'First',
    previousSnapshot: '<span></span>\n'
  }]
  t.deepEqual(mergeWithPayload(state, payload), {
    scenarios: [{
      name: 'First',
      // FIXME: Sorry for not true black box test — formatHTML should be stubed
      snapshot: '<span></span>\n',
      hasDiff: false,
      isScenario: true,
      previousSnapshot: '<span></span>\n'
    }]
  })
})

test('acceptCurrentScenario', t => {
  const state = {
    selectedNode: {
      previousSnapshot: 'prev',
      snapshot: 'current',
      hasDiff: true
    }
  }
  t.deepEqual(acceptCurrentScenario(state), {
    selectedNode: {
      previousSnapshot: 'current',
      snapshot: 'current',
      hasDiff: false
    }
  })
})

test('requestScenarioAcceptance', t => {
  const scenario = {
    name: 'Name',
    context: 'Context',
    snapshot: 'Snapshot',
    previousSnapshot: 'Prev'
  }
  t.deepEqual(requestScenarioAcceptance(scenario), {
    name: 'Name',
    context: 'Context',
    snapshot: 'Snapshot'
  })
})

test('generateTreeNodes', t => {
  const scenarios = [{
    name: 'First',
    context: 'Boom',
    snapshot: 'blahblah',
    hasDiff: false
  }, {
    name: 'Second',
    context: null,
    snapshot: 'boomboom',
    hasDiff: true
  }, {
    name: 'Third',
    context: 'Boom',
    snapshot: 'piupie',
    hasDiff: false
  }]
  t.deepEqual(generateTreeNodes(scenarios), [{
    name: 'Second',
    context: null,
    hasDiff: true
  }, {
    name: 'Boom',
    hasDiff: false,
    children: [{
      name: 'First',
      context: 'Boom',
      hasDiff: false
    }, {
      name: 'Third',
      context: 'Boom',
      hasDiff: false
    }]
  }])
})

test('generateTreeNodes failing child', t => {
  const scenarios = [{
    name: 'First',
    context: 'Boom',
    snapshot: 'blahblah',
    hasDiff: false
  }, {
    name: 'Second',
    context: null,
    snapshot: 'boomboom',
    hasDiff: false
  }, {
    name: 'Third',
    context: 'Boom',
    snapshot: 'piupie',
    hasDiff: true
  }]
  t.deepEqual(generateTreeNodes(scenarios), [{
    name: 'Boom',
    hasDiff: true,
    children: [{
      name: 'First',
      context: 'Boom',
      hasDiff: false
    }, {
      name: 'Third',
      context: 'Boom',
      hasDiff: true
    }]
  }, {
    name: 'Second',
    context: null,
    hasDiff: false
  }])
})
