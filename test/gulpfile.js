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
  }, {
    width: 1000,
    height: 1000,
    fit: 'cover',
    position: 'bottom',
    suffix: '-cover-bottom'
  }]))
  .pipe(dest('public'));

module.exports.default = images;
