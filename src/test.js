import test from 'ava'
import {init, scenario, Testshot} from '.'

test(t => {
  t.is(typeof init, 'function')
  t.is(typeof scenario, 'function')
  t.is(typeof Testshot, 'function')
})
