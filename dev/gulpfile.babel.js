'use script';

import path from 'path';
import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import swPrecache from 'sw-precache';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;


// Paths configuration
var pathsConfig = function() {
  this.dir = __dirname;

  this.root = path.join(this.dir, PATH_ROOT);

  this.app_dir =    path.join(this.root, 'apps', app_name);
  this.static_dir = path.join(this.app_dir, 'static', app_name);

  return {
    templates:          path.join(this.app_dir, 'templates'),
    templates_includes: path.join(this.app_dir, 'templates', app_name, 'includes'),

    css:          path.join(this.static_dir, '/css'),
    sass:         path.join(this.static_dir, '/sass'),
    images:       path.join(this.static_dir, '/i'),
    js:           path.join(this.static_dir, '/js'),
    sprites:      path.join(this.static_dir, '/i/sprites'),
    sprites_svg:  path.join(this.static_dir, '/i/sprites-svg')
  };
};


// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'apps/static/sass/main.scss'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Concatenate and minify styles
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(browserSync.stream({match: '*.css'}));
});