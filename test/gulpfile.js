const gulp = require('gulp');
const rezzy = require('../rezzy');

gulp.task('default', () => {
    return gulp.src('src/**/*')
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
        .pipe(gulp.dest('dist'));
});
