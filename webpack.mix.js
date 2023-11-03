const mix = require("laravel-mix");

require("laravel-mix-clean");

mix
	.setPublicPath("docs")
	.clean({
		"docs/data/*": ["docs/data/*"],
		"docs/*.html": ["docs/*.html"],
	})
	.js("src/js/app.js", "docs/js")
	.postCss("src/css/app.css", "docs/css", [require("tailwindcss")])
	.copy("src/data/*.json", "docs/data")
	.copy("src/*.html", "docs");
