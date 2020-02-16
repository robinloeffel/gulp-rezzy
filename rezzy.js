const through = require('through2').obj;
const sharp = require('sharp');
const log = require('fancy-log');
const chalk = require('chalk');
const File = require('vinyl');
const PluginError = require('plugin-error');
const pluginName = 'gulp-rezzy';


module.exports = (versions = []) => {

    return through(function(file, encoding, done) {
        if (file.isNull()) {
            done(null, file);
            return;
        }

        if (file.isStream()) {
            done(new PluginError(pluginName, 'Streams aren\'t supported!'));
            return;
        }

        (async () => {
            try {
                const promises = versions.map(async version => {
                    if (!version.suffix) {
                        this.emit('error', new PluginError(pluginName, `${JSON.stringify(version)} does't include a suffix.`));
                    }

                    const image = sharp(file.contents);
                    image.resize(version.width, version.height);

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
                    this.push(image);
                    log(`${pluginName}: ${image.relative} ${chalk.green('✓')}`);
                });

                done();
            } catch (error) {
                this.emit('error', new PluginError(pluginName, error, {
                    fileName: file
                }));
            }
        })();
    });

};
