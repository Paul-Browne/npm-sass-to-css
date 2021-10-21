import XtoCss from './index.js';

console.log(1);
// scss to css
XtoCss("test/test.scss", "dist/path/to/dist.css", {
	maps: false
});
console.log(2);
// css to css
XtoCss("test/tester.css","dist/path/to/dister.css", {
	maps: false
});
console.log(3);
// scss with no includes to css
XtoCss("test/no-includes.scss","dist/path/to/no-include.min.css", {
	maps: false
});
console.log(4);
// scss includes with no "content" to css (shouldn't create a file)
XtoCss("test/nested/inc.scss","dist/path/to/xyz.css", {
	maps: false
});
console.log(5);
// less with no includes to css
XtoCss("test/test.less","dist/path/to/lesstest.css", {
	maps: false
});
console.log(6);


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