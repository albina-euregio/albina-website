# albina-website

- https://lawinen.report/
- https://valanghe.report/
- https://avalanche.report/
- https://fr.avalanche.report/
- https://ca.avalanche.report/
- https://es.avalanche.report/
- https://oc.avalanche.report/

## Development

Use `npm install` to download necessary packages.

Use `npm start` and browse to http://localhost:3000/ to use dev server.

### Run with sample data

Use `npm run start-dev` and browse to http://localhost:3000/ to use dev server.

Configuration for dev (environment) is defined in config-dev.json, which overrides settings in config.json

## Deployment

Use `npm run build` to create a (minified) production build.

After running the `build` target, copy the contents of your dist directory to
a location on your webserver. If the location is not the webserver's root,
please adjust the `--output-public-path` option in the `scripts.build` settings
of `package.json` before running the deploy target.

Note that `package.json` contains deploy scripts.
Use `npm run deploy` to copy the built files over to the live server.
Both scripts make use of the `rsync` command https://rsync.samba.org/
that is available for Linux, Windows and MacOS. If you do not want to use rsync
you can copy over the contents of the `dist` directory to the server.

| environment | build                | deploy                | link                           |
| ----------- | -------------------- | --------------------- | ------------------------------ |
| production  | `npm run build-prod` | `npm run deploy-prod` | https://avalanche.report/      |
| beta        | `npm run build-beta` | `npm run deploy-beta` | https://avalanche.report/beta/ |
| development | `npm run build-dev`  | `npm run deploy-dev`  | https://avalanche.report/dev/  |

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

## Translation

This project uses Transifex for its translations: https://www.transifex.com/albina-euregio/albina-website/dashboard/

To interact with Transifex, install the official [transifex-client](https://github.com/transifex/transifex-client/).

```sh
# push updated en.json to Transifex
$ tx push --source albina-website.website
# show status
$ tx statuxs albina-website.website
# fetch updated translations from Transifex
$ tx pull --use-git-timestamps
```
