import test from 'ava'
import formatHTML from '.'

test('formatHTML supports empty strings', t => {
  t.is(formatHTML(''), '')
})

test('formatHTML supports nulls', t => {
  t.is(formatHTML(null), '')
  t.is(formatHTML(undefined), '')
})
