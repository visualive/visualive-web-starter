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

var gulp              = require("gulp"),
    $                 = require("gulp-load-plugins")(),
    pngquant          = require("imagemin-pngquant"),
    jpegoptim         = require("imagemin-jpegoptim"),
    svgo              = require("imagemin-svgo"),
    browserSync       = require("browser-sync"),
    browserSyncReload = browserSync.reload,
    runSequence       = require("run-sequence"),
    fs                = require("fs"),
    path              = require("path"),
    rootPath          = __dirname,
    pablicPath        = "_public_html",
    sourcePath        = "_source",
    assetsPath        = "_public_html/assets",
    sources           = {
        ect     : {
            conf : rootPath + "/.ect.json",
            files: [sourcePath + "/ect/**/*.ect", "!" + sourcePath + "/ect/**/_*.ect"],
            dest : pablicPath + "/"
        },
        scss    : {
            tmp  : sourcePath + "/.tmp/scss",
            dir  : sourcePath + "/scss/",
            files: sourcePath + "/scss/**/*.scss",
            dest : assetsPath + "/css/"
        },
        js      : {
            tmp  : sourcePath + "/.tmp/js",
            dir  : sourcePath + "/js/",
            files: [
                // "bower_components/jquery-legacy/dist/jquery.min.js",
                "bower_components/fastclick/lib/fastclick.js",
                "bower_components/modernizr/modernizr.js",
                "bower_components/foundation/js/foundation/foundation.js",
                "bower_components/foundation/js/foundation/foundation.offcanvas.js",
                //"bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js",
                //"bower_components/shufflejs/dist/jquery.shuffle.min.js",
                // "bower_components/slick-carousel/slick/slick.min.js",
                //"bower_components/jquery.stellar/jquery.stellar.min.js",
                //"bower_components/jquery.mb.ytplayer/dist/jquery.mb.YTPlayer.min.js",
                sourcePath + "/js/**/*.js"
            ],
            ie   : [
                rootPath + "/bower_components/html5shiv/dist/html5shiv.min.js",
                rootPath + "/bower_components/nwmatcher/src/nwmatcher.js",
                rootPath + "/bower_components/selectivizr/selectivizr.js",
                rootPath + "/bower_components/respond/dest/respond.min.js",
                rootPath + "/bower_components/REM-unit-polyfill/js/rem.min.js"
            ],
            hint : [
                sourcePath + "/js/**/*.js",
                "!" + sourcePath + "/js/**/*.min.js"
            ],
            dest : assetsPath + "/js/"
        },
        img     : {
            files: sourcePath + "/img/**/*",
            dest : assetsPath + "/img/"
        },
        font    : {
            files: sourcePath + "/font/**/*",
            dest : assetsPath + "/font/"
        },
        copy    : {
            js : [
                rootPath + "/bower_components/jquery-legacy/dist/jquery.min.js"
            ],
        },
        archive : {
            files: pablicPath + "/**",
            dest : rootPath + "/"
        }
    };


/**************************
 *****  HTML compile  *****
 **************************/
gulp.task("ect", function () {
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
            "preserve-line-breaks"  : true,
            "remove-intertag-spaces": true,
            "preserve-server-script": true,
            "preserve-php"          : true
        }))
        .pipe($.prettify({
            indent_size: 4
        }))
        .pipe(gulp.dest(sources.ect.dest))
        .pipe($.size({title: "HTML", showFiles: true}))
        .pipe(browserSyncReload({stream: true}));
});


/**************************
 *****  Scss compile  *****
 **************************/
gulp.task("scss", function () {
    return gulp.src(sources.scss.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.scss.tmp))
        .pipe($.sass({
            outputStyle    : "expanded",
            precision      : 10,
            includePaths   : ["bower_components/foundation/scss/"],
            errLogToConsole: true
        }))
        .pipe($.pixrem({
            rootValue: "100%",
            replace: true
        }))
        .pipe($.autoprefixer({
            browsers: ["last 2 versions", "ie 8", "ie 9"],
            cascade: false
        }))
        .pipe($.csscomb())
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe($.size({title: "Style"}))
        .pipe($.rename({suffix: ".min"}))
        .pipe($.cssmin())
        .pipe($.size({title: "Style:min"}))
        .pipe(gulp.dest(sources.scss.tmp))
        .pipe(gulp.dest(sources.scss.dest))
        .pipe(browserSyncReload({stream: true}));
});


/*************************
 *****  JS optimize  *****
 *************************/
gulp.task("js", ["js:hint"], function () {
    return gulp.src(sources.js.files)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.newer(sources.js.tmp))
        .pipe($.concat("apps.js"))
        .pipe($.crLfReplace({changeCode: "LF"}))
        .pipe(gulp.dest(sources.js.tmp))
        .pipe(gulp.dest(sources.js.dest))
        .pipe($.rename({suffix: ".min"}))
        .pipe($.uglify({preserveComments: "some"}))
        .pipe($.size({title: "js"}))
        .pipe(gulp.dest(sources.js.dest))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task("js:ie", function () {
    return gulp.src(sources.js.ie)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.concat("ie.js"))
        .pipe($.crLfReplace({changeCode: "LF"}))
        .pipe($.rename({suffix: ".min"}))
        .pipe($.uglify({preserveComments: "some"}))
        .pipe(gulp.dest(sources.js.dest));
});

gulp.task("js:copy", function () {
    return gulp.src(sources.copy.js)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe(gulp.dest(sources.js.dest));
});

gulp.task("js:hint", function () {
    return gulp.src(sources.js.hint)
        .pipe($.plumber({
            errorHandler: $.notify.onError("Error: <%= error.message %>")
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'));
});


/**************************
 *****  Img optimize  *****
 **************************/
gulp.task("img", function () {
    return gulp.src(sources.img.files)
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced : true,
            use        : [
                pngquant({
                    quality: "60-70",
                    speed  : 5
                }),
                jpegoptim({
                    max        : 75,
                    progressive: true
                }),
                svgo()
            ]
        })))
        .pipe(gulp.dest(sources.img.dest))
        .pipe($.size({title: "img"}))
        .pipe(browserSyncReload({stream: true}));
});


/**********************
 *****  Archives  *****
 **********************/
gulp.task("archive", function () {
    return gulp.src(sources.archive.files, {base: "."})
        .pipe($.zip("archive.zip"))
        .pipe(gulp.dest(rootPath + "/"));
});


/**************************
 *****  Browser sync  *****
 **************************/
gulp.task("browserSync", function () {
    return browserSync.init(null, {
        server: {
            baseDir: pablicPath + "/"
        },
        notify: false
    });
});
gulp.task("browserSyncReload", function () {
    return browserSyncReload();
});


/*************************
 *****  Cache clear  *****
 *************************/
gulp.task("clear", function () {
    return $.cache.clearAll();
});


/*******************
 *****  Clean  *****
 *******************/
gulp.task("clean", $.shell.task(
    [
        "rm -rf " + rootPath + "/*.zip",
        "rm -rf " + rootPath + "/archives/",
        "rm -rf " + rootPath + "/" + pablicPath + "/*.ect",
        "rm -rf " + rootPath + "/" + pablicPath + "/*.html",
        "rm -rf " + rootPath + "/" + assetsPath + "/**/*/.gitkeep",
        "rm -rf " + rootPath + "/" + assetsPath + "/css/*",
        "rm -rf " + rootPath + "/" + assetsPath + "/js/*",
        "rm -rf " + rootPath + "/" + assetsPath + "/img/*",
        "rm -rf " + rootPath + "/" + assetsPath + "/font/*",
        "rm -rf " + rootPath + "/" + sourcePath + "/.tmp/"
    ]
));


/*******************
 *****  Watch  *****
 *******************/
gulp.task("watch", function () {
    $.watch([sourcePath + "/ect/**/*.ect", sources.ect.conf], function () {
        return gulp.start(["ect"]);
    });
    $.watch(sources.scss.files, function () {
        return gulp.start(["scss"]);
    });
    $.watch(sources.js.files, function () {
        return gulp.start(["js"]);
    });
    $.watch(sources.img.files, function () {
        return gulp.start(["img"]);
    });
});


/********************
 *****  Supply  *****
 ********************/
gulp.task("supply", ["clear","clean"], function (cb) {
    return runSequence(["ect", "scss", "js", "js:ie", "js:copy", "img"], "archive", cb);
});


/**************************
 *****  Default task  *****
 **************************/
gulp.task("default", ["clear","clean"], function (cb) {
    return runSequence(["ect", "scss", "js", "js:ie", "js:copy", "img"], "browserSync", "watch", cb);
});
