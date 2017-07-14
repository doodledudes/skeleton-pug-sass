var gulp            = require('gulp');
var clean           = require('gulp-clean');
var pug             = require('gulp-pug');
var sass            = require('gulp-sass');
var browserSync     = require('browser-sync').create();
var autoprefixer    = require('gulp-autoprefixer');
var exec            = require('child_process').exec;
var imagemin        = require('gulp-imagemin');
var mainBowerFiles  = require('main-bower-files');
var wiredep         = require('wiredep').stream;
// @phil
var debug = require('gulp-debug');
var changed = require('gulp-changed');
var gutil = require('gulp-util');

var root  = './';
var dir   = 'public'; // you may change this.

var paths = {
    // This must be in the right order, so linked files are processed first.
    pug: ['includes/**/*.pug', 'assets/vendor/**/*.pug', 'layout/**/*.pug', 'partials/**/*.pug', './*.pug', '!**/_*.pug', '!node_modules/**/*'],
    scss: 'assets/css/**/*.scss',
    js: 'assets/scripts/**/*.js'
}

// -----------------------------------------------------------------------------[ Runs the 'clean' task first before it run all other tasks. ]
gulp.task('default', ['clean'], function(cb) {
    exec('gulp main', function(err,stdout,stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
gulp.task('main', ['pug-all', 'sass', 'js', 'copy', 'bower', 'imagemin']);

// -----------------------------------------------------------------------------[ Compile PUG files to HTML ]
gulp.task('pug-all', function() {
    /*
    * Compile ALL pug files except files with
    * file names that starts with an underscore('_').
    */
    return gulp.src(paths.pug)
    // Convert the pug files to html files
    .pipe(pug({
        doctype: 'html',
        pretty: true
    }))
    // @phil
    // Handle ug errors nicely
    .on('error', function(err){
        gutil.log(err.message);
        this.emit('end'); // prevents watch from dying
    })
    // Write a message
    .pipe(debug({title:'Installed'}))
    // Place the resultant HTML file into the destination directory.
    .pipe(gulp.dest(root + dir))
    // Refresh the page in the browser
    .pipe(browserSync.stream());
});

// @phil
gulp.task('pug-incremental', (done) => {

    var dest = root + dir;
    gulp.src(paths.pug)
    // Look for files newer than the corresponding .html
    // file in the destination directory.
    .pipe(changed(dest, {extension: '.html'}))
    // Convert the pug files to html files
    .pipe(pug({
        doctype: 'html',
        pretty: true
    }))
    // Handle ug errors nicely
    .on('error', function(err){
        gutil.log(err.message);
        this.emit('end'); // prevents watch from dying
    })
    // Write a message
    .pipe(debug({title:'Installed'}))
    // Place the resultant HTML file into the destination directory.
    .pipe(gulp.dest(dest))
    // Refresh the page in the browser
    .pipe(browserSync.stream());

    done();

});
gulp.task('watch', () => {
    gulp.watch(paths.pug,['pug-incremental']);
});


// -----------------------------------------------------------------------------[ Compile JS files ]
gulp.task('js', function() {
    return gulp.src(paths.js)
    // .pipe(browserify())
    // .pipe(uglify())
    .pipe(gulp.dest(root + dir + '/assets/scripts'))
    .pipe(browserSync.stream());;
});

// -----------------------------------------------------------------------------[ Compile SASS files to CSS ]
gulp.task('sass', function() {
    return gulp.src(paths.scss)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(root + dir + '/assets/css'))
    .pipe(browserSync.stream());
});

// -----------------------------------------------------------------------------[ Copy assets (css, images, scripts, etc...) ]
var assetsBaseDir = "./assets";
var assets = [
    assetsBaseDir + '/css/**/*.css',
    assetsBaseDir + '/vendor/bootstrap/dist/**/*.*',
    assetsBaseDir + '/vendor/authservice/**/*.*',
    assetsBaseDir + '/app/**/*.*',
    assetsBaseDir + '/fonts/**/*.*'
];
gulp.task('copy', function () {
    gulp.src(assets, { base: './' })
        .pipe(gulp.dest(root + dir));
});

// -----------------------------------------------------------------------------[ Copy plugins from bower ]
gulp.task("bower-css", ['bower-js'], function() {
    return gulp.src(mainBowerFiles('**/*.{eot,svg,ttf,woff,woff2,css}'), { base:  './bower_components' })
    .pipe(gulp.dest(root + dir + '/bower_components'));
});
gulp.task("bower-js", function() {
    return gulp.src(mainBowerFiles(['**/*.js']), { base:  './bower_components' })
    .pipe(gulp.dest(root + dir + '/bower_components'));
});
gulp.task('bower', ['bower-css', 'pug-all'], function () {
  gulp.src(root + dir + '/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(root + dir));
});

// -----------------------------------------------------------------------------[ Clean task (deletes the public folder) ]
gulp.task('clean', function() {
    return gulp.src(root + dir, { read: false })
    .pipe(clean({force: true})); // added the 'force' option because the
    // directory is outside the gulpfile.js's
    // root folder
});

// -----------------------------------------------------------------------------[ Serve app and watch ]
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: root + dir
        },
        port: 3030,
        //reloadDelay: 200 // Give the server time to pick up the new files.
    });
    // @phil
    console.log('')
    console.log('Please note that "serve" compiles and installs changed')
    console.log('pugs, but not other pugs that are dependant upon them.')
    console.log('To force compile every pug, use "gulp serve-all".');
    console.log('')
    console.log('')
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.js, ['js']);
    //    gulp.watch('./**/*.pug',['pug-watch']);
    gulp.watch(paths.pug,['pug-incremental']);
});

// @phil
gulp.task('serve-all', function() {
    browserSync.init({
        server: {
            baseDir: root + dir
        },
        port: 3030,
        //reloadDelay: 200 // Give the server time to pick up the new files.
    });
    console.log('')
    console.log('Please note that "serve-all" compiles and installs')
    console.log('ALL pugs, so is quite slow. To only compile changed')
    console.log('pugs, use "gulp serve".');
    console.log('')
    console.log('')
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.js, ['js']);
    //    gulp.watch('./**/*.pug',['pug-watch']);
    gulp.watch(paths.pug,['pug-all']);
});

// -----------------------------------------------------------------------------[ Optimize Images ]
gulp.task('imagemin', () =>
    gulp.src('./assets/images/*')
        .pipe(imagemin(
          {
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{removeViewBox: true}]
          }
        ))
        .pipe(gulp.dest(root + dir + '/assets/images'))
);
