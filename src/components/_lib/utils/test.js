import test from 'ava'
import {matchesQuery} from '.'

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
