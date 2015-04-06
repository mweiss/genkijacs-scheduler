'use strict';

var browserify = require('browserify');
var gulp = require('gulp');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');

/*
// TODO: I need to set up gulp watch tasks
gulp.task('javascript', function () {
  // set up the browserify instance on a task basis
  var b = browserify({debug: true});
  // transform regular node stream to gulp (buffered vinyl) stream
  var browserified = transform(function(filename) {
    b.add(filename);
    return b.bundle();
  });

  return gulp.src('./js/app.js')
    .pipe(browserified)
    .pipe(sourcemaps.init({loadMaps: true}))
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./js/bundle.js'));
});
*/

gulp.task('css', function () {
  gulp.src('./css/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest('./css'))
});

