// Main entry point, exposes the public API

import init from './init'
import Testshot, {scenario, context} from './Testshot'

const T = {
  init,
  scenario,
  context,
  Testshot
}

export default T
