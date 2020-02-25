const gulp = require('gulp');
const rezzy = require('../index');

gulp.task('default', () => {
    return gulp.src('src/*')
        .pipe(rezzy([{
            width: 500,
            suffix: '-500w'
        }, {
            height: 1000,
            suffix: '-1000h'
        }, {
            width: 400,
            height: 300,
            suffix: '-400x300'
        }, {
            width: 400,
            height: 300,
            position: 'entropy',
            suffix: '-entropy'
        }]))
        .pipe(gulp.dest('dist'));
});
