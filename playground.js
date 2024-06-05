import MockExp from './src/index.js';
MockExp.install();

MockExp.classes['Letter'] = /[A-Za-z]/;
for (let i = 0; i < 100; i++) {
    console.log(/[^\P{Letter}]+/u.generate());
}
