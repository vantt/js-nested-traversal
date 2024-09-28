// rollup.config.mjs
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/NestedTraversal.js',

  output: [
    {
      file: 'dist/bundled.cjs.js',
      format: 'cjs',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: 'dist/bundled.esm.js',
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    },
  ],
  plugins: [resolve(), commonjs()]
};