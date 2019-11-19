# ALBINA Webapp

## Development

Use `npm install` to download necessary packages.

Use `npm start` and browse to http://localhost:8080/ to use webpack's dev server.

Use `npm run build` or `npm run build-beta` to create a (minified) production
build for the live or test version, respectively.

After running the `build` target, copy the contents of your dist directory to
a location on your webserver. If the location is not the webserver's root,
please adjust the `--output-public-path` option in the `scripts.build` settings
of `package.json` before running the deploy target.

Be aware that the config.json is not transfered to target servers. In order to use the beta backend and data for deployment you have to ajust config.json (apis section).

## Deployment

NOTE: `package.json` contains deploy scripts for the live and beta version of the
project. Both scripts make use of the `rsync` command https://rsync.samba.org/
that is available for Linux, Windows and MacOS. If you do not want to use rsync
you can copy over the contents of the `dist` directory to the server.

Use `npm run deploy` or `npm run deploy-beta` to copy the built files over to
the live or test version, respectively.

## Server configuration

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
build script - use `/` for the webserver's root directory).
