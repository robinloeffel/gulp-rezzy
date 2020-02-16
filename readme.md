# gulp-rezzy
The incredibly fast image resizer for [gulp](https://github.com/gulpjs/gulp).

## What
`gulp-rezzy` enables you to resize your images and then pipe each and every newly created version version of it into your stream. This allows you to only have one big background image asset in your source directory and then generate several smaller versions of it for all your responsiveness needs automatically. No more Photoshop for you, my friend!

## How
```bash
yarn add gulp-rezzy
```

```js
const gulp = require('gulp');
const rezzy = require('gulp-rezzy');

gulp.task('images:resize', () => {
    return gulp.src('src/img/**/*')
        .pipe(rezzy([{
            width: 400,
            suffix: '-sm'
        }, {
            width: 800,
            suffix: '-md'
        }, {
            width: 1200,
            suffix: '-lg'
        }]))
        .pipe(gulp.dest('dist/img'))
});
```

You can configure `gulp-rezzy` by passing in an array of objects containing your configs.

```js
const config = {
    width: 400, // width in px
    height: 200, // height in px
    suffix: '.small' // string to append before the file extension
};
```

`width` and `height` are bot optional. If none of both is supplied, there'll be no resizing. If one of them is present, the image will be transformed accordingly, preserving the aspect ratio. If both are present, the image will be resized to those exact dimensions, which may result in skewing. `suffix` is required.

## Thanks
This plugin makes strong use of [sharp](https://github.com/lovell/sharp) under the hood. Big props to them! Other than that: Shoutout to [through2](https://github.com/rvagg/through2), [chalk](https://github.com/chalk/chalk), and of course the [gulp team](https://github.com/gulpjs) for [gulp](https://github.com/gulpjs/gulp), [fancy-log](https://github.com/gulpjs/fancy-log), [plugin-error](https://github.com/gulpjs/plugin-error) and [vinyl](https://github.com/gulpjs/vinyl)! Special thanks go out to [Sindre Sorhus](https://gist.github.com/sindresorhus) for getting me on the right track in regards to writing a gulp plugin!

## License
MIT
