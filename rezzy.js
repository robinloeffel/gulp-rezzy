const { Transform } = require('stream');
const sharp = require('sharp');
const log = require('fancy-log');
const chalk = require('chalk');
const File = require('vinyl');
const PluginError = require('plugin-error');

const supportedFormats = new Set([
    '.jpg',
    '.jpeg',
    '.png',
    '.webp',
    '.tiff',
    '.raw'
]);
const pluginName = 'gulp-rezzy';

module.exports = (versions = []) => {
    const stream = new Transform({
        objectMode: true
    });

    stream._transform = (file, encoding, done) => {
        if (file.isNull() || !versions.length) {
            done(null, file);
            return;
        }

        if (!Array.isArray(versions)) {
            done(new PluginError(pluginName, 'The configuration has to be an array!'));
            return;
        }

        if (file.isStream()) {
            done(new PluginError(pluginName, 'Streaming isn\'t supported!'));
            return;
        }

        if (!supportedFormats.has(file.extname.toLowerCase())) {
            done(new PluginError(pluginName, `Can't resize ${file.extname} files!`, {
                fileName: file.path
            }));
            return;
        }

        (async () => {
            try {
                const promises = versions.map(async version => {
                    if (!version.suffix) {
                        stream.emit('error', new PluginError(pluginName, `${JSON.stringify(version)} does't include a suffix.`));
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
                    stream.push(image);
                    log(`${pluginName}: ${image.relative} ${chalk.green('✓')}`);
                });

                done();
            } catch (error) {
                stream.emit('error', new PluginError(pluginName, error, {
                    fileName: file.path
                }));
            }
        })();
    };

    return stream;
};
