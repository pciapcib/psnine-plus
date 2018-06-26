import gulp from 'gulp'
import loadPlugins from 'gulp-load-plugins'
import merge2 from 'merge2'
import rollup from 'rollup-stream'
import source from 'vinyl-source-stream'

import path from 'path'
import fs from 'fs'
import os from 'os'

import rollupConfig from './rollup.config'
import pkg from './package.json'

const $ = loadPlugins()
const src = './src'
const dest = './dist'
const chromeDest = `${dest}/chrome`
const firefoxDest = `${dest}/firefox`

gulp.task('clean', () => {
  return pipe(dest, $.clean())
})

gulp.task('dev', cb => {
  $.runSequence('clean', 'scripts', 'styles', 'pages', 'chrome', 'firefox', cb)
})

gulp.task('build', cb => {
  $.runSequence('clean', 'scripts', 'styles', 'pages', 'chrome', 'opera', 'firefox', cb)
})

// development
gulp.task('default', ['dev'], () => {
  gulp.watch(['./src/**/*', './package.json'], ['dev'])
})

// production
gulp.task('dist', ['build'], cb => {
  $.runSequence('chrome:crx', 'chrome:zip', 'firefox:zip', 'opera:nex', 'psnine-plus:crx', cb)
})

gulp.task('scripts', () => {
  return merge2(
    rollup(rollupConfig('./src/psnine-plus.js')).on('error', $.util.log)
      .pipe(source('psnine-plus.js'))
      .pipe(gulp.dest(dest)),
    rollup(rollupConfig(`${src}/background.js`)).on('error', $.util.log)
      .pipe(source('background.js'))
      .pipe(gulp.dest(dest)),
    rollup(rollupConfig('./src/popup/popup.js')).on('error', $.util.log)
      .pipe(source('popup/popup.js'))
      .pipe(gulp.dest(dest))
  )
})

gulp.task('styles', () => {
  return pipe(`${src}/**/*.styl`, $.plumber(), $.stylus(), $.postcss(), dest)
})

gulp.task('pages', () => {
  return pipe(`${src}/**/*.pug`, $.plumber(), $.pug(), dest)
})

// Chrome
gulp.task('chrome', () => {
  return merge2(
    pipe(`${dest}/psnine-plus.js`, chromeDest),
    pipe(`${dest}/psnine-plus.css`, chromeDest),

    pipe(`${dest}/background.js`, chromeDest),

    pipe(copyPopup(), `${chromeDest}/popup`),
    pipe(copyIcons(), `${chromeDest}/icons`),
    pipe(copyAssets(), chromeDest),

    pipe(
      `${src}/config/chrome/manifest.json`,
      $.replace('__VERSION__', getVersion()),
      $.replace('__DESC__', getDesc()),
      chromeDest
    )
  )
})

gulp.task('chrome:zip', () => {
  return pipe(`${chromeDest}/**/*`, $.zip('chrome.zip'), dest)
})

gulp.task('chrome:crx', () => {
  const privateKeyPath = path.join(os.homedir(), '.ssh/chrome.pem')
  const privateKey = fs.readFileSync(privateKeyPath)

  return pipe(chromeDest, $.crxPack({
    filename: 'chrome.crx',
    privateKey
  }), dest)
})

// Firefox
gulp.task('firefox', () => {
  return merge2(
    pipe(`${dest}/psnine-plus.js`, firefoxDest),
    pipe(`${dest}/psnine-plus.css`, firefoxDest),

    pipe(`${dest}/background.js`, firefoxDest),

    pipe(copyPopup(), `${firefoxDest}/popup`),
    pipe(copyIcons(), `${firefoxDest}/icons`),
    pipe(copyAssets(), firefoxDest),

    pipe(
      `${src}/config/firefox/manifest.json`,
      $.replace('__VERSION__', getVersion()),
      $.replace('__DESC__', getDesc()),
      $.replace('__ADDON_ID__', getAddonId()),
      firefoxDest
    )
  )
})

gulp.task('firefox:zip', () => {
  return pipe(`${firefoxDest}/**/*`, $.zip('firefox.zip'), dest)
})

// Oprea
gulp.task('opera', ['chrome'], () => {
  return pipe('./src/chrome/**/*', './src/opera')
})

gulp.task('opera:nex', () => {
  return pipe('./dist/chrome.crx', $.rename('opera.nex'), './dist')
})

// Psnine Plus:crx
gulp.task('psnine-plus:crx', () => {
  return pipe('./dist/chrome.crx', $.rename('psnine-plus.crx'), './dist')
})

// Helpers
function copyAssets () {
  return [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/tooltipster/dist/js/tooltipster.bundle.min.js',
    './node_modules/tooltipster/dist/css/tooltipster.bundle.min.css',
    './node_modules/preact/dist/preact.min.js'
  ]
}

function copyIcons () {
  return './icons/**/*'
}

function copyPopup () {
  return `${dest}/popup/**/*`
}

function getVersion () {
  return pkg.version
}

function getDesc () {
  return pkg.description
}

function getAddonId () {
  const addonIdPath = path.join(os.homedir(), '.psnine-plus.firefox-addon-id')
  const addonId = fs.readFileSync(addonIdPath)

  return addonId
}

function pipe (src, ...transforms) {
  return transforms.reduce((stream, transform) => {
    const isDest = typeof transform === 'string'
    return stream.pipe(isDest ? gulp.dest(transform) : transform)
  }, src.pipe ? src : gulp.src(src))
}
