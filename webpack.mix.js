const mix = require("laravel-mix");

require("laravel-mix-clean");

mix
	.setPublicPath("docs")
	.clean({
		"docs/*.html": ["docs/*.html"],
	})
	.js("src/js/app.js", "docs/js")
	.postCss("src/css/app.css", "docs/css", [require("tailwindcss")])
	.copy("src/*.html", "docs");
