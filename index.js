import sass from 'sass';
const { render: renderSass } = sass;
import less from 'less';
const { render: renderLess } = less;
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { lookup } from 'mime-types';
import { dirname } from 'path';
import { mkdir, writeFile, readFile } from 'fs/promises';

const type = path => {
	if (lookup(path) === 'text/css') {
		return 'css'
	} else if (lookup(path) === 'text/less') {
		return 'less'
	} else if (lookup(path) === 'text/x-scss' || lookup(path) === 'text/x-sass') {
		return 'sass'
	}
}

const makeFile = async (path, contents, cb) => {
	if (contents) {
		await mkdir(dirname(path), { recursive: true });
		await writeFile(path, contents);
		await cb(path, contents)
	}
};

const processCss = async (css, inPath, outPath, maps, cb) => {
	const result = await postcss([
		autoprefixer(),
		cssnano()
	]).process(css, { from: inPath, to: outPath, map: maps ? { inline: false } : false });
	// do not copy empty css files
	if (result.css.indexOf("\n/*# source") !== 0) {
		await makeFile(outPath, result.css, cb);
	}
}

const resultToMapAndCss = async (err, result, inPath, outPath, maps, cb) => {
	if (err) throw err;
	if (maps && result.map && JSON.parse(result.map).mappings) {
		cb()
		await makeFile(outPath + ".map", result.map, cb);
	}
	await processCss(result.css, inPath, outPath, maps, cb);
}

export default async (inPath, outPath, options) => {
	const maps = options && options.maps;
	const cb = options && options.callback;
	const contents = await readFile(inPath, 'utf-8');
	if (type(inPath) === 'less') {
		renderLess(contents, { sourceMap: {} }, async (err, result) => {
			await resultToMapAndCss(err, result, inPath, outPath, maps, cb);
		})
	} else if (type(inPath) === 'sass') {
		renderSass({
			file: inPath,
			outFile: outPath,
			sourceMap: true
		}, async (err, result) => {
			await resultToMapAndCss(err, result, inPath, outPath, maps, cb);
		});
	} else if (type(inPath) === 'css') {
		await processCss(contents, inPath, outPath, false, cb);
	}
};

