# Bootstrap-Starter

Bootstrap-Starter be build base on the framework [Twitter Bootstrap] and integrated [Font Awesome] with latest version. Moreover Bootstrap-Starter help you resolve problems about: image sprite, svg sprite, layout responsive.

### Featured Gulp Packages using
[gulp-pug] - Enables you to compile your Pug templates into HTML or JS.
[gulp-less] - A LESS plugin for Gulp help you compile Less to CSS.
[browser-sync] - Keep multiple browsers & devices in sync when building websites.
[gulp-plumber] - Prevent pipe breaking caused by errors from gulp plugins.
[gulp-cssmin] - Plugin to minify CSS, using clean-css.
[gulp.spritesmith] - Generate an IMAGE (jpg, png) sprite sheet. Retina support.
[gulp-svg-sprites] - Generate an SVG sprite sheet.

### Install Project
**I. Install Gulp**
```sh
$ npm i -g gulp
```
**II. Install the dependencies:**
```sh
npm install
```
**III.  Install Bootstrap**
Intergrade Bootstrap
```sh
gulp install-bootstrap
```

Update Bootstrap latest version
```sh
gulp update-bootstrap
```

**IV. Intergrade Font-Awesome**
Intergrade Font-Awesome:
```sh
gulp install-fa
```
Update **Font-Awesome** latest version:
```sh
gulp update-fa
```

### Development
Run command below to work:
```sh
gulp watch
```

### Build Dist
Create dist folder and **dist.zip**
```sh
gulp public
```

### Preview Dist
```sh
gulp dist
```

### Note
If you not use [Font Awesome], [gulp.spritesmith] or [gulp-svg-sprites] please comment or remove 
Related codes to avoid error when you build project.
Related files: gulpfile.js, style.less, main.less


[Font Awesome]: <http://fortawesome.github.io/Font-Awesome/>
[Twitter Bootstrap]: <http://getbootstrap.com/>
[browser-sync]: <https://www.npmjs.com/package/browser-sync]>
[Gulp]: <http://gulpjs.com>
[gulp-pug]: <https://www.npmjs.com/package/gulp-pug>
[gulp-plumber]: <https://www.npmjs.com/package/gulp-plumber>
[gulp-less]: <https://www.npmjs.com/package/gulp-less>
[gulp-cssmin]: <https://www.npmjs.com/package/gulp-cssmin>
[gulp.spritesmith]: <https://www.npmjs.com/package/gulp.spritesmith>
[gulp-svg-sprites]: <https://www.npmjs.com/package/gulp-svg-sprites>
