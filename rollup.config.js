/* eslint-disable global-require */
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const formats = ['cjs', 'umd', 'es'];
const entryFile = 'src/index.ts';
const packageName = 'nash-js';

export default {
  input: entryFile,
  output: [
    ...formats.map((format) => ({
      name: packageName,
      file: `dist/${format}/${packageName}.js`,
      format,
    })),
    ...formats.map((format) => ({
      name: packageName,
      file: `dist/${format}/${packageName}.min.js`,
      format,
      plugins: [terser()],
    })),
  ],
  plugins: [
    typescript({
      typescript: require('typescript'),
      exclude: ['tests/*'],
    }),
    resolve({
      jsnext: true,
      main: false,
    }),
  ],
};

//   // declaration
//   {
//     input: entryFile,
//     output: {
//       dir: 'dist/typings',
//     },
//     plugins: [
//       typescript({
//         emitDeclarationOnly: true,
//         declaration: true,
//         outDir: 'dist/typings',
//         target: 'es5',
//         rootDir: 'src',
//         composite: true,
//         exclude: ['tests/*'],
//         include: ['src/**/*'],
//       }),
//     ],
//     external: (id) => pkgdependencies.includes(id),
//   },
// ];
