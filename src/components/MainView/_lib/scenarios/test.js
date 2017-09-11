import test from 'ava'
import {
  findScenario,
  acceptScenario,
  resolveScenario,
  requestScenarioAcceptance
} from '.'

test('findScenario', t => {
  const scenarios = [
    {context: 'foo', name: 'bar', snapshot: 'snapshot 1'},
    {context: 'foo', name: 'baz', snapshot: 'snapshot 2'}
  ]
  t.deepEqual(
    findScenario(scenarios, 'foo', 'baz'),
    {context: 'foo', name: 'baz', snapshot: 'snapshot 2'}
  )
})

test("findScenario with 'null' as context name", t => {
  const scenarios = [
    {name: 'bar', snapshot: 'snapshot 1'},
    {name: 'baz', snapshot: 'snapshot 2'}
  ]
  t.deepEqual(
    findScenario(scenarios, 'null', 'baz'),
    {name: 'baz', snapshot: 'snapshot 2'}
  )
})

test('findScenario returns undefined if scenario is not found', t => {
  const scenarios = [
    {context: 'foo', name: 'bar', snapshot: 'snapshot 1'},
    {context: 'foo', name: 'baz', snapshot: 'snapshot 2'}
  ]
  t.deepEqual(
    findScenario(scenarios, 'foo', 'qux'),
    undefined
  )
})

test('acceptScenario', t => {
  const scenarios = [{
    name: 'current',
    context: 'new',
    previousSnapshot: 'old',
    snapshot: 'new',
    hasDiff: true
  }]
  t.deepEqual(
    acceptScenario(scenarios, {name: 'current', context: 'new'}),
    [{
      name: 'current',
      context: 'new',
      snapshot: 'new',
      previousSnapshot: 'new',
      hasDiff: false
    }]
  )
})

test('resolveScenario', t => {
  const scenarios = [{
    name: 'bar',
    context: 'foo',
    getElement: () => 'element'
  }]
  t.deepEqual(
    resolveScenario(scenarios, {
      name: 'bar',
      context: 'foo',
      diff: 'diff',
      snapshot: '<html />',
      snapshotCSS: 'css {}'
    }),
    [{
      name: 'bar',
      context: 'foo',
      element: 'element',
      diff: 'diff',
      hasDiff: 'diff',
      snapshot: '<html />',
      snapshotCSS: 'css {}',
      status: 'resolved'
    }]
  )
})

test('requestScenarioAcceptance', t => {
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
