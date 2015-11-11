/**
 * VisuAlive Web Starter.
 *
 * @package   VisuAlive Web Starter.
 * @author    KUCKLU.
 * @copyright Copyright (c) KUCKLU and VisuAlive.
 * @link      http://visualive.jp/
 * @license   Dual licensed under the MIT License or GNU General Public License v2.0 ( or later ).
 */
"use strict";

var gulp              = require('gulp'),
    $                 = require('gulp-load-plugins')(),
    browserSync       = require('browser-sync'),
    browserSyncReload = browserSync.reload,
    runSequence       = require('run-sequence'),
    fs                = require('fs'),
    path              = require('path'),
    rootPath          = __dirname,
    sourcePath        = __dirname + '/_source',
    assetsPath        = __dirname + '/assets',
    sources           = {
        ect  : {
            conf : rootPath + '/.ect.json',
            files: [sourcePath + '/ect/**/*.ect', '!' + sourcePath + '/ect/**/_*.ect']
        },
        scss : {
            tmp  : sourcePath + '/.tmp/scss',
            dir  : sourcePath + '/scss/',
            files: sourcePath + '/scss/**/*.scss',
            dest : assetsPath + '/css/'
        },
        js   : {
            tmp  : sourcePath + '/.tmp/js',
            dir  : sourcePath + '/js/',
            files: [
                // rootPath + '/bower_components/jquery-legacy/dist/jquery.min.js',
                rootPath + '/bower_components/fastclick/lib/fastclick.js',
                rootPath + '/bower_components/modernizr/modernizr.js',
                //'bower_components/foundation/js/foundation/foundation.js',
                //'bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js',
                //'bower_components/shufflejs/dist/jquery.shuffle.min.js',
                rootPath + '/bower_components/slick-carousel/slick/slick.min.js',
                //'bower_components/jquery.stellar/jquery.stellar.min.js',
                //'bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js',
                sourcePath + '/js/**/*.js'
            ],
            ie   : [
                rootPath + '/bower_components/html5shiv/dist/html5shiv.min.js',
                rootPath + '/bower_components/nwmatcher/src/nwmatcher.js',
                rootPath + '/bower_components/selectivizr/selectivizr.js',
                rootPath + '/bower_components/respond/dest/respond.min.js',
                rootPath + '/bower_components/REM-unit-polyfill/js/rem.min.js'
            ],
            dest : assetsPath + '/js/'
        },
        img  : {
            files: [sourcePath + '/img/**/*.{jpg,jpeg,gif,png}'],
            dest : assetsPath + '/img/'
        },
        font : {
            files: [sourcePath + '/font/**/*'],
            dest : assetsPath + '/font/'
        },
        copy : {
            js : [
                rootPath + '/bower_components/jquery-legacy/dist/jquery.min.js'
            ],
        }
    };

gulp.watching = false;


/*************************
 ******  HTML compile  ***
 *************************/
gulp.task('ect', function () {
    var json = JSON.parse(fs.readFileSync(sources.ect.conf));

    return gulp.src(sources.ect.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.ect({
            data: function (filename, cb) {
                cb(json);
            }
        }))
        .pipe($.compressor({
            'preserve-line-breaks'  : true,
            'remove-intertag-spaces': true,
            'preserve-server-script': true,
            'preserve-php'          : true
        }))
        .pipe($.prettify({
            indent_size: 4
        }))
        .pipe(gulp.dest(rootPath))
        .pipe($.size({title: 'HTML', showFiles: true}))
        .pipe(browserSyncReload({stream: true}));
});


/**************************
 ******  Scss compile  ****
 **************************/
gulp.task('scss', function () {
    return gulp.src(sources.scss.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.scss.tmp))
        .pipe($.sass({
            style          : 'compressed',
            bundleExec     : true,
            require        : ['bourbon', 'neat'],
            precision      : 10,
            includePaths   : __dirname + '/bower_components/foundation/scss/',
            errLogToConsole: true
        }))
        .pipe($.pixrem({
            rootValue: '100%',
            replace: true
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions', 'ie 8', 'ie 9'],
            cascade: false
        }))
        .pipe($.csscomb())
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe($.size({title: 'Style'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.cssmin())
        .pipe($.size({title: 'Style:min'}))
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe(browserSyncReload({stream: true}));
});


/************************
 ******  JS compile  ****
 ************************/
gulp.task('js', function () {
    return gulp.src(sources.js.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.js.tmp))
        .pipe($.concat('apps.js'))
        .pipe($.crLfReplace({changeCode: 'LF'}))
        .pipe(gulp.dest(sources.js.tmp))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.size({title: 'js'}))
        .pipe(gulp.dest(sources.js.dest))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('js:ie', function () {
    return gulp.src(sources.js.ie)
        .pipe($.cached('js:ie'))
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat('ie.js'))
        .pipe($.crLfReplace({changeCode: 'LF'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe($.remember('js:ie'))
        .pipe(gulp.dest(sources.js.dest))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('js:copy', function () {
    return gulp.src(sources.copy.js)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest(sources.js.dest));
});


/****************************
 ******  Browser sync  ******
 ****************************/
gulp.task('browserSync', function () {
    return browserSync.init(null, {
        server: {
            baseDir: rootPath + '/'
        },
        notify: false
    });
});
gulp.task('browserSyncReload', function () {
    return browserSyncReload();
});


/***************************
 ******  Cache clear  ******
 ***************************/
gulp.task('clear', function () {
    return $.cached.caches = {};
});


/********************
 ******  Clean  *****
 ********************/
gulp.task('clean', $.shell.task(
    [
        'rm -rf ' + rootPath   + '/*.html',
        'rm -rf ' + rootPath   + '/*.zip',
        'rm -rf ' + rootPath   + '/archive/',
        'rm -rf ' + assetsPath + '/css/*',
        'rm -rf ' + assetsPath + '/js/*',
        'rm -rf ' + assetsPath + '/img/*',
        'rm -rf ' + assetsPath + '/font/*',
        'rm -rf ' + sourcePath + '/.tmp/'
    ]
));


/*********************
 ******  Delete  *****
 *********************/
gulp.task('delete', $.shell.task(
    [
        'rm -rf ' + rootPath + '/*.ect',
        'rm -rf ' + rootPath + '/**/*/.gitkeep',
        'rm -rf ' + rootPath + '/.sass-cache/',
        'rm -rf ' + sourcePath + '/.tmp/'
    ]
));


/*********************
 ******  Watch  ******
 *********************/
gulp.task('setWatch', function() {
    global.isWatching = true;
});
gulp.task('watch', function () {
    this.watching = true;
    gulp.watch([sourcePath + '/ect/**/*.ect', sources.ect.conf], ['ect']);
    gulp.watch(sources.scss.files, ['scss']);
    gulp.watch(sources.js.files, ['js']);
});


/****************************
 ******  Default task  ******
 ****************************/
gulp.task('default', ['clear','clean'], function (cb) {
    return runSequence(['ect', 'scss', 'js', 'js:ie', 'js:copy'], 'browserSync', 'watch', cb);
});
