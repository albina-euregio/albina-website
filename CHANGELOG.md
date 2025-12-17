# Changelog

<!-- Update using `yarn changelog <TAG>` before creating new tag <TAG> with git. -->

## [8.0.8] - 2025-12-17

### 🚀 Features

- Integrate ÖBB INFRA weather stations

## [8.0.7] - 2025-12-15

### 🚀 Features

- StationDataStore: fetch from multiple sources
- Blog: add AT-02
- WeatherStationDiagrams: use linea for observer diagrams

### 🐛 Bug Fixes

- Fix PDF link by using province
- Use province placeholder in PDF URL configuration
- Fix IFrame: build iframe.ts using rolldown, verify dist/iframe.js exists, simplify chunkFileNames
- Fix header in headless section-weather-map

### 💼 Other

- Upgrade to @albina-euregio/linea 8.2.3
- Upgrade to vite 8.0.0-beta.1

### ⚙️ Miscellaneous Tasks

- Use zod in stationDataStore

## [8.0.6] - 2025-12-09

### 🚀 Features

- Support logo in headless
- Configure ES-AR

### 🐛 Bug Fixes

- Handle empty config.eawsRegions in bulletinCollection
- Show AM/PM map only if own bulletins have daytime dependency

### 💼 Other

- Upgrade to vite 8.0.0-beta.0

### ⚙️ Miscellaneous Tasks

- Show markers for gust in weather maps

## [8.0.4] - 2025-12-02

### 🚀 Features

- Add parameters for province and headless in config file
- Use brand color in geonames
- Use brand color in colorbar
- Add weather button for selected provinces in footer

### 🐛 Bug Fixes

- Fix comparision of aspects
- Do not require threshold in micro-regions

### 🚜 Refactor

- Remove @sentry/react

### ⚙️ Miscellaneous Tasks

- Update glossary content
- Omit region ID in filename

## [8.0.3] - 2025-11-28

### 🚀 Features

- Add season report 24/25 for Austria
- Show matrix parameters only for avalanche type slab
- Load bulletins from extra regions SI

### 🐛 Bug Fixes

- Safari 16.5 compatibility for leaflet
- Remove broken marker cluster in station overlay

### ⚙️ Miscellaneous Tasks

- Upgrade eaws-regions to v8.1.0
- Update sentry to 10.26.0

## [8.0.2] - 2025-11-24

### 🚀 Features

- Visualize bulletins of Slovenia
- Add season report 24/25 for Austria
- Show matrix parameters only for avalanche type slab

### 🐛 Bug Fixes

- Remove broken marker cluster on weather station map
- Fix Safari 16.5 compatibility of leaflet

### ⚙️ Miscellaneous Tasks

- Upgrade to sentry 10.26.0
- Upgrade to eaws-regions v8.1.0

## [8.0.1] - 2025-11-04

### 🚀 Features

- Adopt subscribe options to active province
- Improve IFrame script
- Provide weather archive and weather station measurements headless

### 🚜 Refactor

- Include content_files in project

### 📚 Documentation

- Document caddy

### ⚙️ Miscellaneous Tasks

- Upgrade to LINEA 8.1.3
- Upgrade to sass 1.94.0
- Upgrade to rolldown-vite 7.2.2
- Upgrade to rolldown-vite 7.2.0
- Upgrade to git-cliff 2.10.1

## [8.0.0] - 2025-11-04

### Breaking Changes

- This project is now licensed under the GNU Affero General Public License v3.0

### 🚀 Features

- Display bulletins from additional warning services directly on the website
- Add an optional weather section to bulletins
- Add an optional general headline to bulletins
- Display only the selected bulletin below the map
- Support province selection via query parameter (e.g. avalanche.report?province=AT07)
- Provide a headless version of the website (e.g. avalanche.report?headless=1)
- Allow switching between dual-map view (earlier/later) and daytime-dependent map mode via toggle button
- Integrate interactive diagrams for weather stations
- Add download options for XML and JSON bulletin data in CAAMLv6 format
- Integrate updated micro-regions
- Enable subscription via WhatsApp channel

### ⚙️ Miscellaneous Tasks

- Add automated Playwright tests
- Add documentation for web server configuration and deployment
- Use WebP as the standard format for all images
- Improve integration options for embedding the website via IFrame
- Migrate to the Micronaut framework (no Tomcat needed anymore)
- Upgrade all dependencies to the latest versions

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
