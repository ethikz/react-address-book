var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    deploy = require('gulp-gh-pages'),
    plugin = require('gulp-load-plugins')({ camelize: true });


// Paths
// =======================================================

var paths = {
  jade: 'app/**/*.jade',
  icons: 'app/fonts/svg/*.svg',
  scss: 'app/css/**/*.scss',
  js: 'app/javascript/**/*.js',
  images: 'app/img/**'
};


// HTML
// =======================================================

gulp.task('html', function() {
  return gulp.src(paths.jade)
    .pipe(plugin.jade())
    .pipe(gulp.dest('build'))
    .pipe(plugin.connect.reload());
});


// Icon Fonts
// =======================================================

gulp.task('iconfont', function() {
  return gulp.src(paths.icons)
    .pipe(plugin.svgmin())
    .pipe(plugin.iconfontCss({
      fontName: 'icon-font',
      path: 'app/fonts/_icon-font.scss',
      targetPath: '../../app/css/generated/_icon-font.scss',
      fontPath: '../fonts/'
    }))
    .pipe(plugin.iconfont({
      fontName: 'icon-font',
      normalize: true
    }))
    .pipe(gulp.dest('build/fonts/'));
});

gulp.task('copyfonts', function() {
  return gulp.src(['app/fonts/*.*', '!app/fonts/svg/', '!app/fonts/*.scss'])
    .pipe(gulp.dest('build/fonts/'));
});



// CSS
// =======================================================

gulp.task('css', ['iconfont'], function() {
  return gulp.src([
    paths.scss,
    'app/css/partials/cart.css'
  ])
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

gulp.task('browserify', ['javascript'], function() {
  return gulp.src('app/javascript/app.js')
    .pipe(plugin.browserify({
      transform: ['reactify', 'babelify']
    }))
    .pipe(plugin.rename('compiled.js'))
    // .pipe(plugin.uglify())
    .pipe(plugin.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/javascript/'));
});

gulp.task('javascript', function() {
  return gulp.src(paths.js)
    .pipe(plugin.react({
      harmony: true,
      es6module: true
    }))
    .pipe(plugin.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/javascript/'));
});

gulp.task('json', function() {
  return gulp.src('app/javascript/api/*')
    .pipe(gulp.dest('build/javascript/api/'));
});


// Images
// =======================================================

gulp.task('optimizeImages', function() {
  return gulp.src(paths.images)
    .pipe(plugin.newer('build/img'))
    .pipe(plugin.imagemin())
    .pipe(gulp.dest('app/img/'));
});

gulp.task('cleanImages', ['optimizeImages'], function() {
  return gulp.src('build/img')
    .pipe(plugin.clean());
});

gulp.task('copyImages', ['cleanImages'], function() {
  return gulp.src(paths.images)
    .pipe(gulp.dest('build/img'));
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
  gulp.watch(paths.icons, ['css']);
  gulp.watch([paths.scss, '!app/css/generated/_icon-font.scss'], ['css']);
  gulp.watch(paths.js, ['browserify', 'javascript']);
  gulp.watch('app/javascript/api/*', ['json']);
  gulp.watch(paths.images, ['copyImages']);
});


// Server
// =======================================================

gulp.task('connect', function() {
  plugin.connect.server({
    root: 'build',
    port: '8003',
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
gulp.task('compile', ['copyfonts', 'html', 'css', 'browserify', 'copyImages', 'json']);
