const { Transform } = require('stream');
const sharp = require('sharp');
const log = require('fancy-log');
const chalk = require('chalk');
const PluginError = require('plugin-error');

const supportedFormats = new Set([ '.jpg', '.jpeg', '.png', '.webp', '.tiff', '.raw' ]);
const pluginName = 'gulp-rezzy';

module.exports = (versions = []) => new Transform({
  objectMode: true,
  async transform(file, _encoding, done) {
    if (file.isNull() || versions.length === 0) {
      return done(null, file);
    }

    if (file.isStream()) {
      return this.emit('error', new PluginError(pluginName, 'Streams are not supported!'));
    }

    if (!Array.isArray(versions)) {
      return this.emit('error', new PluginError(pluginName, 'The options must be an array'));
    }

    if (!supportedFormats.has(file.extname.toLowerCase())) {
      return this.emit('error', new PluginError(pluginName, `Can't resize ${file.extname} files!`));
    }

    const sharpImage = sharp(file.contents);

    const resizedImages = await Promise.all(versions.map(async version => {
      if (!version.suffix) {
        return this.emit('error', new PluginError(pluginName, `${JSON.stringify(version)} does't include a suffix.`));
      }

      const clonedVinyl = file.clone();

      try {
        clonedVinyl.extname = version.suffix + clonedVinyl.extname;
        clonedVinyl.contents = await sharpImage.clone().resize({
          width: version.width,
          height: version.height,
          fit: version.fit,
          position: version.position
        }).toBuffer();

        return clonedVinyl;
      } catch (sharpError) {
        return this.emit('error', new PluginError(pluginName, sharpError));
      }
    }));

    resizedImages.forEach(resizedImage => {
      this.push(resizedImage);
      log(`${chalk.cyan(pluginName)}: created ${chalk.yellow(resizedImage.relative)}`);
    });

    return done();
  }
});

