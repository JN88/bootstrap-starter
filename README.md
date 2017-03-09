# Bootstrap-Starter

Supper-Bootstrap be build base on the framework [Twitter Bootstrap] and integrated [Font Awesome] with latest vertion.

### Featured Gulp Packages using
[gulp-pug], [gulp-less], [browser-sync], [gulp-plumber], [gulp-cssmin], [gulp.spritesmith]

### Installation

```sh
$ npm i -g gulp
```
Install the dependencies:
```sh
npm install
```

### Install Project
Default will intergrade Bootstrap latest vertion
```sh
gulp install
```

### Develop
Run command below to work:
```sh
gulp dev
```

### Update Bootstrap
Update bootstrap latest vertion:
```sh
gulp update-bootstrap
```

### Intergrade Font-Awesome
Intergrade Font-Awesome latest vertion:
```sh
gulp install-fa
```

Update Font-Awesome latest vertion:
```sh
gulp update-fa
```

### Config auto build sprites image
Open file gulpfile.js find and remove comment
```js
//gulp.watch('app/imgs/sprites/**/*.png', ['sprites']);
```

Open file style.less find and remove comment
```less
//@import "sprites/sprites.less";
```

Open file main.less find and remove comment
```less
// Init Sprites Style
//[class^="icon-"] {
//	display: inline-block;
//	vertical-align: middle;
//}
//.sprites(@spritesheet-sprites);
```

### Build Dist
Create dist folder and dist.zip
```sh
gulp public
```

[Font Awesome]: <http://fortawesome.github.io/Font-Awesome/>
[Twitter Bootstrap]: <http://getbootstrap.com/>
[browser-sync]: <https://www.npmjs.com/package/browser-sync]>
[Gulp]: <http://gulpjs.com>
[gulp-pug]: <https://www.npmjs.com/package/gulp-pug>
[gulp-plumber]: <https://www.npmjs.com/package/gulp-plumber>
[gulp-less]: <https://www.npmjs.com/package/gulp-less>
[gulp-cssmin]: <https://www.npmjs.com/package/gulp-cssmin>
[gulp.spritesmith]: <https://www.npmjs.com/package/gulp.spritesmith>
