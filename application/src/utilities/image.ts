import { readFile } from "node:fs/promises";

import { encode } from "blurhash";
import sharp from "sharp";

function getImageRatio({ width, height }: sharp.Metadata) {
	if (!width || !height)
		throw new Error("Image metadata must contain width and height.");

	const ratio = (width > height) ? height! / width : width / height;

	return {
		width: width > height ? 200 : Math.round(200 * ratio),
		height: width > height ? Math.round(200 * ratio) : 200,
	};
}

// Found in https://github.com/canoypa/example-astro-blurhash-dataurl
export async function getImageBuffer(metadata: ImageMetadata) {
	const filename = metadata.src
		.replace(/^\/@fs/, "/")
		.replace(/\?.+$/, "");

	const imageFsPath = import.meta.env.PROD
		? ["./dist", filename].join("")
		: filename;

	return await readFile(imageFsPath);
}

// Found in https://github.com/canoypa/example-astro-blurhash-dataurl/tree/main
export async function imageToBlurhash(data: ArrayBuffer) {
	const { width, height } = getImageRatio(await sharp(data).metadata());
	const { data: buffer, info } = await sharp(data)
		.resize(width, height, { fit: "cover" })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const pixels = new Uint8ClampedArray(buffer);
	const blurhash = encode(pixels, info.width, info.height, 4, 4);

	return blurhash;
}
