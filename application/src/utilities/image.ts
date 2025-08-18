/* eslint-disable node/prefer-global/buffer */
import { readFile } from "node:fs/promises";

import { encode } from "blurhash";
import sharp from "sharp";

/**
 * Calculate image ratio and return width and height for a 200px longest side
 *
 * @param metadata image metadata
 * @param metadata.width image width
 * @param metadata.height image height
 * @returns Width and height for a 200px longest side
 */
function getImageRatio({ width, height }: sharp.Metadata) {
	if (!width || !height)
		throw new Error("Image metadata must contain width and height.");

	const ratio = (width > height) ? height / width : width / height;

	return {
		width: width > height ? 200 : Math.round(200 * ratio),
		height: width > height ? Math.round(200 * ratio) : 200,
	};
}

// Found in https://github.com/canoypa/example-astro-blurhash-dataurl
/**
 * Get image buffer from image astro metadata
 *
 * @param metadata image astro metadata
 * @returns image buffer
 */
export async function getImageBuffer(metadata: ImageMetadata): Promise<Buffer> {
	const filename = metadata.src
		.replace(/^\/@fs/, "/")
		.replace(/\?.+$/, "");

	const imageFsPath = import.meta.env.PROD
		? ["./dist", filename].join("")
		: filename;

	return readFile(imageFsPath);
}

// Found in https://github.com/canoypa/example-astro-blurhash-dataurl/tree/main
/**
 * Transform an image buffer into a blurhash string
 *
 * @param data image buffer
 * @returns blurhash string
 */
export async function imageToBlurhash(data: Buffer): Promise<string> {
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
