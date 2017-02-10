// Main entry point, exposes the public API

import init from './init'
import Testshot, {scenario, context} from './Testshot'

module.exports = {
  init,
  scenario,
  context,
  Testshot
}
