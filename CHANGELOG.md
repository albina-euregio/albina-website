# Changelog

<!-- Update using `yarn changelog <TAG>` before creating new tag <TAG> with git. -->

## [8.0.0] - 2025-11-04

### Breaking Changes

- This project is now licensed under the GNU Affero General Public License v3.0

### 🚀 Features

- _(archive)_ South Tyrol and Trentino
- _(archive)_ Use $province
- _(blog)_ Support headless
- _(bulletin)_ Use $province
- _(enable-weather-text-input)_ Add weather section to bulletin report
- _(general-headline)_ Add support for general headline in bulletin view
- _(general-headline)_ Render general headline if configured and present in CAAML
- _(iframe-headless-website)_ Add new headless routes with HeadlessContext for static pages
- _(iframe-headless-website)_ Link to headless archive and back to headless bulletin
- _(iframe-headless-website)_ Removed headlesscontext from bulletin and archive and placed it within the headless routes
- _(iframe-headless-website)_ Set back link on static pages if in headless context
- _(iframe-headless-website)_ Set map ratio in desktop CSS variable
- _(iframe-headless-website)_ Stay in headless mode on static pages
- _(persist-province)_ Allow unlimited map height in maps using custom aspect ratio
- _(persist-province)_ Extended app store to persist province code. Apply province in leaflet map.
- _(persist-province)_ Filter microRegions in archive based on the persisted province code
- _(persist-province)_ Use persisted province code to build bulletin URL
- _(subscribe-dialogs)_ Use optional province for default region selection in dialogs
- _(time-period-switch)_ Add toggling between time periods (earlier/later) for daytime-dependent map view
- _(time-period-switch)_ Styles for daytime period switch
- _(weather-station-diagrams)_ Use linea
- _(weather-station-uplot)_ Enable for GeoSphere Austria
- _(weather-station-uplot)_ Enable for HD Tirol
- _(weather-station-uplot)_ Enable for LWD Kärnten
- _(weather-station-uplot)_ Enable for Trentino
- _(xml-download-buttons)_ Added buttons to download CAAML XMLs
- _(xml-download-buttons)_ Harmonised CAAML v6 download button labels and showing buttons only if active bulletins are available.
- Load bulletins from extra regions AT/DE/IT

### ⚙️ Miscellaneous Tasks

- "Back to Avalanche Forecast"
- _(about)_ Change name of institution in IT-32-BZ
- _(apps)_ Use webp everywhere
- _(archive)_ Support headless
- _(AT-02)_ Add bounds
- _(build)_ Yarn 4.10.2
- _(build)_ Yarn 4.9.2
- _(config)_ Show bulletins after click, deactivate general headline om prod
- _(content-files)_ Use webp everywhere
- _(eaws-regions)_ Upgrade to v7.0.9
- _(eaws-regions)_ Upgrade to v8.0.0
- _(eaws-regions)_ Upgrade to v8.0.2
- _(eaws-regions)_ Upgrade to v8.0.3
- _(eaws-regions)_ Upgrade to v8.0.6
- _(eaws-regions)_ Upgrade to v8.0.7
- _(eaws-regions)_ Upgrade to v8.0.8
- _(education)_ Replace srcset with single img, update translations
- _(handbook)_ Update micro-regions
- _(handbook)_ Update number of micro regions
- _(handbook)_ Use generic dangerscale map image for all languages
- _(i18n)_ Update translations
- _(i18n)_ Update translations for about page
- _(iframe-demo)_ AT-02
- _(iframe-headless-website)_ Include `language` parameter in iframe URLs for localhost and lawinen-warnung.eu
- _(license)_ Define AGPLv3 license in package.json
- _(map)_ Highlight current province on map, fall back to EUREGIO
- _(open-data)_ Update license text
- _(pbf-map)_ Pbf?version to fix caching issue
- _(playwright)_ Automatically trigger tests
- _(playwright)_ Update tests
- _(problems)_ Use webp everywhere
- _(README)_ Document caddy
- _(README)_ Document deployment
- _(scss)_ Remove obsolete png files
- _(scss)_ Use webp everywhere
- _(subscribe)_ Add WhatsApp subscribe dialog
- _(vr)_ Change available languages to de and en
- _(weather-station-diagrams)_ Mobile style
- _(weather-station-diagrams)_ Style toggle-btn
- _(weather-station-diagrams)_ Swipe only on header
- _(weather-station-uplot)_ ENABLE_UPLOT
- _(weather-station)_ TimeRangeMilli
- Apply config.projectRoot for content_files
- \*(bulletin): move provider below headline
- Iframe script (?date=2025-03-14)
- Iframe script (AT-02)
- Iframe script (build using vite)
- Iframe script (import @iframe-resizer/parent)
- Iframe script (typescript)
- Iframe script (URLSearchParams)
- Update config.json
- Update to iframe-resizer 5.5.1
- Update to react 19.2.0
- Update to zod 3.25.57
- Update to zod 4.0.5
- Update to zod 4.1.12
- Update transifex docs
- Upgrade to @albina-euregio/linea 8.0.1
- Upgrade to @albina-euregio/linea 8.0.3
- Upgrade to @albina-euregio/linea 8.0.4
- Upgrade to @albina-euregio/linea 8.0.5
- Upgrade to @albina-euregio/linea 8.0.6
- Upgrade to @albina-euregio/linea 8.0.7
- Upgrade to @albina-euregio/linea 8.0.8
- Upgrade to @albina-euregio/linea 8.1.0
- Upgrade to @albina-euregio/linea 8.1.1
- Upgrade to eslint 9.28.0
- Upgrade to leaflet 2.0.0-alpha
- Upgrade to leaflet 2.0.0-alpha.1-51-gf8fef451
- Upgrade to leaflet 2.0.0-alpha1
- Upgrade to leaflet pre-2.0.0
- Upgrade to leaflet pre-2.0.0 (remove_factories)
- Upgrade to leaflet.locatecontrol 0.84.1
- Upgrade to prettier 3.6.3
- Use HTTPS for avalanches.org and europaregion.info
- Upgrade to rolldown-vite 6.3.15
- Upgrade to rolldown-vite 6.3.19
- Upgrade to rolldown-vite 7.0.10
- Upgrade to rolldown-vite 7.0.12
- Upgrade to rolldown-vite 7.0.3
- Upgrade to rolldown-vite 7.0.9
- Upgrade to rolldown-vite 7.1.0
- Upgrade to rolldown-vite 7.1.11
- Upgrade to rolldown-vite 7.1.14
- Upgrade to rolldown-vite 7.1.15
- Upgrade to rolldown-vite 7.1.16
- Upgrade to rolldown-vite 7.1.17
- Upgrade to rolldown-vite 7.1.18
- Upgrade to rolldown-vite 7.1.19
- Upgrade to rolldown-vite 7.1.20
- Upgrade to rolldown-vite 7.2.0-beta.0
- Use @vitejs/plugin-react-oxc
- Migrate to osxlint

## [7.2.12] - 2025-05-07

### 🐛 Bug Fixes

- Bulletin: Show neighbor danger ratings if not own bulletin exists
- Bulletin: Fix aspect ratio for earlier/later maps
- Weather maps: Fix aspect ratio for weather maps

### Weather Stations

- Add new interactive plots

### ⚙️ Miscellaneous Tasks

- Update to react 19.1.0

## [7.2.11] - 2025-04-19

### 🐛 Bug Fixes

- Fix back to map buttons in bulletin

### Bulletin

- Update weather link for Tyrol

### ⚙️ Miscellaneous Tasks

- Upgrade to vite 6.3.1
- Update to iframe-resizer 5.4.4

## [7.2.10] - 2025-04-16

### 🐛 Bug Fixes

- Weather maps: Calculation of UpdateTime

### Bulletin

- Enable iFrame resizing
- Add script to load avalanche warning iframe
- Add iframe-demo.html

### ⚙️ Miscellaneous Tasks

- Use @zod/mini
- Upgrade to zod 4.0.0-beta
- Update to nanostores 1.0.1
- Upgrade to vite 6.2.6
- Update to temporal-polyfill 0.3.0

## [7.2.9] - 2025-04-10

### 🐛 Bug Fixes

- Focus on province with query parameter, e.g. _?province=IT-32-TN_

### 🚜 Refactor

- Use zod
- Bulletin status line: Deduplicate publicationTime Date objects
- @eaws/micro-regions_names glob

### ⚙️ Miscellaneous Tasks

- Update eaws-regions dependency to v7.0.7

### Weather Maps

- Weather cockpit: Change color of selectable-hours borders from red to grey, use light grey background for the past

## [7.2.8] - 2025-03-14

### Weather Maps

- Fix cockpit position on Safari
- Fix size on mobile

### Bulletin

- Development instance: show selected bulletin only

## [7.2.7] - 2025-03-10

### Weather Maps

- Register timeline shortcuts globally
- Fix dubious scrollbars on odd zoom levels
- Weather station dialog: enable month and winter time ranges in addition to week time range
- Weather station measurements table: clarify aggregation of wind parameters

## [7.2.6] - 2025-02-19

### Weather Maps

- Change EUREGIO bounds to center EUREGIO on init
- Show data layer info in attribution only in debug mode
- Bugfix: load correct station measurements (regression in 7.2.5)

## [7.2.5] - 2025-02-17

### Weather Maps

- Use full width on mobile for weather parameters

### Bulletin

- Add glossary links for slope discontinuity in DE and IT

### 🚜 Refactor

- Use Temporal

### ⚙️ Miscellaneous Tasks

- Upgrade to prettier 3.5.0
- Upgrade to vite 6.1.0

## [7.2.4] - 2025-01-31

### Weather Maps

- Introduce deep links to weather maps

### 🐛 Bug Fixes

- Correct highlighting of warning regions for old bulletins

### ⚙️ Miscellaneous Tasks

- Update translations
- Upgrade EAWS regions to v7.0.6

## [7.2.3] - 2025-01-21

### 🚀 Features

- Set maxZoom to 12 for station map
- Click to enlarge images in blog posts

## [7.2.2] - 2025-01-20

### Weather Maps

- Change parameter using keyboard shortcuts (p/n)
- Always show wind arrows for high elevation wind
- Show weather stations for wind gust

### 🚀 Features

- Introduce URL parameter one-danger-rating=1 to not show elevation dependent danger ratings

## [7.2.1] - 2025-01-16

### Weather Maps

- Change timespan using ↑/↓
- Focus scale for key handling
- Use async-await for weather map overlays
- Improve performance of station markers
- Improve tooltips position

## [7.2.0] - 2025-01-07

### Weather Maps

- Use weather maps produced by C-LAEF model
- Provide 10 m wind, 10 m wind gust and high altitude wind as parameters

### 🚀 Features

- Enable interactive weather station diagrams for for South Tyrol

### 📚 Documentation

- Workflow for generating changelog

### ⚙️ Miscellaneous Tasks

- Upgrade to eslint 9.17.0
- Remove mobx and mobx-react (use nanostores instead)

## [7.1.1] - 2024-12-30

### 🐛 Bug Fixes

- Fix 12h snow-diff in weather maps
- Fix CAAMLv5 links

## [7.1.0] - 2024-12-19

### Weather Maps

- Implement draggable datetime bar
- Add descriptive text to weather parameters
- Allow more parameters in weather cockpit
- Add calendar icon to select dates in the past

### Documentation

- Workflow for CHANGELOG

### Miscellaneous Tasks

- Upgrade EAWS regions to v7.0.5
- Various package upgrades

## [7.0.5] - 2024-12-09

### Documentation

- Comprehensive CHANGELOG

### Miscellaneous Tasks

- Minor bugfixes
- Various package upgrades

## [7.0.4] - 2024-11-28

### Miscellaneous

- Add season report for 2023/24 for Austria

## [7.0.3] - 2024-11-25

### Tech Blog

- The 'More' section now includes a Tech Blog dedicated to sharing technical updates and
  news about the ALBINA project.

### Miscellaneous

- Different favicons and logos for beta and dev

## [7.0.2] - 2024-11-13

### Bulletin Diff

- When a bulletin has been updated after publication, this is indicated at the top of the page. For each region, a visualization of the differences to the previous version can be viewed.  
  (This feature has been tested on beta for several months, and was now enabled in production.)

## [7.0.1] - 2024-11-07

### Miscellaneous

- Ability to create PDFs per warning region (in the currently selected language)
- Improved diagrams for weather stations

## [7.0.0] - 2024-10-15

### Breaking Changes

- Bulletins are now valid from 5pm until 5pm.  
  The validity is displayed at the top of the page for each bulletin.

### Blog

- Blog entries have associated categories for easier filtering:  
  _Current situation_, _Incident_, _Education_, _Statistics_, _Winter review_

### Miscellaneous

- The 'Station Archive' section now includes historical data of weather station for South Tyrol
- Add season report for 2023/24 for South Tyrol
