var gulp 			=	require('gulp'),
	plumber 		=	require('gulp-plumber'),
	less 			=	require('gulp-less'),
    minifyCss 		=	require('gulp-clean-css'),
	pug 			=	require('gulp-pug'),
	sourcemaps 		=	require('gulp-sourcemaps'),
    useref 			=	require('gulp-useref'),
    gulpif 			=	require('gulp-if'),
    uglify 			=	require('gulp-uglify'),
    del 			=	require('del'),
	spritesmith 	=	require('gulp.spritesmith'),
	imagemin 		=	require('gulp-imagemin');
	buffer 			=	require('vinyl-buffer');
	csso 			=	require('gulp-csso');
	merge 			=	require('merge-stream');
	svgSprite 		=	require("gulp-svg-sprites");
	runSequence 	=	require('run-sequence');
	browserSync 	=	require('browser-sync').create();

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

gulp.task('install-bootstrap', ['update-bootstrap'], function() {
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


/*----------  IMAGE SPRITE  ----------*/
gulp.task('img-sprite', function () {

	// Generate our spritesheet
	var spriteData = gulp.src('app/imgs/sprites/*.png')
	.pipe(spritesmith({
		imgName: 'sprites.png',
		selector: "svg-%f",
		cssName: '_sprites.less',
		imgPath: '../imgs/sprites.png',
		padding: 2,

		// Config For 2x images
		retinaSrcFilter: ['app/imgs/sprites/*@2x.png'],
		retinaImgName: 'sprite@2x.png',
		retinaImgPath: '../imgs/sprite@2x.png'

	}));

	// Pipe image stream through image optimizer and onto disk
	var imgStream = spriteData.img
		.pipe(plumber())
		.pipe(buffer())
    	.pipe(imagemin())
		.pipe(gulp.dest('app/imgs/'))
		.pipe(browserSync.stream());

	// Pipe CSS stream through CSS optimizer and onto disk
	var cssStream = spriteData.css.pipe(gulp.dest('app/less/sprites/'));

	return merge(imgStream, cssStream);
});

/*----------  SVG SPRITE  ----------*/
gulp.task('svg-sprite', function () {
    return gulp.src('app/imgs/sprites-svg/*.svg')
        .pipe(svgSprite({
        	common: "svg-icon",
        	selector: "svg-%f",
            cssFile: "../less/sprites/_sprites-svg.less",
            svgPath: "../imgs/%f",
            svg: {
                sprite: "sprites-svg.svg"
            },

            preview: false
            /*preview: {
                sprite: "test.html"
            }*/
        }))
        .pipe(gulp.dest("app/imgs/"));
});

/*----------  Task Build DEV MODE  ----------*/
gulp.task('watch',['img-sprite', 'svg-sprite', 'views', 'build-skip', 'styles'], function() {
	browserSync.init({
		server: "app/",
		//reloadDelay: 1000,
	});

    gulp.watch('app/source/**/*.pug', ['views']);
    gulp.watch('app/less/**/*.less', ['styles']);
    gulp.watch('app/imgs/sprites/**/*.png', ['img-sprite']);
    gulp.watch('app/imgs/sprites/sprites-svg/**/*.svg', ['svg-sprite']);

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

gulp.task('public',['clean:dist', 'views', 'build-skip', 'styles', 'minify-css-js'] , function(){
	gulp.src('app/fonts/**')
		.pipe(gulp.dest('dist/fonts/'));

	gulp.src('app/ico/**')
		.pipe(gulp.dest('dist/ico/'));

	gulp.src('app/imgs/**')
		.pipe(gulp.dest('dist/imgs/'));
});

gulp.task('dist',['views', 'build-skip', 'styles', 'public'], function() {
   browserSync.init({
		server: "dist/"
	});
});

gulp.task('default', ['install-bootstrap', 'watch'], function(){});

/*=====  End of TASK  FOR DIST MODE  ======*/

