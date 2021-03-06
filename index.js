const sass = require('sass');
const less = require('less');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mime = require('mime-types');
const path = require('path');
const fs = require('fs');

const type = inPath => {
	if(mime.lookup(inPath) === 'text/css'){
		return 'css'
	}else if (mime.lookup(inPath) === 'text/less') {
		return 'less'
	}else if (mime.lookup(inPath) === 'text/x-scss' || mime.lookup(inPath) === 'text/x-sass') {
		return 'sass'
	}
}

const makeFileSync = (_path, contents) => {
	if(contents){
		fs.mkdir(path.dirname(_path), { recursive: true }, (err) => {
			if (err) throw err;
			fs.writeFileSync(_path, contents);
		});
	}
}

const processCss = (css, inPath, outPath, maps) => {
	postcss([
	    autoprefixer(),
	    cssnano()
	])
	.process(css, { from: inPath, to: outPath, map: maps ? {inline: false} : false })
	.then(result => {
		if(result.css.indexOf("\n/*# source") === 0){
			makeFileSync(outPath, result.css);
		}
	})
}

const resultToMapAndCss = (err, result, inPath, outPath, maps) => {
	if (err) throw err;
	if(maps && result.map && JSON.parse(result.map).mappings){
		makeFileSync(outPath + ".map", result.map);
	} 
    processCss(result.css, inPath, outPath, maps);
}

module.exports = (inPath, outPath, options) => {
	const maps = options && options.maps;
	if(type(inPath) === 'less'){
		less.render(fs.readFileSync(inPath, 'utf8'), { sourceMap: {} }, (err, result) => {
		    resultToMapAndCss(err, result, inPath, outPath, maps);
		})
	}else if (type(inPath) === 'sass') {
		sass.render({
		    file: inPath,
		    outFile: outPath,
		    sourceMap: true
		}, (err, result) => {
			resultToMapAndCss(err, result, inPath, outPath, maps);
		});
	}else if (type(inPath) === 'css') {
		processCss(fs.readFileSync(inPath, 'utf8'), inPath, outPath, false);
	}
};

