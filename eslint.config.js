export default [
    {
        ignores: ['lib/**/*', 'dist/**/*', 'bin/**/*', 'docs/**/*', 'node_modules/**/*', 'coverage/**/*']
    },
    {
        rules: {
            'semi': ['error'],
            'no-extra-semi': ['warn'],
            'space-before-function-paren': ['warn', {'anonymous': 'always', 'named': 'never', 'asyncArrow': 'always'}],
            'indent': ['warn', 4],
            'no-unused-vars': ['warn'],
            'no-extra-parens': ['warn', 'all', {'ternaryOperandBinaryExpressions': false}],
            'quotes': ['warn', 'single', {'allowTemplateLiterals': true}],
            'curly': ['warn'],
            'eqeqeq': ['warn', 'smart'],
            'eol-last': ['warn', 'always'],
            'no-trailing-spaces': ['warn'],
            'no-multiple-empty-lines': ['warn', {'max': 1, 'maxEOF': 1, 'maxBOF': 0}],
            'lines-between-class-members': ['warn', 'always', {'exceptAfterSingleLine': true}],
            'keyword-spacing': ['warn'],
            'brace-style': ['warn', '1tbs'],
            'object-curly-spacing': ['warn', 'never'],
            'array-bracket-spacing': ['warn', 'never']
        }
    },
];
