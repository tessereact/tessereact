import test from 'ava'
import init from '.'

test(t => {
  t.is(typeof init, 'function')
})
