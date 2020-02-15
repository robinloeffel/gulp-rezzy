const gulp = require('gulp');
const rezzy = require('./rezzy');

gulp.task('demo', () => {
    gulp.src('demo/src/**/*')
        .pipe(rezzy([{
            width: 500,
            suffix: '-sm'
        }, {
            width: 1000,
            suffix: '-md'
        }, {
            width: 1500,
            suffix: '-lg'
        }]))
        .pipe(gulp.dest('demo/dist'));
});
