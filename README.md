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

Configuration for dev (environment) is defined in config.DEV.json, which overrides settings in config.json

### Browserstack debugging

in order to test IOS Devices in local mode, server.host in vite.config.ts has to be set to "bs-local.com"

## Deployment

Configure [config.json](https://gitlab.com/albina-euregio/albina-website/-/blob/master/app/config.json) accordingly. See

Use `pnpm run build` to create a (minified) production build.

After running the `build` target, copy the contents of your dist directory to
a location on your webserver. If the location is not the webserver's root,
run `pnpm run build --base=/.../` instead.

| environment | build                 | link                           |
| ----------- | --------------------- | ------------------------------ |
| production  | `pnpm run build-prod` | https://avalanche.report/      |
| beta        | `pnpm run build-beta` | https://beta.avalanche.report/ |
| development | `pnpm run build-dev`  | https://dev.avalanche.report/  |

### Configuring regions

- `regionCodes` defines the list of main regions for this instance.
  - The map is automatically adjusted to fit all these regions.
  - If a region does not publish a report, it shows up blue in the map and links to the region blog.

In addition there are `extraRegions` and `eawsRegions`.

- For all `extraRegions` we load the full CAAML and display the bulletin when such a region is selected in the map. If no CAAML can be found for an `extraRegion`, we display the region as grey (no-rating) and link to the corresponding warning service.
- For `eawsRegions` we only load the rating and link to the official site. If no rating is present in `ratings.json` we display the region as transparent (no color).

The parameter `province=...` overrides `regionCodes`. The regions of `regionCodes` get demoted to `extraRegions` in that case.

## Server configuration (Caddy)

```
www.avalanche.report, avalanche.report {
	handle_path /beta/* {
		root * /var/www/avalanche.report/beta/
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

### Incident report strings

`app/i18n/incident-report/en.json` is **not** an albina-website resource — it
is the `incident-report` resource of the
[albina-admin-gui](https://github.com/albina-euregio/albina-admin-gui)
Transifex project (`src/assets/i18n/incident-report/en.json` there), shared
so this repo can display the same translated labels for incident data.

Treat **albina-admin-gui** as the source of truth: add or change keys there
first and `tx push` from that repo. Pulling here fetches both the
translations and the current source strings, so `en.json` in this repo stays
in sync automatically — never edit it by hand:

```sh
# fetch updated translations from Transifex
$ tx pull --use-git-timestamps
# also refresh en.json itself, since the source lives in albina-admin-gui
$ tx pull --source --use-git-timestamps albina-admin-gui.incident-report
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
