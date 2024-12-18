# albina-website

- https://lawinen.report/
- https://valanghe.report/
- https://avalanche.report/
- https://fr.avalanche.report/
- https://ca.avalanche.report/
- https://es.avalanche.report/
- https://oc.avalanche.report/

## Development

Install [Node.js](https://nodejs.org/en).

Use `corepack enable` to install [Yarn](https://yarnpkg.com/).

Use `yarn install` to download necessary packages.

Use `yarn start` and browse to http://localhost:3000/ to use dev server.

### Run with sample data

Use `yarn run start-dev` and browse to http://localhost:3000/ to use dev server.

Configuration for dev (environment) is defined in config-dev.json, which overrides settings in config.json

### Browserstack debugging

in order to test IOS Devices in local mode, server.host in vite.config.ts has to be set to "bs-local.com"

## Deployment

Use `yarn run build` to create a (minified) production build.

After running the `build` target, copy the contents of your dist directory to
a location on your webserver. If the location is not the webserver's root,
please adjust the `--output-public-path` option in the `scripts.build` settings
of `package.json` before running the deploy target.

Note that `package.json` contains deploy scripts.
Use `yarn run deploy` to copy the built files over to the live server.
Both scripts make use of the `rsync` command https://rsync.samba.org/
that is available for Linux, Windows and MacOS. If you do not want to use rsync
you can copy over the contents of the `dist` directory to the server.

| environment | build                 | deploy                 | link                           |
| ----------- | --------------------- | ---------------------- | ------------------------------ |
| production  | `yarn run build-prod` | `yarn run deploy-prod` | https://avalanche.report/      |
| beta        | `yarn run build-beta` | `yarn run deploy-beta` | https://avalanche.report/beta/ |
| development | `yarn run build-dev`  | `yarn run deploy-dev`  | https://avalanche.report/dev/  |

## Server configuration (Apache)

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

## Server configuration (nginx)

Since this project uses `BrowserRouter` from `react-router`, the webserver must be configured to return `index.html` for the routes defined in `app/components/app.jsx`, for instance:

```
server {
  root /var/www/avalanche.report/;
  location / {
    autoindex on;
    try_files $uri /ROOT/$uri $uri/ =404;
  }
  location = / {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
  location /archive {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
  location /blog {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
  location /bulletin {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
  location /education {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
  location /more {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
  location /weather {
    try_files $uri /ROOT/$uri /ROOT/index.html =404;
  }
}
```

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

## Update CHANGELOG (for new releases)

Please use the following workflow when releasing new versions:

1. determine new version number `<TAG>` and
   run `yarn changelog <TAG>`
2. edit `CHANGELOG.md` by hand if necessary and commit
3. create `<TAG>` with git

If you forgot to update the changelog before creating a new tag in git, use
`yarn changelog-latest`. This will add all commits for the newest tag to
the CHANGELOG. The downside compared to the workflow above is, that the
changes to CHANGELOG itself are not included in the release.
