var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var pug = require('gulp-pug');
var browserSync = require('browser-sync').create();

//
gulp.task('bwt-less', function() {
	return gulp.src('./node_modules/bootstrap/less/**/*.less')
	.pipe(gulp.dest('./app/less/bootstrap/'));
});
gulp.task('bwt-js', function() {
	return gulp.src('./node_modules/bootstrap/dist/js/bootstrap.min.js')
	.pipe(gulp.dest('./app/js/bootstrap/'));
});
gulp.task('bwt-fonts', function() {
	return gulp.src('./node_modules/bootstrap/fonts/*.*')
	.pipe(gulp.dest('./app/fonts/bootstrap/'));
});

gulp.task('views', function buildHTML() {
	return gulp.src('./app/source/*.pug')
	.pipe(plumber())
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('./app'))
	.pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src('./app/less/*.less')
    .pipe(plumber())
	.pipe(less())
    .pipe(gulp.dest('./app/css/'))
    .pipe(browserSync.stream());
});

gulp.task('update-bwt', ['bwt-less', 'bwt-js', 'bwt-fonts'], function () {
    console.log("\n [>] Integrated Bootstrap DONE ^.^\n");
});

gulp.task('dev',['views', 'styles'], function() {
	browserSync.init({
		server: "./app/"
	});

    gulp.watch('./app/source/**/*.pug', ['views']);
    gulp.watch('./app/less/**/*.less', ['styles']);
    gulp.watch(".app/*.html").on('change', browserSync.reload);
});
