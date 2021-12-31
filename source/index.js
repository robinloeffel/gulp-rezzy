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

    await Promise.all(versions.map(async ({
      width, height, fit, position, suffix
    }) => {
      const clonedVinyl = file.clone();
      const clonedSharpImage = sharpImage.clone();

      if (!suffix) {
        return this.emit('error', new PluginError(pluginName, 'Not every version has a suffix property!'));
      }

      try {
        clonedVinyl.extname = suffix + clonedVinyl.extname;
        clonedVinyl.contents = await clonedSharpImage.resize({
          width, height, fit, position
        }).toBuffer();
      } catch (error) {
        return this.emit('error', new PluginError(pluginName, error));
      }

      log(`${chalk.cyan(pluginName)}: created ${chalk.yellow(clonedVinyl.relative)}`);
      return this.push(clonedVinyl);
    }));

    return done();
  }
});
