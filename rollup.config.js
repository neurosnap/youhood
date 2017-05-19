import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [
    commonjs(),
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
  dest: './public/bundle.js',
};
