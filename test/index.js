var TokenStream   = require('glsl-tokenizer/stream')
var TokenString   = require('glsl-tokenizer/string')
var ParseDirect   = require('glsl-parser/direct')
var ParseStream   = require('glsl-parser/stream')
var DeparseStream = require('../stream')
var DeparseDirect = require('../direct')

var from = require('new-from')
var test = require('tape')
var path = require('path')
var fs   = require('fs')

var file = path.join(__dirname, 'working.glsl')

test('sanity check', function(t) {
  var deparser  = DeparseStream({ whitespace: true })
  var tokenizer = TokenStream()
  var parser    = ParseStream()
  var buffer1   = ''

  t.plan(6)

  fs.createReadStream(file)
    .pipe(tokenizer)
    .pipe(parser)
    .pipe(deparser)
    .on('data', function(d) { buffer1 += d })
    .once('end', function() {
      var parser    = ParseStream()
      var ast1      = parser.program
      var tokenizer = TokenStream()
      var buffer2   = ''

      t.pass('worked the first time')

      from([buffer1])
        .pipe(tokenizer)
        .pipe(parser)
        .once('end', function() {
          var ast2 = parser.program
          t.deepEqual(ast1, ast2, 'AST of original source and deparsed source match')
        })
        .pipe(DeparseStream({ whitespace: true }))
        .on('data', function(d) { buffer2 += d })
        .once('end', function() {
          t.pass('worked the second time')
          t.ok(buffer1, 'first buffer has content')
          t.ok(buffer2, 'second buffer has content')
          t.equal(buffer1, buffer2, 'deparse of matching ASTs matches')
        })
    })
})

test('deparsing a single program object', function(t) {
  var src = fs.readFileSync(file)
  var tokens = TokenString(src)
  var ast = ParseDirect(tokens)
  var programStream = from(ast.children, { objectMode: true })
  var buffer1 = ''

  programStream
    .pipe(DeparseStream(true))
    .on('data', function(d) { buffer1 += d })
    .once('end', function() {
      var buffer2 = ''

      fs.createReadStream(file)
        .pipe(TokenStream())
        .pipe(ParseStream())
        .pipe(DeparseStream(true))
        .on('data', function(d) { buffer2 += d })
        .once('end', function() {
          t.ok(buffer1, 'single object buffer has content')
          t.ok(buffer2, 'whole tree buffer has content')
          t.equal(buffer1, buffer2, 'single object and whole tree streams match')
          t.end()
        })
    })
})

test('whitespace flag alters output', function(t) {
  var src = fs.readFileSync(file)
  var tokens = TokenString(src)
  var ast = ParseDirect(tokens)
  var programStream1 = from(ast.children, { objectMode: true })
  var programStream2 = from(ast.children, { objectMode: true })
  var buffer1 = ''
  var buffer2 = ''

  programStream1
    .pipe(DeparseStream(true))
    .on('data', function(d) { buffer1 += d })
    .once('end', function() {
      programStream2
        .pipe(DeparseStream(false))
        .on('data', function(d) { buffer2 += d })
        .once('end', function() {
          t.notEqual(buffer1, buffer2, 'buffers are not equal')
          t.end()
        })
    })
})

test('direct deparsing vs stream deparsing', function(t) {
  var src = fs.readFileSync(file)
  var tokens = TokenString(src)
  var ast = ParseDirect(tokens)
  var buffer1 = DeparseDirect(ast, true, '\t')
  var buffer2 = ''

  fs.createReadStream(file)
    .pipe(TokenStream())
    .pipe(ParseStream())
    .pipe(DeparseStream(true, '\t'))
    .on('data', function(d) { buffer2 += d })
    .once('end', function() {
      t.equal(buffer1, buffer2, 'direct deparser and stream deparser yield the same results')
      t.end()
    })
})
