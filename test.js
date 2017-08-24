var srcTests = require.context('./src/', true, /\/test\.js$/)
srcTests.keys().forEach(srcTests)

var binTests = require.context('./bin/', true, /\/test\.js$/)
binTests.keys().forEach(binTests)
