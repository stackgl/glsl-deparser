# glsl-deparser

![](http://img.shields.io/badge/stability-stable-green.svg?style=flat)
![](http://img.shields.io/npm/v/glsl-deparser.svg?style=flat)
![](http://img.shields.io/npm/dm/glsl-deparser.svg?style=flat)
![](http://img.shields.io/npm/l/glsl-deparser.svg?style=flat)

Transform the AST output from [glsl-parser](http://github.com/stackgl/glsl-parser)
into strings.

Only operates on top-level statements emitted by `glsl-parser`, so the code it
emits is executable by WebGL.

## API

### stream = require('glsl-deparser/stream')(opts)

Creates a `readable`/`writable` stream.

The following options are available:

* `whitespace`: passing this as `false` will ensure that only syntactically
  significatn whitespace will be emitted. (It'll behave like a poor man's
  minifier). Defaults to `true`.
* `indent`: assuming that `whitespace` is enabled, use the `indent` string
  to indent the deparsed GLSL. Defaults to `'  '`.

``` javascript
var tokenizer = require('glsl-tokenizer/stream')
var parser = require('glsl-parser/stream')
var deparser = require('glsl-deparser/stream')

process.stdin
  .pipe(tokenizer())
  .pipe(parser())
  .pipe(deparser())
  .pipe(process.stdout)

process.stdin.resume()
```

### string = require('glsl-deparser/direct')(ast, opts)

Takes an AST produced by [glsl-parser](http://github.com/stackgl/glsl-parser)
and returns the deparsed GLSL. Accepts the same options listed above.

``` javascript
var tokenize = require('glsl-tokenizer/string')
var parse = require('glsl-parser/direct')
var deparse = require('glsl-deparse/direct')

function reformat(inputSrc) {
  var tokens = tokenize(inputSrc)
  var ast = parse(tokens)
  var outputSrc = deparse(ast)

  return outputSrc
}
```

## Note

The big caveat is that preprocessor if statements (`#if*`, `#endif`) won't work
unless each branch produces a parseable tree.

## License

MIT. See [LICENSE.md](LICENSE.md)
