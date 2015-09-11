var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    deploy = require('gulp-gh-pages'),
    plugin = require('gulp-load-plugins')({ camelize: true });


// Paths
// =======================================================

var paths = {
  jade: 'app/**/*.jade',
  scss: 'app/css/**/*.scss',
  js: 'app/javascript/**/*.js'
};


// HTML
// =======================================================

gulp.task('html', function() {
  return gulp.src(paths.jade)
    .pipe(plugin.jade())
    .pipe(gulp.dest('build'))
    .pipe(plugin.connect.reload());
});


// CSS
// =======================================================

gulp.task('css', function() {
  return gulp.src(paths.scss)
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.sass())
    .pipe(plugin.autoprefixer("last 2 versions"))
    .pipe(plugin.minifyCss())
    .pipe(plugin.sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(plugin.connect.reload())
    .on('error', plugin.util.log);
});


// JS
// =======================================================

gulp.task('javascript', function() {
  return gulp.src(paths.js)
    .pipe(plugin.sourcemaps.init())
    .pipe(plugin.concat('scripts.min.js'))
    .pipe(plugin.uglify())
    .pipe(plugin.sourcemaps.write('.'))
    .pipe(gulp.dest('build/javascript/'));
});

gulp.task('json', function() {
  return gulp.src('app/javascript/api/*')
    .pipe(gulp.dest('build/javascript/api/'));
});


// Utilities
// =======================================================

gulp.task('clean', function() {
  return gulp.src(['build/**/*'], {
    read: false
  })
  .pipe(plugin.clean());
});

gulp.task('build', function() {
  runSequence(['compile']);
});


// Watch
// =======================================================

gulp.task('watch', ['build'], function() {
  gulp.watch(paths.jade, ['html']);
  gulp.watch(paths.scss, ['css']);
  gulp.watch(paths.js, ['javascript']);
  gulp.watch('app/javascript/api/*', ['json']);
});


// Server
// =======================================================

gulp.task('connect', function() {
  plugin.connect.server({
    root: 'build',
    port: '8002',
    livereload: true
  });
});


// Deploy
// =======================================================

gulp.task('deploy', function () {
  gulp.src('./build/**/*')
    .pipe(deploy('https://github.com/ethikz/react-address-book', 'origin'));
});


// Tasks
// =======================================================

gulp.task('default', ['watch', 'connect']);
gulp.task('compile', ['html', 'css', 'javascript', 'json']);
