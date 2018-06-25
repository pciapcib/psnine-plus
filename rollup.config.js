const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const babel = require('rollup-plugin-babel')
const { uglify } = require('rollup-plugin-uglify')

module.exports = input => {
  const rollupConfig = {
    input,
    format: 'iife',
    external: [
      'preact'
    ],
    globals: {
      preact: 'preact'
    },
    plugins: [
      babel({
        presets: [
          ['env', { modules: false }],
          'stage-0',
          'react'
        ],
        'plugins': [
          'transform-class-properties',
          'transform-decorators-legacy',
          'transform-object-rest-spread',
          ['transform-react-jsx', { pragma: 'h' }],
          'ramda'
        ],
        babelrc: false,
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs()
    ]
  }

  if (process.env.NODE_ENV === 'production') {
    rollupConfig.plugins.push(uglify())
  }

  return rollupConfig
}
