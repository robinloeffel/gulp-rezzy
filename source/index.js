const { Transform } = require('stream');
const sharp = require('sharp');
const log = require('fancy-log');
const chalk = require('chalk');
const File = require('vinyl');
const PluginError = require('plugin-error');

const supportedFormats = new Set([ '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.raw' ]);
const pluginName = 'gulp-rezzy';

module.exports = (versions = []) => {
  const stream = new Transform({
    objectMode: true
  });

  stream._transform = async (file, _encoding, done) => {
    if (file.isNull() || versions.length === 0) {
      return done(null, file);
    }

    if (file.isStream()) {
      return stream.emit('error', new PluginError(pluginName, 'Streams are not supported!'));
    }

    if (!Array.isArray(versions)) {
      return stream.emit('error', new PluginError(pluginName, 'The options must be an array'));
    }

    if (!supportedFormats.has(file.extname.toLowerCase())) {
      return stream.emit('error', new PluginError(pluginName, `Can't resize ${file.extname} files!`));
    }

    try {
      const promises = versions.map(async version => {
        if (!version.suffix) {
          return stream.emit('error', new PluginError(pluginName, `${JSON.stringify(version)} does't include a suffix.`));
        }

        const image = sharp(file.contents);
        image.resize({
          width: version.width,
          height: version.height,
          fit: version.fit,
          position: version.position
        });

        const buffer = await image.toBuffer();
        const resized = new File({
          cwd: file.cwd,
          base: file.base,
          path: file.path.replace(file.extname, '') + version.suffix + file.extname,
          contents: buffer
        });

        return resized;
      });

      const images = await Promise.all(promises);
      images.forEach(image => {
        stream.push(image);
        log(`${chalk.cyan(pluginName)}: created ${chalk.yellow(image.relative)}`);
      });
      log(`${chalk.cyan(pluginName)}: from ${chalk.yellow(file.relative)}`);

      return done();
    } catch (error) {
      return stream.emit('error', new PluginError(pluginName, error));
    }
  };

  return stream;
};
