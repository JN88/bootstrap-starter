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
	spritesmith = require('gulp.spritesmith'),
	imagemin = require('gulp-imagemin');
	buffer = require('vinyl-buffer');
	csso = require('gulp-csso');
	merge = require('merge-stream');
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
gulp.task('install-fa', ['fa-less', 'fa-fonts'], function () {});
gulp.task('update-fa', ['fa-less', 'fa-fonts'], function () {});

/*=====  End of Update Font-Awesome  ======*/


/*====================================
=            Task for DEV            =
====================================*/

/*----------  VIEWS  ----------*/
gulp.task('views', function buildHTML() {
	return gulp.src('app/source/*.pug')
	.pipe(plumber({
		errorHandler: function (err) {
			console.log(err);
			this.emit('end');
		}
	}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.stream());
});

/*----------  VIEWS-SKIP  ----------*/
gulp.task('build-skip', function buildHTML() {
	return gulp.src('app/source/*.skip')
	.pipe(plumber({
		errorHandler: function (err) {
			console.log(err);
			this.emit('end');
		}
	}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('app'))
	.pipe(browserSync.stream());
});

/*----------  STYLE  ----------*/



/*----------  SPRITES  ----------*/
gulp.task('sprites', function () {

	// Generate our spritesheet
	var spriteData = gulp.src('app/imgs/sprites/*.png')
	.pipe(spritesmith({
		imgName: 'sprites.png',
		cssName: 'sprites.less',
		algorithm: 'alt-diagonal',
		imgPath: '../imgs/sprites.png',
		padding: 2
	}));

	// Pipe image stream through image optimizer and onto disk
	var imgStream = spriteData.img
		.pipe(buffer())
    	.pipe(imagemin())
		.pipe(gulp.dest('app/imgs/'))
		.pipe(browserSync.stream());

	// Pipe CSS stream through CSS optimizer and onto disk
	var cssStream = spriteData.css.pipe(gulp.dest('app/less/sprites/'));

	return merge(imgStream, cssStream);
});

/*----------  Task Build DEV MODE  ----------*/
gulp.task('dev',['views', 'views-skip', 'styles'], function() {
	browserSync.init({
		server: "app/",
		//reloadDelay: 1000,
	});

    gulp.watch('app/source/**/*.pug', ['views']);
    gulp.watch('app/less/**/*.less', ['styles']);
    //gulp.watch('app/imgs/sprites/**/*.png', ['sprites']);

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

gulp.task('minify-css-js', function() {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulp.dest('dist'));
})

gulp.task('build-zip', function() {

	return gulp.src('dist/*')
	    .pipe(zip('./dist.zip'))
	    .pipe(gulp.dest('./'));

});

gulp.task('public',['clean:dist', 'views', 'views-skip', 'styles', 'minify-css-js'] , function(){
	gulp.src('app/fonts/**')
		.pipe(gulp.dest('dist/fonts/'));

	gulp.src('app/ico/**')
		.pipe(gulp.dest('dist/ico/'));

	gulp.src('app/imgs/**')
		.pipe(gulp.dest('dist/imgs/'));
});

gulp.task('dist',['views', 'views-skip', 'styles', 'public'], function() {
   browserSync.init({
		server: "dist/"
	});
});

gulp.task('default', ['install', 'dev'], function(){});

/*=====  End of TASK  FOR DIST MODE  ======*/

