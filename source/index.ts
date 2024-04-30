import { Transform } from "node:stream";
import sharp from "sharp";
import type { BufferFile } from "vinyl";

type PickedSharpOptions = Pick<sharp.ResizeOptions, "fit" | "height" | "position" | "width">;
interface RezzyVersion extends PickedSharpOptions {
	suffix: string;
}

const supportedFormats = new Set([ ".jpg", ".jpeg", ".png", ".webp", ".tiff", ".raw" ]);

const rezzy = (versions: RezzyVersion[]) => new Transform({
	objectMode: true,
	async transform(file: BufferFile, _encoding, done) {
		if (file.isNull() || versions.length === 0) {
			done(null, file);
			return;
		}

		if (file.isStream()) {
			done(new Error("Streams are not supported!"), file);
			return;
		}

		if (!Array.isArray(versions)) {
			done(new Error("Versions must be an array!"), file);
			return;
		}

		if (!supportedFormats.has(file.extname.toLowerCase())) {
			done(new Error("Unsupported file format!"), file);
			return;
		}

		if (!versions.every(({ suffix }) => Boolean(suffix))) {
			done(new Error("Every version must have a suffix property!"), file);
			return;
		}

		const sharpImage = sharp(file.path);

		await Promise.all(versions.map(async({ suffix, ...sharpOptions }) => {
			const clonedVinyl = file.clone();
			const clonedSharpImage = sharpImage.clone();

			clonedVinyl.contents = await clonedSharpImage.resize({ ...sharpOptions }).toBuffer();
			clonedVinyl.extname = suffix + clonedVinyl.extname;

			this.push(clonedVinyl);
		}));

		done();
	}
});

export default rezzy;
