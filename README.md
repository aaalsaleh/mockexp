# MockExp
Mockup value generator using `RegExp` pattern.

## Installation
```bash
npm install mockexp
```

## Import
ES Module
```javascript
import MockExp from 'mockexp';
```
CommonJS
```javascript
const MockExp = require('mockexp').default;
```
Browser
```html
<script type="text/javascript" src="mockexp.min.js"></script>
```
## Usage
```javascript
let hi = new MockExp(/Hello{1,5} world!*/i);
hi.generate(); // -> "HElloOo woRLd!!!"
hi.generate(); // -> "HeLlO WORLD!"
hi.generate(); // -> "hellOoooO wOrLD"

// or by monkey patching RegExp
MockExp.install();
// then generating directly through RegExp
/Hello{1,5} world!*/i.generate(); // -> "heLLooOO WorLD!!!!!"
```
## Supported Syntax
**Standard**
* Literal characters
* Wildcard: `.`
* Disjunction: `|`
* Charset: `[...]`, `[^...]`
* Quantifiers: `?`, `*`, `+`, `{n}`, `{n,}`, `{n,m}`
* Groups: `(...)`, `(?:...)`, `(?<name>...)`
* Backreferences: `\#`, `\k<name>`
* Assertions 
  * Input boundaries: `^`, `$`
  * Word boundaries: `\b`, `\B`
  * Lookahead: `(?=...)`, `(?!...)`
  * Lookbehind: `(?<=...)`, `(?<!...)`
* Escape characters: `\xHH`, `\uHHHH`, `\u{HHHHHH}`, `\cA`, `\###`, `\0`, `\t`, `\n`, `\v`, `\f`, `\r`, `[\b]`
* Escape classes: `\d`, `\D`, `\s`, `\S`, `\w`, `\W`
* Unicode classes: `\p{...}`, `\P{...}`
* Flags: `i`, `g`, `m`, `s`, `u`, `y`

**Non-Standard**
* Expressions: `\x{...}`

## Configuration

#### `MockExp(pattern, flags?)`
Accepts a `string` or `RegExp` pattern with optional `RegExp` flags. Only the flags `i`, `s`, `u` will affect the generated value.

#### `MockExp.charset`
Defines the default charset used for wildcards `.`, negated charsets `[^...]` and the classes `\D`, `\W`, `\S`, `\P{...}`. It must be a `RegExp` charset pattern `[...]`.

If not set, the default charset is either `[\u0020-\u007E]` if `u` flag is not set, or `[\u0020-\u0FFD]` if `u` flag is set. Also, `[\u000A\u000D\u2028\u2029]` will be included if `s` flag is set.

However, if `MockExp.charset` is set to a custom charset then all the above will be ignored and the custom charset will be used instead.

#### `MockExp.maxRepetition`
Defines the maximum repetition limit for the quantifiers without an upper-limit: `*`, `+`, `{n,}`. The upper-limit will be a random number between the lower-limit and the lower-limit + `MockExp.maxRepetition` (inclusive). By default its value is 10.

#### `MockExp.maxAttempts`
Defines the maximum failed attempts to generate valid `RegExp` patterns before giving up with an `Unsupported pattern` exception. Certain `RegExp` patterns are impossible to generate (e.g. impossible assertion or limited default charset). By default its value is 1000.

#### `MockExp.classes`
Defines the unicode classes for `\p{...}` and `\P{...}`. Each defined class must be assigned a `RegExp` charset pattern `[...]`. It will only be respected if `u` flag is set and the class is defined in `MockExp.classes`.

#### `MockExp.expressions`
Defines custom expressions to be included in the pattern using the `\x{...}` non-standard syntax. Each defined expression must be assigned a value of either `string`, `RegExp`, `MockExp`, or `function():string`. Expressions can also reuse other predefined expressions. If the expression is not defined then the output will be `x{...}` as normally handled by `RegExp`.

#### `MockExp.randomInt(min, max)`
Generates random integers between min and max (inclusive) using Math.random. Override if you need to control the randomness behavior (e.g. for seeded or cryptographic randomness).

#### `MockExp.install()`
Monkey patch `RegExp` class with `generate` method. While monkey patching can provide ease of use, it should be noted that it is generally considered a bad practice.

## Limitations
* Experimental support for lookahead and lookbehind assertions.
  * Tries its best to generate a value that respects all lookahead and lookbehind assertions.
  * Throws an `Unsupported pattern` exception after it fails to generate the pattern (e.g. impossible pattern).
  * `MockExp.maxAttempts` controls how many attempts to try before it decides to give up on satisfying the assertions.
* Limited support for unicode classes `\p{...}` and `\P{...}`.
  * Parses all `\p{...}` and `\P{...}` classes when `u` flag is set.
  * Generates based on defined Unicode classes in `MockExp.classes`.
  * Since the exact set of characters matched by unicode classes can change due to unicode standard changes, only manual definition of unicode classes is supported currently.
* No support for the recent `v` mode flag.
  * No unicode classes intersection `&&` or subtraction `--` support.
  * No string literal in charset `\q{...}` support.
  * Extended unicode can be still generated in `u` mode.

## Development
Uses `eslint` for linting, `tsc` for building, and `jest` for testing. All source files are under `src`, all test files are under `tests`, and all built files will go under `lib`.
```bash
# install dev-dependencies
npm install
# lint source
npm run lint
# build library
npm run build
# test source only
npm run test:src
# test source and library
npm run test
# clean build and test coverage
npm run clean
```

## License
This work is licensed under the [MIT license](LICENSE).
