# ALBINA Webapp

## Development
Use `npm install` to download necessary packages.

Use `npm start` and browse to http://localhost:8080/ to use webpack's dev server.

Use `npm run deploy` to create a (minified) production build.

## Deployment
After running the `deploy` target, copy the contents of your dist directory to
a location on your webserver. If the location is not the webserver's root,
please adjust the `--output-public-path` option in the `scripts.deploy` settings
of `package.json` before running the deploy target.

You will need to setup an URL rewrite module. For Apache you have to enable it
```
# a2enmod rewrite
```
you can then use this settings (either in a site configuration or a .htaccess file)
```
RewriteEngine On
RewriteBase /YOUR_PATH/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```
where `YOUR_PATH` is the path of the project location relative to the webserver's
root (i.e. should be the same as the `--output-public-path` setting in the
deploy script - use `/` for the webserver's root directory).
