const { src, dest } = require('gulp');
const rezzy = require('../source');

const images = () => src('source/*')
  .pipe(rezzy([{
    width: 640,
    suffix: '-sm'
  }, {
    width: 1280,
    suffix: '-md'
  }, {
    width: 1920,
    suffix: '-lg'
  }]))
  .pipe(dest('public'));

module.exports.default = images;
