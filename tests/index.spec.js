import patterns from './fixtures/patterns.js';

import Module from 'node:module';
const require = Module.createRequire(import.meta.url);
beforeAll(async () => {
    if (process.env.TARGET === 'src') {
        global.MockExp = (await import('../src/index.js')).default;
    } else if (process.env.TARGET === 'esm') {
        global.MockExp = (await import('../lib/index.js')).default;
    } else if (process.env.TARGET === 'cjs') {
        global.MockExp = require('../lib/index.cjs').default;
    }

    MockExp.maxAttempts = 10;
});

const times = 100;

describe('MockExp(...)', () => {
    it('accepts RegExp pattern', () => {
        expect(new MockExp(/A{5}/).generate()).toBe('AAAAA');
    });

    it('accepts string pattern', () => {
        expect(new MockExp('A{5}').generate()).toBe('AAAAA');
    });

    it('throws a syntax error with invalid RegExp pattern', () => {
        expect(() => new MockExp('(abc')).toThrow(SyntaxError);
    });

    it('respects ignore case flag', () => {
        expect(new MockExp(/A{100}/i).ignoreCase).toBe(true);
        expect(new MockExp(/A{100}/, 'i').ignoreCase).toBe(true);
        expect(new MockExp('A{100}', 'i').ignoreCase).toBe(true);

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/A{100}/i).generate();
            expect(/A{100}/i.test(value)).toBe(true);
        }

        for (let i = 0; i < times; i++) {
            let value = new MockExp('A{100}', 'i').generate();
            expect(/A{100}/i.test(value)).toBe(true);
        }
    });

    it('respects the global flag', () => {
        expect(new MockExp(/.{100}/g).global).toBe(true);
        expect(new MockExp(/.{100}/, 'g').global).toBe(true);
        expect(new MockExp('.{100}', 'g').global).toBe(true);
    });

    it('respects the multiline flag', () => {
        expect(new MockExp(/.{100}/m).multiline).toBe(true);
        expect(new MockExp(/.{100}/, 'm').multiline).toBe(true);
        expect(new MockExp('.{100}', 'm').multiline).toBe(true);
    });

    it('respects the single line flag', () => {
        expect(new MockExp(/.{100}/s).dotAll).toBe(true);
        expect(new MockExp(/.{100}/, 's').dotAll).toBe(true);
        expect(new MockExp('.{100}', 's').dotAll).toBe(true);
    });

    it('respects the unicode flag', () => {
        expect(new MockExp(/.{100}/u).unicode).toBe(true);
        expect(new MockExp(/.{100}/, 'u').unicode).toBe(true);
        expect(new MockExp('.{100}', 'u').unicode).toBe(true);

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{100}/u).generate();
            expect(/^[\u0020-\uFFFD]{100}$/.test(value)).toBe(true);
        }

        for (let i = 0; i < times; i++) {
            let value = new MockExp('.{100}', 'u').generate();
            expect(/^[\u0020-\uFFFD]{100}$/.test(value)).toBe(true);
        }
    });

    it('respects the sticky flag', () => {
        expect(new MockExp(/.{100}/y).sticky).toBe(true);
        expect(new MockExp(/.{100}/, 'y').sticky).toBe(true);
        expect(new MockExp('.{100}', 'y').sticky).toBe(true);
    });

    it('respects all flags', () => {
        let r = new MockExp(/.{100}/igmsuy);
        expect(r.ignoreCase).toBe(true);
        expect(r.global).toBe(true);
        expect(r.multiline).toBe(true);
        expect(r.dotAll).toBe(true);
        expect(r.unicode).toBe(true);
        expect(r.sticky).toBe(true);

        r = new MockExp('.{100}', 'igmsuy');
        expect(r.ignoreCase).toBe(true);
        expect(r.global).toBe(true);
        expect(r.multiline).toBe(true);
        expect(r.dotAll).toBe(true);
        expect(r.unicode).toBe(true);
        expect(r.sticky).toBe(true);

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{100}/u).generate();
            expect(/^[\u0020-\uFFFD]{100}$/.test(value)).toBe(true);
        }

        for (let i = 0; i < times; i++) {
            let value = new MockExp('.{100}', 'u').generate();
            expect(/^[\u0020-\uFFFD]{100}$/.test(value)).toBe(true);
        }
    });

    it('respects no flags', () => {
        let r = new MockExp(/.{100}/);
        expect(r.ignoreCase).toBe(false);
        expect(r.global).toBe(false);
        expect(r.multiline).toBe(false);
        expect(r.dotAll).toBe(false);
        expect(r.unicode).toBe(false);
        expect(r.sticky).toBe(false);

        r = new MockExp('.{100}');
        expect(r.ignoreCase).toBe(false);
        expect(r.global).toBe(false);
        expect(r.multiline).toBe(false);
        expect(r.dotAll).toBe(false);
        expect(r.unicode).toBe(false);

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{100}/).generate();
            expect(/^[\u0020-\u007e]{100}$/igmsuy.test(value)).toBe(true);
        }

        for (let i = 0; i < times; i++) {
            let value = new MockExp('.{100}').generate();
            expect(/^[\u0020-\u007e]{100}$/igmsuy.test(value)).toBe(true);
        }
    });
});

patterns.forEach(regexp => {
    describe(`MockExp(${regexp}).generate()`, () => {
        it(`matches the same pattern`, () => {
            for (let i = 0; i < times; i++) {
                let value = new MockExp(regexp).generate();
                expect(regexp.test(value)).toBe(true);
                //expect(value).toBe(value.match(regexp)[0]);
            }
        });
    });
});

describe(`MockExp(/\p{Letter}+/u).generate()`, () => {
    it(`throws an error for an unrecognized unicode category or script`, () => {
        expect(() => new MockExp(/\p{Letter}+/u).generate()).toThrow(Error);
    });

    it('matches the unicode class pattern when defined', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/\p{Letter}+/u).generate();
            expect(/^[a-zA-Z]+$/.test(value)).toBe(true);
        }

        delete MockExp.classes['Letter'];
    });

    it('ignores a unicode class when u flag is not set', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        let value = new MockExp(/\p{Letter}/).generate();
        expect(/^p{Letter}$/.test(value)).toBe(true);

        delete MockExp.classes['Letter'];
    });
});

describe(`MockExp(/\P{Letter}+/u).generate()`, () => {
    it(`throws an error for an unrecognized unicode category or script`, () => {
        expect(() => new MockExp(/\P{Letter}+/u).generate()).toThrow(Error);
    });

    it('matches the negated unicode class pattern when defined', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/\P{Letter}+/u).generate();
            expect(/^[^a-zA-Z]+$/.test(value)).toBe(true);
        }

        delete MockExp.classes['Letter'];
    });

    it('ignores a unicode class when u flag is not set', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        let value = new MockExp(/\P{Letter}/).generate();
        expect(/^P{Letter}$/.test(value)).toBe(true);

        delete MockExp.classes['Letter'];
    });
});

describe(`MockExp(/[\p{Letter}]+/u).generate()`, () => {
    it('matches the charset of unicode class pattern when defined', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/[\p{Letter}]+/u).generate();
            expect(/^[a-zA-Z]+$/.test(value)).toBe(true);
        }

        delete MockExp.classes['Letter'];
    });
});

describe(`MockExp(/[^\p{Letter}]+/u).generate()`, () => {
    it('matches the negated charset of unicode class pattern when defined', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/[^\p{Letter}]+/u).generate();
            expect(/^[^a-zA-Z]+$/.test(value)).toBe(true);
        }

        delete MockExp.classes['Letter'];
    });
});

describe(`MockExp(/[\P{Letter}]+/u).generate()`, () => {
    it('matches the charset of negated unicode class pattern when defined', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/[\P{Letter}]+/u).generate();
            expect(/^[^a-zA-Z]+$/.test(value)).toBe(true);
        }

        delete MockExp.classes['Letter'];
    });
});

describe(`MockExp(/[^\P{Letter}]+/u).generate()`, () => {
    it('matches the negated charset of negated unicode class pattern when defined', () => {
        MockExp.classes['Letter'] = /[a-zA-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/[^\P{Letter}]+/u).generate();
            expect(/^[a-zA-Z]+$/.test(value)).toBe(true);
        }

        delete MockExp.classes['Letter'];
    });
});

describe(`MockExp(/Email: \\x{email}/).generate()`, () => {
    it('matches using named RegExp expression', () => {
        MockExp.expressions['email'] = /[a-z][a-z0-9_]*@[a-z]+\.[a-z]{2,3}/i;

        let value = new MockExp(/Email: \x{email}/).generate();
        expect(/^Email: [a-zA-Z][a-zA-Z0-9_]*\@[a-zA-Z]+.[a-zA-Z]{2,3}$/.test(value)).toBe(true);
    });
});

describe(`MockExp(/First Name: (\\x{name}), Last Name: (\\x{name}), Full Name: \\1 \\2/).generate()`, () => {
    it('matches using named function expressions', () => {
        MockExp.expressions['name'] = () => {
            let names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Judy', 'Kevin', 'Linda', 'Mallory', 'Nancy', 'Oscar', 'Peggy', 'Romeo', 'Sybil', 'Trudy', 'Victor', 'Walter', 'Xavier', 'Yvonne', 'Zelda'];
            return names[Math.floor(Math.random() * names.length)];
        };

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/First Name: (\x{name}), Last Name: (\x{name}), Full Name: \1 \2/).generate();
            expect(/^First Name: ([A-Z][a-z]+), Last Name: ([A-Z][a-z]+), Full Name: \1 \2$/.test(value)).toBe(true);
        }
    });
});

describe(`MockExp(/People: (\\x{person}, )* \\x{person}/).generate()`, () => {
    it('matches using named MockExp expressions', () => {
        MockExp.expressions['person'] = new MockExp(/\x{name} \x{name}/);

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/People: (\x{person}, )* \x{person}/).generate();
            expect(/^People: ([A-Z][a-z]+ [A-Z][a-z]+, )* [A-Z][a-z]+ [A-Z][a-z]+$/.test(value)).toBe(true);
        }
    });
});

describe(`MockExp(/\\x{invalid}/).generate()`, () => {
    it('ignores a non-existing named expression', () => {
        let value = new MockExp(/\x{non_existing}/).generate();
        expect(/\x{non_existing}/.test(value)).toBe(true);
    });

    it('ignores a removed later named expression', () => {
        MockExp.expressions['removed_later'] = new MockExp(/will be removed/);

        let re = new MockExp(/\x{removed_later}/);

        delete MockExp.expressions['removed_later'];

        let value = re.generate();
        expect(/x{removed_later}/.test(value)).toBe(true);
    });

    it('ignores unsupported named expression', () => {
        MockExp.expressions['unsupported'] = true;

        let value = new MockExp(/\x{unsupported}/).generate();
        expect(/x{unsupported}/.test(value)).toBe(true);
    });
});

describe(`MockExp(/a^/).generate()`, () => {
    it(`throws an error for an impossible pattern`, () => {
        expect(() => new MockExp(/a^/).generate()).toThrow(Error);
    });
});

describe('MockExp.install()', () => {
    it('patches RegExp with the method random', () => {
        MockExp.install();
        expect(/a{3}/.generate).toBeDefined();
        expect(/a{3}/.test(/a{3}/.generate())).toBe(true);
        delete RegExp.prototype.generate;
    });

    it('generates valid random strings from patched RegExp', () => {
        MockExp.install();
        patterns.forEach(regexp => {
            expect(regexp.test(regexp.generate())).toBe(true);
        });
        delete RegExp.prototype.generate;
    });
});

describe('MockExp.maxRepetition = 5', () => {

    it('/.*/ generates a string with a length less than or equal 5', () => {
        MockExp.maxRepetition = 5;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.*/).generate();
            expect(value.length).toBeLessThanOrEqual(5);
        }

        MockExp.maxRepetition = 10;
    });

    it('/.{2}/ generates a string with the length 2', () => {
        MockExp.maxRepetition = 5;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{2}/).generate();
            expect(value.length).toEqual(2);
        }

        MockExp.maxRepetition = 10;
    });

    it('/.{15}/ generates a string with the length 15', () => {
        MockExp.maxRepetition = 5;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{15}/).generate();
            expect(value.length).toEqual(15);
        }

        MockExp.maxRepetition = 10;
    });

    it('/.{10,15}/ generates a string with a length between 2 and 7', () => {
        MockExp.maxRepetition = 5;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{10,15}/).generate();
            expect(value.length).toBeGreaterThanOrEqual(10);
            expect(value.length).toBeLessThanOrEqual(15);
        }

        MockExp.maxRepetition = 10;
    });

    it('/.{2,}/ generates a string with a length between 2 and 7', () => {
        MockExp.maxRepetition = 5;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{2,}/).generate();
            expect(value.length).toBeGreaterThanOrEqual(2);
            expect(value.length).toBeLessThanOrEqual(7);
        }

        MockExp.maxRepetition = 10;
    });

    it('/.{7,}/ generates a string with a length between 7 and 12', () => {
        MockExp.maxRepetition = 5;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.{7,}/).generate();
            expect(value.length).toBeGreaterThanOrEqual(7);
            expect(value.length).toBeLessThanOrEqual(12);
        }

        MockExp.maxRepetition = 10;
    });
});

describe('MockExp.charset = /[\\u0FAA-\\u0FFF]/', () => {
    it(`/.+/ generates string with within the charset range \\u0FAA-\\u0FFF`, () => {
        MockExp.charset = /[\u0FAA-\u0FFF]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.+/).generate();
            expect(/^[\u0FAA-\u0FFF]+$/.test(value)).toBe(true);
        }

        MockExp.charset = undefined;
    });
});

describe('MockExp.charset = /[A-Z]/', () => {
    it(`/.+/ generates string with within the charset range A-Z`, () => {
        MockExp.charset = /[A-Z]/;

        for (let i = 0; i < times; i++) {
            let value = new MockExp(/.+/).generate();
            expect(/^[A-Z]+$/.test(value)).toBe(true);
        }

        MockExp.charset = undefined;
    });

    it(`/[\W]+/ throws an error since the charset range is not sufficient`, () => {
        MockExp.charset = /[A-Z]/;

        expect(() => new MockExp(/[\W]+/).generate()).toThrow(Error);

        MockExp.charset = undefined;
    });

    it(`/\W+/ throws an error since the charset range is not sufficient`, () => {
        MockExp.charset = /[A-Z]/;

        expect(() => new MockExp(/\W+/).generate()).toThrow(Error);

        MockExp.charset = undefined;
    });
});
