// Main entry point, exposes the public API

import init from './init'
import TestshotComponent, {scenario} from './Testshot'

module.exports = {
  init,
  scenario,
  Testshot: TestshotComponent
}
