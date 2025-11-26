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

Use `corepack enable` to install [pnpm](https://pnpm.io/).

Use `pnpm install` to download necessary packages.

Use `pnpm start` and browse to http://localhost:3000/ to use dev server.

### Run with sample data

Use `pnpm run start-dev` and browse to http://localhost:3000/ to use dev server.

Configuration for dev (environment) is defined in config-dev.json, which overrides settings in config.json

### Browserstack debugging

in order to test IOS Devices in local mode, server.host in vite.config.ts has to be set to "bs-local.com"

## Deployment

Configure [config.json](https://gitlab.com/albina-euregio/albina-website/-/blob/master/app/config.json) accordingly.

Use `pnpm run build` to create a (minified) production build.

After running the `build` target, copy the contents of your dist directory to
a location on your webserver. If the location is not the webserver's root,
run `pnpm run build --base=/.../` instead.

| environment | build                 | deploy                 | link                           |
| ----------- | --------------------- | ---------------------- | ------------------------------ |
| production  | `pnpm run build-prod` | `pnpm run deploy-prod` | https://avalanche.report/      |
| beta        | `pnpm run build-beta` | `pnpm run deploy-beta` | https://avalanche.report/beta/ |
| development | `pnpm run build-dev`  | `pnpm run deploy-dev`  | https://avalanche.report/dev/  |

## Server configuration (Caddy)

```
www.avalanche.report, avalanche.report {
	handle_path /beta/* {
		root * /var/www/avalanche.report/beta/
		try_files {path} /index.html
		file_server
	}

	handle_path /dev/* {
		root * /var/www/avalanche.report/dev/
		try_files {path} /index.html
		file_server
	}

	handle {
		root * /var/www/avalanche.report/ROOT/
		try_files {path} /index.html
		file_server
		handle /assets/* {
			header +Access-Control-Allow-Origin "*"
		}
		handle /iframe.js {
			header +Access-Control-Allow-Origin "*"
		}
	}
}

```

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

This project uses Transifex for its translations: https://app.transifex.com/albina-euregio/albina-website/

To interact with Transifex, install the official [transifex-client](https://github.com/transifex/cli).

```sh
# push updated en.json to Transifex
$ tx push --source albina-website.website
# show status
$ tx status albina-website.website
# fetch updated translations from Transifex
$ tx pull --use-git-timestamps
```

## Update CHANGELOG (for new releases)

Please use the following workflow when releasing new versions:

1. determine new version number `<TAG>` and
   run `pnpm changelog <TAG>`
2. edit `CHANGELOG.md` by hand if necessary and commit
3. create `<TAG>` with git

If you forgot to update the changelog before creating a new tag in git, use
`pnpm changelog-latest`. This will add all commits for the newest tag to
the CHANGELOG. The downside compared to the workflow above is, that the
changes to CHANGELOG itself are not included in the release.

If there have been several new releases since the last update to CHANGELOG,
use e.g. `pnpm git-cliff -p CHANGELOG.md v7.0.6..` to prepend all changes that
happened _after_ version v7.0.6 was released.
