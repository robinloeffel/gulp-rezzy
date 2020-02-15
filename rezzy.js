const through = require('through2');
const sharp = require('sharp');
const log = require('fancy-log');
const chalk = require('chalk');
const File = require('vinyl');

module.exports = (versions = []) => {
    return through.obj(async function(chunk, encoding, done) {
        const promises = versions.map(async version => {
            const image = sharp(chunk.contents);
            image.resize(version.width, version.height);

            const buffer = await image.toBuffer();
            const file = new File({
                cwd: chunk.cwd,
                base: chunk.base,
                path: chunk.path.replace(chunk.extname, '') + version.suffix + chunk.extname,
                contents: buffer
            });

            log(`gulp-rezzy: ${chunk.relative} => ${file.relative} ${chalk.gray(`(width: ${version.width}px)`)} ${chalk.green('✓')}`);
            return file;
        });

        const results = await Promise.all(promises);
        results.forEach(result => {
            this.push(result);
        });

        done();
    });
};
