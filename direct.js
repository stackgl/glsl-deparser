var Deparser = require('./lib/index')

module.exports = deparseDirect

function deparseDirect(ast, opts) {
  var deparser = Deparser(opts)
  var children = ast.children
  var output = []

  for (var i = 0; i < children.length; i++) {
    output.push(deparser(children[i]))
  }

  return output.join('')
}
