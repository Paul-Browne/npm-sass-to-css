var XtoCss = require('.');

const now = Date.now();
// scss to css
XtoCss("test/test.scss", "dist/path/to/dist.css", {
	maps: true
});

// css to css
XtoCss("test/tester.css","dist/path/to/dister.css");

// scss with no includes to css
XtoCss("test/no-includes.scss","dist/path/to/no-include.min.css");

// scss includes with no "content" to css (shouldn't create a file)
XtoCss("test/nested/inc.scss","dist/path/to/xyz.css");

// less with no includes to css
XtoCss("test/test.less","dist/path/to/lesstest.css");

console.log((Date.now() - now));


/*

XtoCss({
	in: "test/test.scss",		// path | buffer | string
	out: "path/to/dist.css",	// optional maybe?
	maps: true,
	(err, result) => {
		{
			css: ...
			map: ...

		}
		// result as string or buffer...
		// callback...
	}
});

*/