const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')

module.exports = {
  input: './src/psnine-plus.js',
  format: 'iife',
  globals: {
    jquery: '$'
  },
  plugins: [
    commonjs(),
    resolve(),
    babel({
      presets: [
        ['env', { modules: false }],
        'stage-0'
      ],
      'plugins': [
        'transform-runtime',
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'ramda'
      ],
      babelrc: false,
      exclude: 'node_modules/**',
      runtimeHelpers: true
    })
  ]
}
