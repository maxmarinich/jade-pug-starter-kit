'use strict';

var gulp = require('gulp'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    autoPrefixer = require('gulp-autoprefixer'),
    imageMin = require('gulp-imagemin'),
    imageMinMozJpeg = require('imagemin-mozjpeg'),
    newer = require('gulp-newer'),
    plumber = require('gulp-plumber'),
    prettify = require('gulp-html-prettify'),
    browserSync = require('browser-sync').create(),
    htmlRoot = '/html';

gulp.task('images', function () {
    gulp.src(['./assets/i/*.png', './assets/i/*.gif', './assets/i/*.svg'])
        .pipe(plumber())
        .pipe(newer('./public/assets/i/'))
        .pipe(imageMin({
            progressive: true,
            interlaced: true,
            svgoPlugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}]
        }))
        .pipe(gulp.dest('./public/assets/i/'));
});

gulp.task('mozJpeg', function () {
    gulp.src('./assets/i/*.jpg')
        .pipe(plumber())
        .pipe(newer('./public/assets/i/'))
        .pipe(imageMinMozJpeg({quality: 95})())
        .pipe(gulp.dest('./public/assets/i/'));
});

gulp.task('sass', function () {
    gulp.src('./assets/sass/common.sass')
        .pipe(plumber())
        .pipe(sourceMaps.init())
        .pipe(sass({
          compiler: require('node-sass'),
          outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoPrefixer({
            browsers: ['> 1%', 'last 4 versions', 'Firefox ESR', 'Opera 12.1'],
            cascade: false
        }))
        .pipe(sourceMaps.write('.'))
        .pipe(gulp.dest('./public/assets/css'));
});

gulp.task('jade', function () {
    gulp.src('./assets/template/*.jade')
        .pipe(plumber())
        .pipe(jade({
            pretty: true
        }))
        .pipe(prettify({indent_char: ' ', indent_size: 4}))
        .pipe(gulp.dest('./public' + htmlRoot));
});

gulp.task('scripts', function () {
    gulp.src('./assets/js/**/*.js')
        .pipe(plumber())
        .pipe(newer('./assets/js/**/*'))
        .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('fonts', function () {
    gulp.src('./assets/fonts/**/*')
        .pipe(plumber())
        .pipe(newer('./assets/fonts/**/*'))
        .pipe(gulp.dest('./public/assets/fonts'));
});

gulp.task('bs', function () {
    browserSync.init({
        server: './public',
        directory: true,
        open: false,
        notification: false,
        reloadOnRestart: false,
        ghostMode: true,
        startPath: 'html/index.html'
    });
    browserSync.watch('./public/**/*.*').on('change', browserSync.reload);
});

gulp.task('watch', function () {
    gulp.watch(['./assets/sass/**/*.sass'], ['sass']);
    gulp.watch('./assets/template/**/*.jade', ['jade']);
    gulp.watch('./assets/js/**/*.js', ['scripts']);
    gulp.watch(['./assets/i/*.png', './assets/i/*.gif', './assets/i/*.svg'], ['images']);
    gulp.watch('./assets/i/*.jpg', ['mozJpeg']);
    gulp.watch('./assets/fonts/**/*', ['fonts']);
});

gulp.task('build', ['sass', 'jade', 'scripts', 'images', 'mozJpeg', 'fonts']);
gulp.task('default', ['build', 'watch', 'bs']);
