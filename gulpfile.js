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

var gulp            = require('gulp'),
    $               = require('gulp-load-plugins')(),
    //imageresize     = require('gulp-image-resize'),
    pngquant        = require('imagemin-pngquant'),
    jpegoptim       = require('imagemin-jpegoptim'),
    svgo            = require('imagemin-svgo'),
    crLf            = require('gulp-cr-lf-replace'),
    sassInheritance = require('gulp-sass-inheritance'),
    browserSync     = require('browser-sync'),
    runSequence     = require('run-sequence'),
    fs              = require('fs'),
    rootPath        = __dirname,
    sourcePath      = __dirname + '/_source',
    assetsPath      = __dirname + '/assets',
    settings        = {
        ect: "settings.ect.json",
        img: {
            "pngQuality"    : "60-70",
            "pngSpeed"      : 5,
            "jpgQuality"    : 70,
            "jpgProgressive": true,
            "gifInterlaced" : true
        }
    },
    sources         = {
        html   : rootPath + '/**/*.html',
        php    : rootPath + '/**/*.php',
        ect    : [sourcePath + '/ect/**/*.ect', '!' + sourcePath + '/ect/**/_*.ect'],
        scss   : [sourcePath + '/scss/**/*.scss'],
        scssDir: sourcePath + '/scss/',
        css    : [assetsPath + '/css/**/*.css', '!' + assetsPath + '/css/**/*.min.css'],
        cssDir : assetsPath + '/css/',
        img    : sourcePath + '/img/**/*',
        imgDir : assetsPath + '/img/',
        font   : sourcePath + '/font/**/*',
        fontDir: assetsPath + '/font/',
        js     : [
            'bower_components/fastclick/lib/fastclick.js',
            'bower_components/modernizr/modernizr.js',
            //'bower_components/foundation/js/foundation/foundation.js',
            //'bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js',
            //'bower_components/shufflejs/dist/jquery.shuffle.min.js',
            'bower_components/slick-carousel/slick/slick.min.js',
            //'bower_components/jquery.stellar/jquery.stellar.min.js',
            //'bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js',
            sourcePath + '/js/apps.js'
        ],
        jsIE   : [
            'bower_components/html5shiv/dist/html5shiv.min.js',
            'bower_components/nwmatcher/src/nwmatcher.js',
            'bower_components/selectivizr/selectivizr.js',
            'bower_components/respond/dest/respond.min.js',
            'bower_components/REM-unit-polyfill/js/rem.min.js'
        ],
        jsCopy : [
            'bower_components/jquery-legacy/dist/jquery.min.js'
        ],
        jsDir  : assetsPath + '/js/'
    };

/*************************
 ******  HTML build ******
 *************************/
gulp.task('ect', function () {
    var json = JSON.parse(fs.readFileSync(settings.ect));

    return gulp.src(sources.ect)
        .pipe($.plumber())
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
        .pipe(gulp.dest(rootPath));
});

/**************************
 ******  Scss build  ******
 **************************/
gulp.task('scss', function () {
    return gulp.src(sources.scss)
        .pipe($.if(global.isWatching, $.cached('scss')))
        .pipe(sassInheritance({dir: sources.scssDir}))
        .pipe($.filter(function (file) {
            return !/\/_/.test(file.path) || !/^_/.test(file.relative);
        }))
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.sass({
            style          : 'compressed',
            bundleExec     : true,
            require        : ['bourbon', 'neat'],
            includePaths   : __dirname + '/bower_components/foundation/scss/',
            errLogToConsole: true
        }))
        .pipe($.pleeease({
            autoprefixer  : {browsers: ['last 2 versions', 'ie 8', 'ie 9']},
            opacity       : true,
            filters       : {'oldIE': true},
            rem           : ["16px", {replace: true}],
            mqpacker      : true,
            import        : true,
            pseudoElements: true,
            sourcemaps    : false,
            next          : false,
            minifier      : false
        }))
        .pipe(gulp.dest(sources.cssDir));
});

/*****************************
 ******  CSS optimaize  ******
 *****************************/
gulp.task('css', function () {
    return gulp.src(sources.css)
        .pipe($.csscomb())
        .pipe(gulp.dest(sources.cssDir))
        .pipe($.rename({
            suffix : '.min',
            extname: '.css'
        }))
        .pipe($.cssmin())
        .pipe(gulp.dest(sources.cssDir))
        .pipe(browserSync.reload({stream: true}));
});

/****************************
 ******  JS optimaize  ******
 ****************************/
gulp.task('js', function () {
    return gulp.src(sources.js)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat('apps.js'))
        .pipe(crLf({changeCode: 'LF'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(sources.jsDir))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('jsIE', function () {
    return gulp.src(sources.jsIE)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat('ie.js'))
        .pipe(crLf({changeCode: 'LF'}))
        .pipe($.rename({suffix: '.min'}))
        .pipe($.uglify({preserveComments: 'some'}))
        .pipe(gulp.dest(sources.jsDir))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('jsCopy', function () {
    return gulp.src(sources.jsCopy)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest(sources.jsDir));
});

/****************************
 ******  IMG optimaize ******
 ****************************/
gulp.task("img", function () {
    return gulp.src(sources.img)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.cached('image'))
        .pipe($.imagemin({
            interlaced: settings.img.gifInterlaced,
            use       : [
                pngquant({
                    quality: settings.img.pngQuality,
                    speed  : settings.img.pngSpeed
                }),
                jpegoptim({
                    max        : settings.img.jpgQuality,
                    progressive: settings.img.jpgProgressive
                }),
                svgo()
            ]
        }))
        .pipe(gulp.dest(sources.imgDir))
        .pipe(browserSync.reload({stream: true}));
});

/*******************
 ******  Font ******
 *******************/
gulp.task('font', function () {
    return gulp.src(sources.font)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest(sources.fontDir))
        .pipe(browserSync.reload({stream: true, once: true}));
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
    return browserSync.reload();
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
        'rm -rf ' + rootPath + '/*.html',
        'rm -rf ' + assetsPath + '/css/*',
        'rm -rf ' + assetsPath + '/js/*',
        'rm -rf ' + assetsPath + '/img/*',
        'rm -rf ' + assetsPath + '/font/*'
    ]
));

/*********************
 ******  Delete  *****
 *********************/
gulp.task('delete', $.shell.task(
    [
        'rm -rf ' + rootPath + '/*.ect',
        'rm -rf ' + rootPath + '/**/*/.gitkeep',
        'rm -rf ' + rootPath + '/.sass-cache/'
    ]
));

/*********************
 ******  Watch  ******
 *********************/
gulp.task('watch', function () {
    gulp.watch([sourcePath + '/ect/**/*.ect', settings.ect], ['ect']);
    gulp.watch(sources.scss, ['scss']);
    gulp.watch(sources.css, ['css']);
    gulp.watch(sources.js, ['js']);
    gulp.watch(sources.img, ['img']);
    gulp.watch(sources.font, ['font']);
    gulp.watch(sources.html, ['browserSyncReload']);
    gulp.watch(sources.php, ['browserSyncReload']);
});

/*********************
 ******  Build  ******
 *********************/
gulp.task('build', function () {
    runSequence('clear');
    return runSequence('clean', ['ect', 'scss', 'js', 'jsIE', 'jsCopy', 'font'], 'css', 'delete', 'clear');
});

/****************************
 ******  Default task  ******
 ****************************/
gulp.task('default', function () {
    runSequence('clear');
    return runSequence('clean', ['ect', 'scss', 'js', 'jsIE', 'jsCopy', 'img', 'font'], 'css', 'delete', 'browserSync', 'watch');
});
