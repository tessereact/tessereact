import test from 'ava'
import {isNodeActive, matchesQuery} from '.'

test('isNodeActive', t => {
  const selectedScenario = {
    name: 'First',
    context: 'Foo'
  }
  const node = {
    name: 'First',
    context: 'Foo'
  }
  t.is(isNodeActive(selectedScenario, node), true)
  t.is(isNodeActive(selectedScenario, {name: 'Second'}), false)
})

test('matchesQuery no matching', t => {
  t.is(matchesQuery('First', 'Second'), false)
})

test('matchesQuery matching', t => {
  t.is(matchesQuery('Fi', 'First'), true)
})

test('matchesQuery matches when query string is falsy', t => {
  t.is(matchesQuery(null, 'First'), true)
  t.is(matchesQuery(undefined, 'First'), true)
  t.is(matchesQuery('', 'First'), true)
})

test('matchesQuery matches when query string is too short', t => {
  t.is(matchesQuery('', 'First'), true)
  t.is(matchesQuery('a', 'First'), true)
  t.is(matchesQuery('ab', 'First'), true)
})
