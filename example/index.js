import './index.css'

import {init, scenario} from 'src/index'

console.log('--- WELCOME TO TESTSHOT DEVELOPMENT ---')

init()
scenario()

if (module.hot) module.hot.accept()
