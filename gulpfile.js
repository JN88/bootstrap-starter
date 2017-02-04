var gulp = require('gulp');
var plumber = require('gulp-plumber');
var less = require('gulp-less');
var pug = require('gulp-pug');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
const zip = require('gulp-zip');

/*=============================================
=            Update Bootstrap Core            =
=============================================*/

gulp.task('bwt-less', function() {
	return gulp.src('node_modules/bootstrap/less/**/*.less')
	.pipe(gulp.dest('app/less/bootstrap/'));
});
gulp.task('bwt-js', function() {
	return gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js')
	.pipe(gulp.dest('app/js/bootstrap/'));
});
gulp.task('bwt-fonts', function() {
	return gulp.src('node_modules/bootstrap/fonts/*.*')
	.pipe(gulp.dest('app/fonts/bootstrap/'));
});
gulp.task('font-awesome', function() {
    gulp.src('node_modules/font-awesome/fonts/**/*')
		.pipe(gulp.dest('app/fonts/font-awesome/'));
    gulp.src('node_modules/font-awesome/less/**/*')
        .pipe(gulp.dest('app/less/font-awesome/'));
});


/*----------  Task Update  ----------*/

gulp.task('update-bootstrap', ['bwt-less', 'bwt-js', 'bwt-fonts'], function () {
    console.log("\n [>] Integrated Bootstrap DONE ^.^ \n");
});

/*=====  End of Update Bootstrap Core  ======*/


/*====================================
=            Task for DEV            =
====================================*/

gulp.task('views', function buildHTML() {
	return gulp.src('app/source/*.pug')
	.pipe(plumber())
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.stream());
});

gulp.task('styles', function() {
    return gulp.src('app/less/*.less')
    .pipe(plumber())
	.pipe(less({
		sourceMap: {
			sourceMapRootpath: 'app/less'
		}
	}))
	.pipe(sourcemaps.write())
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.stream());
});

/*----------  Task Build DEV MODE  ----------*/

gulp.task('dev',['views', 'styles'], function() {
	browserSync.init({
		server: "app/"
	});

    gulp.watch('app/source/**/*.pug', ['views']);
    gulp.watch('app/less/**/*.less', ['styles']);
    // Reload the browser whenever HTML or JS Files Change
    gulp.watch('app/js/**/*.js', browserSync.reload);
    gulp.watch("app/*.html", browserSync.reload);
});

/*=====  End of Task for DEV  ======*/


/*===========================================
=            TASK  FOR DIST MODE            =
===========================================*/

gulp.task('public', function() {
    gulp.src('app/less/*.less')
    .pipe(plumber())
	.pipe(less())
    .pipe(gulp.dest('dist/css/'));

    gulp.src('app/*.html')
	.pipe(gulp.dest('dist/'));

	gulp.src('app/js/**/**')
	.pipe(gulp.dest('dist/js/'));

	gulp.src('app/fonts/**')
	.pipe(gulp.dest('dist/fonts/'));

	gulp.src('app/ico/**')
	.pipe(gulp.dest('dist/ico/'));

	gulp.src('app/images/**')
	.pipe(gulp.dest('dist/images/'));

	gulp.src('dist/*')
        .pipe(zip('dist.zip'))
        .pipe(gulp.dest(''))
});

gulp.task('all', function() {
	gulp.src(['!app/less', '!app/source', 'app/**' ])
	.pipe(gulp.dest('dist'));
});

gulp.task('dist',['views', 'styles', 'puplic'], function() {
   browserSync.init({
		server: "dist/"
	});
});

/*=====  End of TASK  FOR DIST MODE  ======*/

