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
        // .pipe($.minifyHtml())
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
        // .pipe($.minifyCss())
        .pipe($.size({title: 'Style:min'}))
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe(browserSyncReload({stream: true}));
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
});


/****************************
 ******  Default task  ******
 ****************************/
gulp.task('default', ['clear','clean'], function (cb) {
    return runSequence(['ect', 'scss'], 'browserSync', 'watch', cb);
});
