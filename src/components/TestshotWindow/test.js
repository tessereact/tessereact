import test from 'ava'
import {
  acceptCurrentScenario,
  requestScenarioAcceptance,
  generateTreeNodes
} from './helpers'

test('acceptCurrentScenario', t => {
  const state = {
    scenarios: [{
      name: 'current',
      context: 'new',
      previousSnapshot: 'old',
      snapshot: 'new',
      hasDiff: true
    }]
  }
  t.deepEqual(acceptCurrentScenario(state, {name: 'current', context: 'new'}), {
    findNextFailingScenario: true,
    scenarios: [{
      name: 'current',
      context: 'new',
      snapshot: 'new',
      previousSnapshot: 'new',
      hasDiff: false
    }]
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

test('requestScenarioAcceptance with snapshotCSS', t => {
  const scenario = {
    name: 'Name',
    context: 'Context',
    snapshot: 'Snapshot',
    snapshotCSS: 'Snapshot CSS',
    previousSnapshot: 'Prev'
  }
  t.deepEqual(requestScenarioAcceptance(scenario), {
    name: 'Name',
    context: 'Context',
    snapshot: 'Snapshot',
    snapshotCSS: 'Snapshot CSS'
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
