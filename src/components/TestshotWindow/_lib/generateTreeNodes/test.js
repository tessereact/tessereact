import test from 'ava'
import generateTreeNodes from '.'

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
