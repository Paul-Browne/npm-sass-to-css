# x-to-css
Take less, sass, scss or css and output minified, autoprefixed css

### usage

`npm i x-to-css`

or 

`npm i -D x-to-css`

```js
const XtoCss = require("x-to-css");

XtoCss("test/test.scss", "path/to/dist.css", {
	maps: true
});
//=> will output minified autoprefixed css to path/to/dist.css
//=> and a sourceMap to path/to/dist.css.map

XtoCss("some/style.less", "path/to/dist.css");
//=> will output minified autoprefixed css to path/to/dist.css
//=> no sourceMaps
```