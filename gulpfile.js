var gulp          = require('gulp');
var clean         = require('gulp-clean');
var pug           = require('gulp-pug');
var sass          = require('gulp-sass');
var browserSync   = require('browser-sync').create();
var autoprefixer  = require('gulp-autoprefixer');
var exec          = require('child_process').exec;

var root  = './';
var dir   = 'public'; // you may change this.
var paths = {
  pug: ['./*.pug', '!**[^_]/*.pug'],
  scss: 'assets/css/**/*.scss',
  js: 'assets/scripts/**/*.js'
}

// - ###########################################################################
// - Runs the 'clean' task first before it run all other tasks.
// - ###########################################################################
gulp.task('default', ['clean'], function(cb) {
    exec('gulp main', function(err,stdout,stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
gulp.task('main', ['pug', 'sass', 'js', 'copy', 'bower']);

// - ###########################################################################
// - Compile PUG files to HTML
// - ###########################################################################
gulp.task('pug', function() {
    /*
     * Compile all pug files except files with
     * file names that starts with an underscore('_').
     */
    return gulp.src(paths.pug)
      .pipe(pug({
          doctype: 'html',
          pretty: true
      }))
      .pipe(gulp.dest(root + dir));
});
gulp.task('pug-watch', ['pug'], function (done) {
    browserSync.reload();
    done();
});

// - ###########################################################################
// - Compile JS files
// - ###########################################################################
gulp.task('js', function() {
    return gulp.src(paths.js)
      .pipe(gulp.dest(root + dir + '/assets/scripts'))
      .pipe(browserSync.stream());;
});

// - ###########################################################################
// - Compile SASS files to CSS
// - ###########################################################################
gulp.task('sass', function() {
    return gulp.src(paths.scss)
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(gulp.dest(root + dir + '/assets/css'))
      .pipe(browserSync.stream());
});

// - ###########################################################################
// - Copy assets (css, images, scripts, etc...)
// - ###########################################################################
var assetsBaseDir = "./assets";
var assets = [
    assetsBaseDir + '/css/**/*.css',
    assetsBaseDir + '/images/**/*.*',
    assetsBaseDir + '/vendor/bootstrap/dist/**/*.*',
    assetsBaseDir + '/fonts/**/*.*'
];
gulp.task('copy', function() {
    gulp.src(assets, { base: './'})
        .pipe(gulp.dest(root + dir));
});

// - ###########################################################################
// - Copy plugins from bower
// - ###########################################################################
var bowerBaseDir = "./bower_components";
var bower = [
    bowerBaseDir + '/bootstrap/dist/**/*.*',
    bowerBaseDir + '/jquery/dist/**/*.*',
    bowerBaseDir + '/font-awesome/**/*.*',
    '!' + bowerBaseDir + '/font-awesome/scss/**', // Exclude 'scss' folder
    '!' + bowerBaseDir + '/font-awesome/less/**', // Exclude 'less' folder
    '!' + bowerBaseDir + '/font-awesome/*.json', // Exclude '.json' files
    '!' + bowerBaseDir + '/font-awesome/*.txt' // Exclude '.txt' files
];
gulp.task('bower', function() {
    gulp.src(bower, { base: './'})
        .pipe(gulp.dest(root + dir));
});

// - ###########################################################################
// - Clean task (deletes the public folder)
// - ###########################################################################
gulp.task('clean', function() {
    return gulp.src(root + dir, { read: false })
        .pipe(clean({force: true}));
});

// - ###########################################################################
// - Serve app and watch
// - ###########################################################################
gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: root + dir
    }
  });
  gulp.watch(paths.scss, ['sass']);
  gulp.watch(paths.js, ['js']);
  gulp.watch('./**/*.pug',['pug-watch']);
});
