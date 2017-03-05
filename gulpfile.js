var gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	less = require('gulp-less'),
    minifyCss = require('gulp-clean-css'),
	pug = require('gulp-pug'),
	sourcemaps = require('gulp-sourcemaps'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    del = require('del'),
	browserSync = require('browser-sync').create();

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
    console.log("\n [>] Update Bootstrap DONE ^.^ \n");
});

gulp.task('install', ['update-bootstrap'], function() {
	console.log("\n [>] Install project DONE ^.^ \n");
});

/*=====  End of Update Bootstrap Core  ======*/


/*===========================================
=            Update Font-Awesome            =
===========================================*/
gulp.task('fa-less', function() {
	return gulp.src('node_modules/font-awesome/less/**/*.less')
	.pipe(gulp.dest('app/less/font-awesome/'));
});
gulp.task('fa-fonts', function() {
	return gulp.src('node_modules/font-awesome/fonts/*.*')
	.pipe(gulp.dest('app/fonts/font-awesome/'));
});

/*----------  Task Update  ----------*/
gulp.task('use-fontawesome', ['fa-less', 'fa-fonts'], function () {});
gulp.task('update-fontawesome', ['fa-less', 'fa-fonts'], function () {});

/*=====  End of Update Font-Awesome  ======*/


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


gulp.task('build', ['views', 'styles'], function(){});

/*----------  Task Build DEV MODE  ----------*/

gulp.task('dev',['build'], function() {
	browserSync.init({
		server: "app/",
		//reloadDelay: 1000,
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

gulp.task('clean:dist', function() {
  return del.sync(['dist', 'dist.zip']);
})

gulp.task('pre-build',['build'] , function(){
    gulp.src('app/*.html')
	    .pipe(useref())
	    .pipe(gulpif('app/js/*.js', uglify()))
	    .pipe(gulpif('app/css/*.css', minifyCss()))
	    .pipe(gulp.dest('dist'));

	gulp.src('app/fonts/**')
		.pipe(gulp.dest('dist/fonts/'));

	gulp.src('app/ico/**')
		.pipe(gulp.dest('dist/ico/'));

	gulp.src('app/imgs/**')
		.pipe(gulp.dest('dist/imgs/'));
});

gulp.task('build-zip', function() {

	return gulp.src('dist/*')
	    .pipe(zip('./dist.zip'))
	    .pipe(gulp.dest('./'));

});

gulp.task('public',['pre-build', 'build-zip'] , function() {});

gulp.task('dist',['pre-build'], function() {
   browserSync.init({
		server: "dist/"
	});
});

/*=====  End of TASK  FOR DIST MODE  ======*/

