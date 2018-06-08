import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import merge2 from 'merge2'
import rollup from 'rollup-stream'
import source from 'vinyl-source-stream'

import pkg from './package.json'

const $ = loadPlugins()

function pipe (src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string'
    return stream.pipe(isDest ? gulp.dest(transform) : transform)
  }, gulp.src(src))
}

gulp.task('clean', () => {
  return pipe('./dist', $.clean())
})

gulp.task('build', () => {
  // $.runSequence('clean', 'styles', 'chrome', 'opera', 'safari', 'firefox', cb)
  // $.runSequence('clean', 'chrome')
  gulp.start('chrome')
})

gulp.task('default', ['build'], () => {
  gulp.watch(['./libs/**/*', './src/**/*', './package.json'], ['build'])
})

gulp.task('dist', ['build'], cb => {
  $.runSequence('firefox:zip', 'chrome:zip', 'chrome:crx', 'opera:nex', cb)
})

gulp.task('chrome', () => {
  return merge2(
    pipe('./icons/**/*', './dist/chrome/icons'),
    rollup('rollup.config.js').pipe(source('psnine-plus.js')).pipe(gulp.dest('./dist/chrome/')),
    pipe('./node_modules/jquery/dist/jquery.min.js', './dist/chrome/'),
    pipe('./src/config/chrome/background.js', $.babel(), './dist/chrome/'),
    pipe('./src/config/chrome/manifest.json', $.replace('__VERSION__', pkg.version), './dist/chrome/')
  )
})
