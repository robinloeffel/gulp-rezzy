const through = require('through2').obj;
const sharp = require('sharp');
const log = require('fancy-log');
const chalk = require('chalk');
const File = require('vinyl');
const PluginError = require('plugin-error');
const pluginName = 'gulp-rezzy';

module.exports = (versions = []) => {
    return through(function(chunk, encoding, done) {
        versions.forEach((version, index) => {
            if (!version.suffix || !(version.width || version.height)) {
                this.emit('error', new PluginError(pluginName, 'Incorrect configuration!'));
            }

            const image = sharp(chunk.contents);
            image.resize(version.width, version.height);

            const promise = image.toBuffer();
            promise.then(buffer => {
                const file = new File({
                   cwd: chunk.cwd,
                   base: chunk.base,
                   path: chunk.path.replace(chunk.extname, '') + version.suffix + chunk.extname,
                   contents: buffer
               });

               this.push(file);
               log(`${pluginName}: ${file.relative} ${chalk.gray(`${Object.entries(version)}`)} ${chalk.green('✓')}`);

               if (index === versions.length -1) {
                    done();
               }
            });
        });
    });
};
