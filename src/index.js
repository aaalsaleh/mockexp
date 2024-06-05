const TYPE = {ROOT: 0, LITERAL: 1, GROUP: 2, CHARSET: 3, QUANTIFIER: 4, RANGE: 5, SPECIAL: 6, REFERENCE: 7, UNICODE_CLASS: 8, EXPRESSION: 9};

export default class MockExp {
    source = '';
    ignoreCase = false;
    global = false;
    multiline = false;
    dotAll = false;
    unicode = false;
    sticky = false;

    #regexp = null;
    #ast = [];
    #exactMatch = true;
    #captures = 0;
    #namedCaptures = [];
    #specials = {};

    /**
     * @param {(RegExp|string)} regexp RegExp pattern
     * @param {string} [flags=undefined] Combination of RegExp flags: i, g, m, s, u, y (optional)
     */
    constructor(pattern, flags = undefined) {
        this.#regexp = new RegExp(pattern, flags);

        this.source = this.#regexp.source;

        this.ignoreCase = this.#regexp.ignoreCase;
        this.global = this.#regexp.global;
        this.multiline = this.#regexp.multiline;
        this.dotAll = this.#regexp.dotAll;
        this.unicode = this.#regexp.unicode;
        this.sticky = this.#regexp.sticky;

        this.#specials = {
            '^': [],
            '$': [],
            '\\b': [],
            '\\B': /[a-zA-Z0-9]/,
            '\\d': /[0-9]/,
            '\\D': /[^0-9]/,
            '\\s': /[ \n\r\t]/,
            '\\S': /[^ \n\r\t]/,
            '\\w': /[a-zA-Z0-9_]/,
            '\\W': /[^a-zA-Z0-9_]/,
            '.': MockExp.charset ?
                MockExp.charset :
                this.unicode ?
                    this.dotAll ? /[\u0020-\uFFFD\n]/ : /[\u0020-\uFFFD]/ :
                    this.dotAll ? /[\u0020-\u007E\n]/ : /[\u0020-\u007E]/
        };

        this.#exactMatch = true;

        this.#ast = this.#compile(this.#regexp);

        this.#regexp = new RegExp(this.#regexp.source.replace(/\\x{.*?}/g, '(?:.*)'),
            (this.ignoreCase ? 'i' : '') +
            (this.global ? 'g' : '') +
            (this.multiline ? 'm' : '') +
            (this.dotAll ? 's' : '') +
            (this.unicode ? 'u' : '') +
            (this.sticky ? 'y' : '')
        );
    }

    /**
     * Generates a random string based on the RegExp pattern.
     * @returns {string} Random string matching the RegExp pattern
     */
    generate() {
        let result;
        let match;
        let attempt = 0;

        do {
            result = this.#generate(this.#ast, []);
            if (this.#exactMatch || attempt < MockExp.maxAttempts / 2) {
                let first = this.#regexp.exec(result)?.[0];
                if (this.#regexp.test(first)) {
                    result = first;
                    match = true;
                } else {
                    match = result.match(this.#regexp)?.[0] === result;
                }
            } else {
                match = this.#regexp.test(result);
            }
        } while (!match && ++attempt < MockExp.maxAttempts);

        if (attempt === MockExp.maxAttempts) {
            throw new Error(`Unsupported pattern: ${this.source}`);
        }

        return result;
    }

    #compile(regexp) {
        let i = 0, c, ref = 0,
            ast = {type: TYPE.ROOT, capture: true, reference: ref++, alternate: false, value: []},
            currentGroup = ast,
            stack = ast.value,
            groupStack = [],
            r,
            value,
            char,
            token = regexp.source;

        this.#captures = (this.source.match(/\((?!\?(?:[:!=]|<[!=]))/g) || []).length;
        this.#namedCaptures = [];
        for (let match of this.source.matchAll(/\(\?<([a-z][a-z0-9_$]*)>/g)) {
            this.#namedCaptures[match[1]] = true;
        }

        while (i < token.length) {
            c = token[i++];

            switch (c) {
            case '^':
            case '$':
            case '.':
                stack.push({type: TYPE.SPECIAL, value: c, ranges: this.#specialRanges(c)});
                break;

            case '|':
                if (!currentGroup.alternate) {
                    currentGroup.value = [currentGroup.value];
                    currentGroup.alternate = true;
                }

                value = [];
                currentGroup.value.push(value);
                stack = value;
                break;

            case '[':
                value = [];

                let charsetRE = /\\u{[0-9a-fA-F]{1,6}}-\\u{[0-9a-fA-F]{1,6}}|\\u[0-9a-fA-F]{4}-\\u[0-9a-fA-F]{4}|\\x[0-9a-fA-F]{2}-\\x[0-9a-fA-F]{2}|\\u{[0-9a-fA-F]{1,6}}|\\u[0-9a-fA-F]{4}|\\[pP]{.*?}|\\x[0-9a-fA-F]{2}|\\c[A-Za-z]|\\[0-3]?[0-7]?[0-7]|\\\d+|\\.|[0-9a-zA-Z]-[0-9a-zA-Z]|./g;
                let charClass;
                let charsetStr = token.substring(i).match(/((?:[^\\\]]|\\.)*)\]/)[1];

                i += charsetStr.length + 1;

                let notCharset = charsetStr.startsWith('^');
                if (notCharset) {
                    charsetStr = charsetStr.substring(1);
                }

                while ((charClass = charsetRE.exec(charsetStr)) !== null) {
                    if (charClass[0].includes('-') && charClass[0].length > 2) {
                        let [from, to] = charClass[0].split('-');
                        from = this.#compileLiteral(from, true).value;
                        to = this.#compileLiteral(to, true).value;
                        value.push({type: TYPE.RANGE, value: [from, to]});
                    } else {
                        char = this.#compileLiteral(charClass[0], true);
                        if (char.type === TYPE.LITERAL) {
                            for (let charValue of Array.from(char.value)) {
                                value.push({type: TYPE.LITERAL, value: charValue});
                            }
                        } else {
                            value.push(char);
                        }
                    }
                }

                let charset = {type: TYPE.CHARSET, not: notCharset, value: value};
                charset.ranges = this.#expandRanges(charset);

                if (charset.ranges.length === 0) {
                    throw new Error(`Impossible charset: ${this.value}`);
                }

                stack.push(charset);
                break;

            case '(':
                let group = {type: TYPE.GROUP, alternate: false, capture: false};
                let groupType = token.substring(i, i + 3);

                if (groupType.startsWith('?:')) {
                    i += 2;
                } else if (groupType.startsWith('?=')) {
                    group.positiveLookahead = true;
                    this.#exactMatch = false;
                    i += 2;
                } else if (groupType.startsWith('?!')) {
                    group.negativeLookahead = true;
                    this.#exactMatch = false;
                    i += 2;
                } else if (groupType.startsWith('?<=')) {
                    group.positiveLookbehind = true;
                    this.#exactMatch = false;
                    i += 3;
                } else if (groupType.startsWith('?<!')) {
                    group.negativeLookbehind = true;
                    this.#exactMatch = false;
                    i += 3;
                } else if (groupType.startsWith('?<')) {
                    group.capture = true;
                    group.reference = ref++;
                    group.name = token.substring(i + 2, token.indexOf('>', i + 2));
                    i += group.name.length + 3;
                } else {
                    group.capture = true;
                    group.reference = ref++;
                }

                group.value = [];

                stack.push(group);
                groupStack.push(currentGroup);

                currentGroup = group;
                stack = group.value;
                break;

            case ')':
                currentGroup = groupStack.pop();
                stack = currentGroup.alternate ? currentGroup.value[currentGroup.value.length - 1] : currentGroup.value;
                break;

            case '\\':
                let escapedRE = /\\u{[0-9a-fA-F]{1,6}}|\\u[0-9a-fA-F]{4}|\\[pP]{.*?}|\\x{.*?}|\\x[0-9a-fA-F]{2}|\\c[A-Za-z]|\\k<.*?>|\\\d+|\\./;
                let escapedChar = escapedRE.exec(token.substring(i - 1))[0];
                char = this.#compileLiteral(escapedChar, false);
                if (char.type === TYPE.LITERAL && stack[stack.length - 1]?.type === TYPE.LITERAL) {
                    stack[stack.length - 1].value += char.value;
                } else {
                    stack.push(char);
                }
                i += escapedChar.length - 1;
                break;

            case '?':
                r = this.#compileQuantifier(token[i], stack, 0, 1);
                stack.push(r);
                i += r.greedy ? 0 : 1;
                break;

            case '*':
                r = this.#compileQuantifier(token[i], stack, 0, Infinity);
                stack.push(r);
                i += r.greedy ? 0 : 1;
                break;

            case '+':
                r = this.#compileQuantifier(token[i], stack, 1, Infinity);
                stack.push(r);
                i += r.greedy ? 0 : 1;
                break;

            case '{':
                let quantRE = /^(\d+)(,(\d+)?)?\}/.exec(token.slice(i));
                if (quantRE) {
                    let min = parseInt(quantRE[1], 10);
                    let max = quantRE[2] ? quantRE[3] ? parseInt(quantRE[3], 10) : Infinity : min;
                    r = this.#compileQuantifier(token[i + quantRE[0].length], stack, min, max);
                    stack.push(r);
                    i += r.greedy ? quantRE[0].length : quantRE[0].length + 1;
                    break;
                }

            default:
                char = this.#compileLiteral(c, false);
                if (char.type === TYPE.LITERAL && stack[stack.length - 1]?.type === TYPE.LITERAL) {
                    stack[stack.length - 1].value += char.value;
                } else {
                    stack.push(char);
                }
            }
        }

        return ast;
    }

    #compileLiteral(str, charset) {
        if (/\\[dDwWsS]/.test(str)) {
            return {type: TYPE.SPECIAL, value: str.substring(0, 2), ranges: this.#specialRanges('\\' + str[1])};
        } else if (/\\[pP]{.*?}/.test(str)) {
            if (this.unicode) {
                let notClass = str[1] === 'P';
                let className = str.substring(3, str.length - 1);
                if (MockExp.classes[className]) {
                    let classRanges = this.#compile(MockExp.classes[className]).value[0].ranges;
                    if (notClass) {
                        classRanges = this.#subtractRanges(this.#specialRanges('.'), classRanges);
                    }
                    return {type: TYPE.SPECIAL, value: str, ranges: classRanges};
                } else {
                    throw Error(`Undefined unicode class: ${className}`);
                }
            } else {
                return {type: TYPE.LITERAL, value: str.substring(1)};
            }
        } else if (/\\x{.*?}/.test(str)) {
            let fn = str.substring(3, str.length - 1);
            return MockExp.expressions[fn] ?
                {type: TYPE.EXPRESSION, value: fn} :
                {type: TYPE.LITERAL, value: str.substring(1)};
        } else if (/\\k<.*?>/.test(str)) {
            let name = str.substring(3, str.length - 1);
            return this.#namedCaptures[name] ?
                {type: TYPE.REFERENCE, named: true, value: name} :
                {type: TYPE.LITERAL, value: `k<${name}>`};
        } else if (/\\c[a-zA-Z]/.test(str)) {
            return {type: TYPE.LITERAL, value: String.fromCodePoint(str.substring(2, 3).toUpperCase().codePointAt(0) - 64)};
        } else if (/\\x[0-9a-zA-Z]{2}/.test(str)) {
            return {type: TYPE.LITERAL, value: String.fromCodePoint(parseInt(str.substring(2, 4).toUpperCase(), 16))};
        } else if (/\\u[0-9a-zA-Z]{4}/.test(str)) {
            return {type: TYPE.LITERAL, value: String.fromCodePoint(parseInt(str.substring(2, 6).toUpperCase(), 16))};
        } else if (/\\u{[0-9a-fA-F]{1,6}}/.test(str)) {
            return this.unicode ?
                {type: TYPE.LITERAL, value: String.fromCodePoint(parseInt(str.substring(3, str.length - 1).toUpperCase(), 16))} :
                {type: TYPE.LITERAL, value: str.substring(1)};
        } else if (/\\0/.test(str)) {
            return {type: TYPE.LITERAL, value: '\0'};
        } else if (/\\[tnvfr]/.test(str)) {
            return {type: TYPE.LITERAL, value: String.fromCodePoint('tnvfr'.indexOf(str[1]) + 9)};
        } else if (/\\[0-3]?[0-7]?[0-7]/.test(str)) {
            let ref = parseInt(str.substring(1), 10);
            return charset || ref > this.#captures ?
                {type: TYPE.LITERAL, value: String.fromCodePoint(parseInt(str.substring(1), 8))} :
                {type: TYPE.REFERENCE, named: false, value: parseInt(str.substring(1), 10)};
        } else if (/\\b/.test(str)) {
            if (!charset) {
                this.#exactMatch = false;
            }

            return charset ?
                {type: TYPE.LITERAL, value: '\b'} :
                {type: TYPE.SPECIAL, value: '\\b', ranges: this.#specialRanges('\\' + str[1])};
        } else if (/\\B/.test(str)) {
            if (!charset) {
                this.#exactMatch = false;
            }

            return charset ?
                {type: TYPE.LITERAL, value: 'B'} :
                {type: TYPE.SPECIAL, value: '\\B', ranges: this.#specialRanges('\\' + str[1])};
        } else if (/\\\d+/.test(str)) {
            let ref = parseInt(str.substring(1), 10);
            return charset || ref > this.#captures ?
                {type: TYPE.LITERAL, value: str.substring(1)} :
                {type: TYPE.REFERENCE, named: false, value: parseInt(str.substring(1), 10)};
        } else {
            return {type: TYPE.LITERAL, value: str.replace(/^\\/, '')};
        }
    }

    #compileQuantifier(token, stack, min, max) {
        let top = stack.length - 1, value;

        if (stack[top].type === TYPE.LITERAL && stack[top].value.length > 1) {
            let chars = Array.from(stack[top].value);
            value = {type: TYPE.LITERAL, value: chars.pop()};
            stack[top].value = chars.join('');
        } else {
            value = stack.pop();
        }

        return {type: TYPE.QUANTIFIER, min: min, max: max, greedy: token !== '?', value: value};
    }

    #expandRanges(charset) {
        let subCharset = [];

        for (let i = 0; i < charset.value.length; i++) {
            let value = charset.value[i];
            if (value.type === TYPE.SPECIAL) {
                subCharset = subCharset.concat(value.ranges);
            } else if (value.type === TYPE.RANGE) {
                subCharset.push(value.value);
            } else {
                subCharset.push([value.value, value.value]);
            }
        }

        if (this.ignoreCase) {
            let otherCaseCharset = this.#otherCaseRanges(subCharset);
            subCharset = subCharset.concat(otherCaseCharset);
        }

        if (charset.not) {
            let superCharset = this.#specialRanges('.');
            subCharset = this.#subtractRanges(superCharset, subCharset);
        }

        return subCharset;
    }

    #otherCaseRanges(ranges) {
        let otherCase = [];

        for (let [start, end] of ranges) {
            let startCode = start.codePointAt(0);
            let endCode = end.codePointAt(0);
            let startOther = -1;
            let endOther = -1;

            for (let i = startCode; i <= endCode; i++) {
                let char = String.fromCodePoint(i);
                if (char.toUpperCase() !== char.toLowerCase()) {
                    let charOther = char.toUpperCase() === char ? char.toLowerCase() : char.toUpperCase();
                    if (startOther === -1) {
                        startOther = charOther;
                    }
                    endOther = charOther;
                } else if (startOther !== -1) {
                    otherCase.push([startOther, endOther]);
                    startOther = -1;
                }
            }

            if (startOther !== -1) {
                otherCase.push([startOther, endOther]);
            }
        }

        return otherCase;
    }

    #subtractRanges(superset, subset) {
        let result = [];

        subset.sort(([a], [b]) => a.codePointAt(0) - b.codePointAt(0));

        for (let [superStart, superEnd] of superset) {
            let superRange = [superStart.codePointAt(0), superEnd.codePointAt(0)];

            for (let [subStart, subEnd] of subset) {
                let subRange = [subStart.codePointAt(0), subEnd.codePointAt(0)];

                if (subRange[0] <= superRange[0] && superRange[0] <= subRange[1]) {
                    superRange[0] = subRange[1] + 1;
                } else if (superRange[0] <= subRange[0] && subRange[0] <= superRange[1]) {
                    result.push([String.fromCodePoint(superRange[0]), String.fromCodePoint(subRange[0] - 1)]);
                    superRange[0] = subRange[1] + 1;
                }
            }

            if (superRange[0] <= superRange[1]) {
                result.push([String.fromCodePoint(superRange[0]), String.fromCodePoint(superRange[1])]);
            }
        }

        return result;
    }

    #specialRanges(special) {
        if (this.#specials[special] instanceof RegExp) {
            this.#specials[special] = this.#compile(this.#specials[special]).value[0].ranges;
        }

        return this.#specials[special];
    }

    #generate(node, groups) {
        let value, i, n;

        switch (node.type) {
        case TYPE.ROOT:
        case TYPE.GROUP:
            let stack = node.alternate ? node.value[MockExp.randomInt(0, node.value.length - 1)] : node.value;

            value = '';
            for (i = 0; i < stack.length; i++) {
                value += this.#generate(stack[i], groups);
            }

            if (node.capture) {
                groups[node.reference] = value;
                if (node.name) {
                    groups[node.name] = value;
                }
            }

            if (node.negativeLookahead || node.negativeLookbehind) {
                return '';
            } else {
                return value;
            }

        case TYPE.CHARSET:
        case TYPE.SPECIAL:
            if (node.ranges.length > 0) {
                let range = node.ranges[MockExp.randomInt(0, node.ranges.length - 1)];
                return String.fromCodePoint(MockExp.randomInt(range[0].codePointAt(0), range[1].codePointAt(0)));
            } else {
                return '';
            }

        case TYPE.LITERAL:
            if (this.ignoreCase) {
                //let chars = node.value.split('');
                //let chars = [...node.value];
                let chars = Array.from(node.value);
                for (i = 0; i < chars.length; i++) {
                    chars[i] = MockExp.randomInt(0, 1) ? chars[i].toLowerCase() : chars[i].toUpperCase();
                }
                return chars.join('');
            } else {
                return node.value;
            }

        case TYPE.REFERENCE:
            return groups[node.value] || '';

        case TYPE.QUANTIFIER:
            if (node.greedy) {
                n = MockExp.randomInt(node.min, node.max === Infinity ? node.min + MockExp.maxRepetition : node.max);
            } else {
                n = MockExp.randomInt(node.min, node.min);
            }

            value = '';
            for (i = 0; i < n; i++) {
                value += this.#generate(node.value, groups);
            }

            return value;

        case TYPE.EXPRESSION:
            if (MockExp.expressions[node.value]) {
                if (MockExp.expressions[node.value] instanceof RegExp) {
                    MockExp.expressions[node.value] = new MockExp(MockExp.expressions[node.value]);
                }

                if (MockExp.expressions[node.value] instanceof MockExp) {
                    return MockExp.expressions[node.value].generate();
                } else if (typeof MockExp.expressions[node.value] === 'function') {
                    return MockExp.expressions[node.value]();
                }
            }

            return `x{${node.value}}`;
        }
    }

    /**
     * Monkey-patches the RegExp prototype to add the new generate method.
     */
    static install() {
        RegExp.prototype.generate = function () {
            return new MockExp(this).generate();
        };
    }

    /**
     * Generates random integers between min and max (inclusive). Override to control the randomness behavior.
     * @param {number} min Minimum integer
     * @param {number} max Maximum integer
     * @returns {number} Random integer between min and max (inclusive)
     */
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Custom RegExp charset to generate from for the dot "." and negated charset "[^...]". If not set, the default is either "[\u0020-\u007E]" without the "u" flag or "[\u0020-\uFFFD]" with the "u" flag.
     * @type {RegExp} Custom RegExp charset
     */
    static charset = undefined;

    /**
     * Controls the maximum repetition limit of quantifiers with no upper-limit (added to the lower-limit).
     * @type {number} Maximum repetition limit
     */
    static maxRepetition = 10;

    /**
     * Controls the maximum failed attempts to generate a random string matching the RegExp pattern.
     * @type {number} Maximum failed generation attempts
     */
    static maxAttempts = 1000;

    /**
     * Custom unicode classes to generate from for `\p{...}` and `\P{...}` syntax.
     * @type {Object.<string, RegExp>} Key-value pairs of unicode class names and RegExp patterns
     */
    static classes = {};

    /**
     * Custom expressions to generate from using the \x{...} syntax.
     * @type {Object.<string, (RegExp|MockExp|function(): string)>} Key-value pairs of expression names and patterns or functions
     */
    static expressions = {};
}
