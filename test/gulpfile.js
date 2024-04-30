import gulp from "gulp";
import rezzy from "../dist/index.js";

const images = () => gulp.src("./source/*")
	.pipe(rezzy([{
		width: 640,
		suffix: "-sm"
	}, {
		width: 1280,
		suffix: "-md"
	}, {
		width: 1920,
		suffix: "-lg"
	}, {
		width: 1000,
		height: 1000,
		fit: "cover",
		position: "bottom",
		suffix: "-cover-bottom"
	}]))
	.pipe(gulp.dest("./public"));

export default images;
