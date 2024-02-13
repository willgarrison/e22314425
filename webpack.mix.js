const mix = require("laravel-mix");

require("laravel-mix-clean");

mix
	.setPublicPath("dist")
	.clean({
		"dist/data/*": ["dist/data/*"],
		"dist/assets/*": ["dist/assets/*"],
		"dist/*.html": ["dist/*.html"],
	})
	.js("src/js/app.js", "dist/js")
	.postCss("src/css/app.css", "dist/css", [require("tailwindcss")])
	.copyDirectory("src/assets", "dist/assets")
	.copy("src/*.html", "dist");
