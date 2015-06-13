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

var gulp        = require('gulp'),
	$           = require('gulp-load-plugins')(),
	jpegoptim   = require('imagemin-jpegoptim'),
	pngquant    = require('imagemin-pngquant'),
	optipng     = require('imagemin-optipng'),
	svgo        = require('imagemin-svgo'),
	browserSync = require('browser-sync'),
	reload      = browserSync.reload,
	runSequence = require('run-sequence'),
	fs          = require('fs'),
	rootPath    = __dirname.replace("/_source", ""),
	sources     = {
		html:            rootPath + '/**/*.html',
		php:             rootPath + '/**/*.php',
		ect:             ['ect/**/*.ect', '!ect/**/_*.ect'],
		scss:            ['scss/**/*.scss', '!scss/_temp/**/*.scss'],
		scssDir:         'scss/',
		css:             ['css/**/*.css', '!css/**/*.min.css'],
		cssDir:          'css/',
		cssDestDir:      '../assets/css/',
		img:             'img/**/*.+(jpg|jpeg|png|gif|svg)',
		imgDestDir:      '../assets/img/',
		font:            ['font/**/*', '!font/icon/**/*'],
		js:              ['js/**/*.js', '!js/**/*.min.js'],
		jsCopy:          'js/**/*.js',
		jsSrcDir:        'js/',
		jsDestDir:       '../assets/js/',
		jsLib:           [
			'bower_components/fastclick/lib/fastclick.js',
			'bower_components/modernizr/modernizr.js',
			// 'bower_components/foundation/js/foundation/foundation.js',
			'bower_components/shufflejs/dist/jquery.shuffle.min.js',
			'bower_components/slick-carousel/slick/slick.min.js',
			'bower_components/jQuery.mmenu/dist/js/jquery.mmenu.min.js',
			'js/jquery.heightLine.min.js',
		],
		jsIE:            [
			'bower_components/html5shiv/dist/html5shiv.min.js',
			'bower_components/nwmatcher/src/nwmatcher.js',
			'bower_components/selectivizr/selectivizr.js',
			'bower_components/respond/dest/respond.min.js',
			'bower_components/REM-unit-polyfill/js/rem.min.js'
		]
	},
	iconFontName = 'VisuAliveWebStarterIcon';

/*************************
 ******  HTML build ******
 *************************/
gulp.task("ect", function(){
	var json = JSON.parse(fs.readFileSync("ect.json"));

	return gulp.src(sources.ect)
		.pipe($.plumber())
		.pipe($.ect({data: function(filename, cb){
			console.log(filename);
			cb(json);
		}}))
		.pipe($.compressor({
			'preserve-line-breaks': true,
			'remove-intertag-spaces': true,
			'preserve-server-script': true,
			'preserve-php': true
		}))
		.pipe($.prettify({
			indent_size: 4,
		}))
		.pipe(gulp.dest(rootPath));
});

/**************************
 ******  Scss build  ******
 **************************/
gulp.task('scss', function(){
	return gulp.src(sources.scss)
		.pipe($.plumber())
		.pipe($.compass({
			config_file: 'config.rb',
			comments:     false,
			css:          sources.cssDestDir,
			sass:         sources.scssDir
		}))
		.pipe($.pleeease({
			autoprefixer: {browsers: ['last 4 versions']},
			opacity: true,
			filters: { 'oldIE': true },
			rem: ["16px", {replace: true}],
			mqpacker: true,
			import: true,
			pseudoElements: true,
			sourcemaps: false,
			next: false,
			minifier: false
		}))
		.pipe($.csscomb())
		.pipe(gulp.dest(sources.cssDestDir))
		.pipe($.rename({
			suffix: '.min',
			extname: '.css'
		}))
		.pipe($.pleeease({
			autoprefixer: false,
			minifier: true
		}))
		.pipe(gulp.dest(sources.cssDestDir))
		.pipe(reload({stream: true}));
});

/****************************
 ******  JS optimaize  ******
 ****************************/
gulp.task('js', function(){
	return gulp.src(sources.js)
		.pipe($.plumber())
		.pipe($.rename({suffix: '.min'}))
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe(gulp.dest(sources.jsDestDir))
		.pipe(reload({stream: true, once: true}));
});
gulp.task('jsLib', function(){
	return gulp.src(sources.jsLib)
		.pipe($.plumber())
		.pipe($.concat('libs.js'))
		.pipe(gulp.dest(sources.jsSrcDir))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe(gulp.dest(sources.jsDestDir))
		.pipe(reload({stream: true, once: true}));
});
gulp.task('jsIE', function(){
	return gulp.src(sources.jsIE)
		.pipe($.plumber())
		.pipe($.concat('ie.js'))
		.pipe(gulp.dest(sources.jsSrcDir))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.uglify({preserveComments: 'some'}))
		.pipe(gulp.dest(sources.jsDestDir))
		.pipe(reload({stream: true, once: true}));
});
gulp.task('jsCopy', function(){
	return gulp.src(sources.jsCopy)
		.pipe($.plumber())
		.pipe(gulp.dest(sources.jsDestDir));
});

/****************************
 ******  IMG optimaize ******
 ****************************/
gulp.task("img", function(){
	return gulp.src(sources.img)
		.pipe($.plumber())
		.pipe($.cache($.imagemin({
			use: [
				optipng({optimizationLevel: 3}),
				pngquant({quality: '65-80', speed: 4}),
				jpegoptim({max: 70}),
				svgo()
			]
		})))
		.pipe(gulp.dest(sources.imgDestDir))
		.pipe(reload({stream: true, once: true}));
});
// Not cache.
gulp.task("imgBuild", function(){
	return gulp.src(sources.img)
		.pipe($.plumber())
		.pipe($.imagemin({
			use: [
				optipng({optimizationLevel: 3}),
				pngquant({quality: '65-80', speed: 4}),
				jpegoptim({max: 70}),
				svgo()
			]
		}))
		.pipe(gulp.dest(sources.imgDestDir))
		.pipe(reload({stream: true, once: true}));
});

/*******************
 ******  Font ******
 *******************/
gulp.task('font', function(){
	return gulp.src(sources.font)
		.pipe($.plumber())
		.pipe(gulp.dest(sources.fontDestDir))
		.pipe(reload({stream: true, once: true}));
});

/****************************
 ******  Browser sync  ******
 ****************************/
gulp.task('browserSync', function() {
	return browserSync.init(null, {
		server: {
			baseDir: rootPath + '/'
		},
		notify: false
	});
});
gulp.task('browserSyncReload', function() {
	return reload();
});

/***************************
 ******  Cache clear  ******
 ***************************/
gulp.task('clear', function ( i_done ) {
	return $.cache.clearAll( i_done );
});

/********************
 ******  Clean  *****
 ********************/
gulp.task('clean', $.shell.task(
	[
		'rm -rf ' + rootPath + '/*.html',
		'rm -rf ' + rootPath + '/assets/css/*',
		'rm -rf ' + rootPath + '/assets/js/*',
		'rm -rf ' + rootPath + '/assets/img/*',
		'rm -rf ' + rootPath + '/assets/font/*'
	]
));

/*********************
 ******  Delete  *****
 *********************/
gulp.task('delete', $.shell.task(
	[
		'rm -rf ' + rootPath + '/*.ect',
		'rm -rf ' + rootPath + '/**/*/.gitkeep',
		'rm -rf ' + rootPath + '/_source/.sass-cache/'
	]
));

/*********************
 ******  Build  ******
 *********************/
gulp.task('build', function(){
	return runSequence('clear', 'clean', ['ect', 'scss', 'js', 'jsLib', 'jsIE', 'imgBuild', 'font'], 'jsCopy', 'clear', 'delete' );
});

/*********************
 ******  Watch  ******
 *********************/
gulp.task('watch', function(){
	gulp.watch(['ect/**/*.ect','ect.json'], ['ect']);
	gulp.watch(sources.scss, ['scss']);
	gulp.watch(sources.js, ['js']);
	gulp.watch(sources.img, ['img']);
	gulp.watch(sources.font, ['font']);
	gulp.watch(sources.html, ['browserSyncReload']);
	gulp.watch(sources.php, ['browserSyncReload']);
});

/****************************
 ******  Default task  ******
 ****************************/
gulp.task('default', function(){
	return runSequence('clear', 'clean', ['ect', 'scss', 'js', 'jsLib', 'jsIE', 'imgBuild', 'font'], 'jsCopy', 'browserSync', 'watch');
});
