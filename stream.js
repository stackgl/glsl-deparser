var Deparser = require('./lib/index')
var through  = require('through2').obj

module.exports = DeparseStream

function DeparseStream(opts) {
  var deparser = Deparser(opts)
  var stream = through(write, flush)

  return stream

  function write(data, _, next) {
    this.push(deparser(data))
    next()
  }

  function flush() {
    this.push(null)
  }
}
