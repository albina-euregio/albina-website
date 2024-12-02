# Changelog

All notable changes to this project will be documented in this file.

## [unreleased]

### 🐛 Bug Fixes

- *(bulletin-report)* Nofollow for PDF links

## [7.0.4] - 2024-11-28

### 🐛 Bug Fixes

- Fix(yarn.lock)

### ⚙️ Miscellaneous Tasks

- *(eaws-regions)* Update dependency to v7.0.1
- *(open-data)* Textcat-ng is using Vue.js now
- *(build)* Yarn 4.5.3
- *(eaws-regions)* Update dependency to v7.0.2
- *(season-reports)* Add season report for 2023-24 for austria

## [7.0.3] - 2024-11-25

### 🚀 Features

- Different favicons and logos for beta and dev
- Tech blog

### 🐛 Bug Fixes

- *(handbook)* Typo in validity
- Misleading warning/error message when accessing /xxx
- Relative href for favicons and manifest
- Relative href for icons in manifest
- *(blog)* Remove sizes attribute from <img>

### 💼 Other

- Revert "fix: relative href for favicons and manifest"

This reverts commit bc62f6628cf3c35a4a56a21e987804cc79f5c5e3.
- Merge branch 'favicons' into 'master'

feat: different favicons and logos for beta and dev

Closes #579

See merge request albina-euregio/albina-website!466
- Merge branch 'tech-blog' into 'master'

feat: tech blog

Closes #628

See merge request albina-euregio/albina-website!464

### 🚜 Refactor

- Typescript-eslint strict+stylistic
- *(blogStore)* Simplify postsList
- *(blogStore)* BlogConfigs as computed
- Rename blogPostList
- *(blogStore)* Use postItems

### ⚙️ Miscellaneous Tasks

- Upgrade to react 19.0.0-rc-7ac8e612-20241113
- Upgrade to sass 1.80.7
- Upgrade to vite 5.4.11
- Upgrade to eslint 9.14.0
- Update to nanostores/react 0.8.0
- *(handbook)* Update validity of bulletin
- *(i18n)* Update translations
- Upgrade to eslint 9.15.0
- Upgrade to typescript 5.7.2

## [7.0.2] - 2024-11-13

### ⚙️ Miscellaneous Tasks

- *(diff)* Enable diffing for prod

## [7.0.1] - 2024-11-07

### 🚀 Features

- *(weather-station-diagrams)* Hide "interactive" if not available
- *(weather-station-diagrams)* Wind direction with nominal axis
- *(bulletin-report)* Link to PDF on demand
- *(archive-item)* Link to PDF on demand

### 🐛 Bug Fixes

- *(bulletin-status-line)* IsReport if >= 1

### 💼 Other

- Add download PDF to bulletin-header
- Merge branch 'master' into feature/bulletin-header
- Merge branch 'feature/bulletin-header' into 'master'

feat(bulletin-report): link to PDF on demand

Closes #616

See merge request albina-euregio/albina-website!461

### 🚜 Refactor

- *(weather-station-diagrams)* Move DW plot config

### ⚙️ Miscellaneous Tasks

- *(weather-station-diagrams)* Move unit to axis label
- *(vr)* Update meta store link
- *(eaws-regions)* Update dependency to v7.0.0

## [7.0.0] - 2024-10-15

### 🚀 Features

- *(open-data)* Add open-source licenses
- *(stationArchive)* Add IT-32-BZ
- *(blog)* Fetch categories
- *(blog)* Filter by categories
- *(blog)* Deduplicate categories
- *(blog)* Deduplicate categories

### 🐛 Bug Fixes

- *(bulletin-buttonbar)* Do not show 0 in case no bulletin is available
- Fix missing previous bulletin

fixes #613
- Fix style regression

fixes #614
- *(i18n)* Type MessageId
- *(blog)* Initial search language
- *(dataOverlay)* 3950m snow-line click
- *(bulletin-legend)* Key

### 💼 Other

- Merge branch 'open-source-licenses' into 'master'

feat(open-data): add open-source licenses

See merge request albina-euregio/albina-website!456
- Close X in bulletin-map-details, validity and icons in bulletin-header
- Revert "feat: fallback for weather station data/plots"

This partially reverts commit 1e26e80cf39d5de64ecf2ffe30c23266e68ce908.

The project stations.avalanche.report has been terminated!
- Merge branch 'master' into feature/bulletin-validity
- Implement functionality
- Add tooltip
- Add functionality to close details button
- Hide caption on close button
- Merge branch 'feature/bulletin-validity' into 'master'

Feature/bulletin validity

See merge request albina-euregio/albina-website!457
- Merge branch 'master' into feature/bulletin-validity
- Distinguish between report and bulletin header

in regard to !457
- Fixed style for update notification within bulletin header
- Merge remote-tracking branch 'origin/feature/bulletin-validity' into feature/bulletin-validity-refinements
- Revert "feat(blog): deduplicate categories"

This reverts commit 87f00ef68dcdb159b25648a4cd2acf70703d94e6.
- Merge branch 'blog' into 'master'

Use categories in blog

Closes #606

See merge request albina-euregio/albina-website!459
- Merge branch 'feature/bulletin-validity-refinements' into 'master'

Refine bulletin information

Closes #613

See merge request albina-euregio/albina-website!458
- Merge branch 'master' into fix/614-style-regression-for-neighbour-aws-p
- Merge branch 'fix/614-style-regression-for-neighbour-aws-p' into 'master'

fix style regression

Closes #614

See merge request albina-euregio/albina-website!460

### 🚜 Refactor

- *(clamp)* Convert to TypeScript
- *(avalancheProblems)* Convert to TypeScript
- *(parseSearchParams)* Inline and use URL.searchParams
- Refact(wordpress)
- *(wordpress)* Fetch categories/tags via _embed
- *(blog)* Use RegExp.exec
- Refact(wordpress)
- *(blogStore)* Nanostores
- *(wordpress)* Fetch categories/tags via _embed
- *(blogStore)* Nanostores
- *(blogStore)* Nanostores
- *(blogStore)* Nanostores
- *(blogStore)* Nanostores
- *(blogStore)* Nanostores
- *(blog)* Drop mobx observer
- Remove unused selectric  dependency
- *(menu)* Extract MenuItem component

### ⚙️ Miscellaneous Tasks

- *(build)* Remove rollup-plugin-gzip
- *(build)* Yarn 4.2.2
- Upgrade to react 19.0.0 RC
- Upgrade to vite 5.2.12
- Update sentry to 8.7.0
- Upgrade to prettier 3.3.1
- Replace <title> for social media preview
- Update @playwright
- Upgrade to vite 5.3.1
- *(uplot)* Tune width
- *(uplot)* Date axis
- *(uplot)* Sync cursor
- *(build)* Yarn 4.3.1
- *(i18n)* Update translations
- Upgrade to react 19.0.0-rc-9c6806964f-20240703
- *(i18n)* Update translations
- *(workflow)* Add svg grafic
- *(i18n)* Add translations for workflow
- *(blog)* Display all categories/tags as tag-list
- *(blog)* Parse any valid_XXh tag
- *(blog)* Hide valid_XXh in tag-list
- *(blog)* Hide uncategorized in tag-list
- *(config)* Types
- *(config)* Types
- *(blog)* Search params
- *(i18n)* Update translations
- *(blog)* Valid_72h by default
- *(blog)* Make category tag clickable
- *(blog)* Search params
- *(blog)* Force language selection for blog overview
- Update to nanostores 0.10.3
- *(meteo-report)* Add link to menu, closes #615
- *(meteo-report)* Use language dependend link, add translations
- *(build)* Yarn 4.4.1
- Upgrade to react 19.0.0-rc-f90a6bcc-20240827
- Upgrade to react 19.0.0-rc-4c58fce7-20240904
- Upgrade to vite 5.4.3
- Upgrade to eslint 9.9.1
- Upgrade to uplot 1.6.30
- Update eslint-plugin-*
- Upgrade to sass 1.78.0
- Upgrade to purecss-sass 3.0.1
- Update to nanostores 0.11.3
- Update to floating-ui 0.26.23
- *(dataOverlay)* WillReadFrequently
- *(build)* Yarn 4.5.0
- Upgrade to react 19.0.0-rc-cd22717c-20241013
- Upgrade to eslint 9.12.0
- *(season-reports)* Add avalanchereport 2023/24

## [6.5.5] - 2024-06-04

### 🐛 Bug Fixes

- *(content)* Typos in en.html
- *(stationDataStore)* Load is undefined
- *(wordpress)* Limit number of posts to 99

### 💼 Other

- Merge branch 'open-data-caaml' into 'master'

chore(open-data): add CAAMLv6 links

Closes #539

See merge request albina-euregio/albina-website!454
- Merge branch 'yarn4' into 'master'

chore(build): Yarn 4 using Node.js Corepack

See merge request albina-euregio/albina-website!455

### ⚙️ Miscellaneous Tasks

- *(open-data)* Add CAAMLv6 links
- *(map)* Fix attribution URL
- *(i18n)* Update translations
- *(build)* Yarn 4 using Node.js Corepack

## [6.5.4] - 2024-04-09

### 💼 Other

- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Rotate leaflet-control-attribution
- Rotate attribution for bulletin map as well
- Merge branch 'feature/#605-map-attribution' into 'master'

Rotate leaflet-control-attribution

See merge request albina-euregio/albina-website!453

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations

## [6.5.3] - 2024-04-02

### 🐛 Bug Fixes

- *(bulletinCollection)* Loading 17:00 bulletin in summer time
- *(bulletinCollection)* Loading 17:00 bulletin in summer time

### 💼 Other

- Merge branch 'master' into feature/#599-add-url-to-logo
- Add domain to logo for added languages
- Merge branch 'feature/#599-add-url-to-logo' of https://gitlab.com/albina-euregio/albina-website into feature/#599-add-url-to-logo
- Merge branch 'feature/#599-add-url-to-logo' into 'master'

Feature/#599 add url to logo

See merge request albina-euregio/albina-website!452

### 🚜 Refactor

- *(date)* Use dateFormat for dateToISODateString
- *(date)* ParseDate

### ⚙️ Miscellaneous Tasks

- *(map)* Add attribution
- *(map)* Style attribution
- *(bulletinCollection)* Loading 17:00 bulletin robustness

## [6.5.2] - 2024-04-01

### 🐛 Bug Fixes

- *(diff)* Do not check for update (dirty fix)
- *(diff)* Do not check for update (dirty fix)
- *(diff)* Do not check for update (dirty fix)

## [6.5.1] - 2024-03-31

### 🚀 Features

- *(weather-station-diagrams)* UPlot diagrams
- *(weather-station-diagrams)* UPlot diagrams
- /headless/bulletin

### 🐛 Bug Fixes

- *(config)* Add missing entry in config-dev.json, fixes #598
- *(diff)* Consider AvalancheProblem.validTimePeriod
- *(weather-station-uplot)* Eslint
- *(stationArchiveTable)* 0 is a valid number
- Fix winter summer change

fix #602 #603

### 💼 Other

- Incorporate styles from button.scss and bulletin.scss
- Merge branch 'uplot' into 'master'

feat(weather-station-diagrams): uPlot diagrams

See merge request albina-euregio/albina-website!444
- Update tsconfig.json
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'headless' into 'master'

feat: /headless/bulletin

See merge request albina-euregio/albina-website!449
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'fix/602-fresh-snow-maps-not-working' into 'master'

fix winter summer change

Closes #602 and #603

See merge request albina-euregio/albina-website!450

### 🚜 Refactor

- Extract util/template.ts
- Extract util/isWebPushSupported.ts
- *(bulletin-legend)* Use warnlevelNumbers
- *(routing)* Consolidate /bulletin/latest redirects
- *(routing)* Use <Outlet>
- *(bulletin-date-flipper)* Function bulletinURL
- Intl.formatNumberUnit

### ⚙️ Miscellaneous Tasks

- Upgrade to vite 5.2.6
- Upgrade to typescript 5.4.3
- *(i18n)* Update translations
- *(weather-station-diagrams)* Iso-8859-1
- *(weather-station-uplot)* Smet
- *(weather-station-uplot)* Parameters
- *(weather-station-uplot)* Smet
- *(weather-station-uplot)* ENABLE_UPLOT /beta/
- *(weather-station-uplot)* Smet nodata
- *(weather-station-uplot)* Convert units
- *(i18n)* Update translations
- *(snowhow)* Remove app, closes #600
- Social media URLs from eaws-regions

## [6.5.0] - 2024-02-28

### 🐛 Bug Fixes

- Fix className handling
- Fix className handling #2
- Fix className setting
- *(diff)* Show green border for region map only if showDiff
- *(diff)* Add parenthesis
- *(diff)* Add space
- *(lint)* Use button for diffing

### 💼 Other

- Merge branch 'master' into feature/update-diff-style
- Less intrusive update styles plus outline trick
- Add tooltip
- Highlight first line
- Highlight first line #2
- Merge branch 'master' into feature/update-diff-style
- Merge branch 'feature/update-diff-style' into 'master'

Feature/update diff style

See merge request albina-euregio/albina-website!447
- Merge branch 'master' into feature/update-diff-style
- Merge branch 'master' into feature/update-diff-style
- Merge branch 'feature/update-diff-style' into 'master'

Feature/update diff style

See merge request albina-euregio/albina-website!448

### 🚜 Refactor

- *(date)* Types

### 🎨 Styling

- Style update diff in bulletin

### ⚙️ Miscellaneous Tasks

- *(synthesized-bulletin)* Enable for Italian
- Upgrade to eslint 8.56.0
- *(diff)* Use different icons
- *(diff)* Move text into separate line
- *(diff)* Move outline to own css class
- *(menu)* Restructure education

## [6.4.0] - 2024-02-12

### 🐛 Bug Fixes

- Playwright tests
- *(main)* Top-level await is not available in the configured target environment
- Disable jsx-a11y/label-has-associated-control
- React-hooks/exhaustive-deps
- Fd_EUREGIO_thumbnail.webp does not exist
- *(bulletin-glossary)* Must escape "Resistencia (de la nieve)" for RegEx in Spanish
- Fd_EUREGIO_thumbnail.webp does not exist on /bulletin/2022-02-01

### 💼 Other

- Merge branch 'master' into protomaps
- Merge branch 'protomaps' into 'master'

refact(pbf-map): EAWS bulletin loading

See merge request albina-euregio/albina-website!437
- Merge branch 'webp' into 'master'

refact: webp is widely available now

See merge request albina-euregio/albina-website!445
- Merge branch 'synthesized-bulletin-en' into 'master'

chore(synthesized-bulletin): enable for English

See merge request albina-euregio/albina-website!446

### 🚜 Refactor

- *(date)* Convert to TypeScript
- *(date)* Simplify getPredDate/getSuccDate
- *(date)* Simplify parseDate
- *(date)* IsRepublished without isSummerTime
- *(blendMode)* Mix-blend-mode is widely avaiable now
- *(storageAvailable)* LocalStorage is widely available now
- *(wordDiff)* Rename to .ts
- *(scrollIntoView)* Rename to .ts
- Webp is widely available now
- *(sm-share)* Convert to TypeScript
- *(sm-follow)* Convert to TypeScript
- *(page-headline)* Convert to TypeScript
- *(page-header)* Convert to TypeScript
- *(page-footer)* Convert to TypeScript
- *(jumpnav)* Convert to TypeScript
- *(html-header)* Convert to TypeScript
- *(footer-logos)* Convert to TypeScript
- *(filter-bar)* Convert to TypeScript
- *(control-bar)* Convert to TypeScript
- *(selectric)* Convert to TypeScript
- *(search-field)* Convert to TypeScript
- *(page)* Convert to TypeScript
- *(app)* Convert to TypeScript
- *(overviewPage)* Delete obsolete component
- *(page-flipper)* Convert to TypeScript
- *(sm-share)* Fix types
- *(subscribe-dialog)* Convert to TypeScript
- Move customLeafletControl.jsx
- *(station-icon)* Convert to TypeScript
- *(station-marker)* Convert to TypeScript
- Remove empty leaflet-player.css
- Move dataOverlay.jsx
- *(leaflet-map-controls)* Convert to TypeScript
- Move components to weather/leaflet

### ⚙️ Miscellaneous Tasks

- Upgrade to vite 5.1.0
- Upgrade to prettier 3.2.5
- *(bulletin-status-line)* Use CAAML `unscheduled` flag
- *(bulletin-problem-icon)* Do not show snowpack stability for glide snow
- *(synthesized-bulletin)* Enable for English
- *(synthesized-bulletin)* Use static.avalanche.report/bulletins
- *(weather-maps)* Disable debug mode in production!
- *(stationMap)* Rename menu to "Station Map"
- *(tests)* Test blog
- *(synthesized-bulletin)* Use onError to determine if audio file exists
- *(tests)* Test glossary links

## [6.3.3] - 2024-02-08

### ⚙️ Miscellaneous Tasks

- *(open-data)* Add license for data

## [6.3.2] - 2024-02-05

### 🚀 Features

- *(bulletin-report)* Show text diff for update
- *(bulletin-report)* Show text diff for update
- Show updated only if bulletin changed

### 🐛 Bug Fixes

- *(findBreaks)* Should have a unique "key" prop
- Eslint-disable-next-line jsx-a11y/no-static-element-interactions
- Diff order
- ShowDiff 0
- Glossary tooltips inside <ins>
- No bulletin 17:00 no diff

### 💼 Other

- Merge branch 'update-diff' into 'master'

feat(bulletin-report): show text diff for update

See merge request albina-euregio/albina-website!442
- Handle missing startdate
- Make parameter optional
- Remove jquery postition retrieval
- Add debugging info for browserstack for IOS devices
- Hide log

fixes #586
- Merge branch 'fix/586-loading-issue-on-ios' into 'master'

handle missing startdate

Closes #586

See merge request albina-euregio/albina-website!443

### 🚜 Refactor

- Rename sentry.ts

### ⚙️ Miscellaneous Tasks

- Find split regions in bulletin updates
- Word diff using diff-match-patch algorithm
- Ternary diff state
- Danger pattern diff
- Danger rating diff
- Tendency type diff
- Avalanche problem diff
- Regions diff
- Enable diffing only for /beta/
- *(sentry)* Exclude leaflet reading '_leaflet_pos'
- *(sentry)* Exclude "Importing a module script failed"
- *(sentry)* Exclude eaws_pbf breadcrumbs
- *(sentry)* Exclude "Failed to fetch dynamically imported module"
- *(sentry)* Exclude "Load failed"

## [6.3.1] - 2024-01-24

### 🐛 Bug Fixes

- *(weather-station-diagrams)* MicroRegion for observers

### 🚜 Refactor

- *(bulletinCollection)* LoadEawsBulletins
- *(pbf-map)* Type RegionState
- *(bulletins)* Object.values(problems)
- *(pbf-map)* GetRegionState
- *(pbf-map)* Migrate to protomaps-leaflet
- *(pbf-map)* Migrate to protomaps-leaflet
- *(pbf-map)* Click handler
- *(pbf-map)* Merge PbfLayerOverlay into PbfLayer
- Extract pbf-region-state.tsx
- Enum EawsRegionDataLayer
- FilterFeature use MicroRegionProperties
- Const dataSource
- RegionStyling = Object.fromEntries
- Type vectorGrid options
- Const regionStyling = useMemo
- Type LeafletPbfLayer
- Extract clickable and hidden to regionStyling
- *(pbf-map)* Extends PolygonSymbolizer

### ⚙️ Miscellaneous Tasks

- *(bulletinCollection)* LoadEawsProblems
- *(bulletin-map)* EAWS problems
- Wire all events to protomaps-leaflet
- VectorGrid.rerenderTiles
- Separate PolygonSymbolizer per danger level
- Separate PolygonSymbolizer per region state
- Function microRegionOrOutline
- Do not load EAWS problems for now
- Use leaflet.vectorgrid again
- Use leaflet.vectorgrid again

## [6.3.0] - 2024-01-17

### 🚀 Features

- *(archive-item)* Download CAAMLv6 JSON
- Replace am/pm with "earlier" and "later" from CAAMLv6
- ScrollIntoView w/o jQuery w/o animejs
- *(bulletin-glossary)* Dynamic import to allow for code splitting

### 🐛 Bug Fixes

- *(tooltip)* React-hooks/rules-of-hooks
- Modal-close-btn z-index
- *(bulletinStore)* MatchesValidTimePeriod
- *(archive-item)* Fix "PDF"
- *(bulletin)* SmShare
- *(html-page-loading-screen)* Types
- *(leaflet-gesture-handling)* Map dragging
- *(archive)* Exhaustive-deps
- *(i18n)* FormattedMessage html=true
- *(i18n)* FormatTime
- *(blogStore)* Search state
- *(weather-station-diagrams)* UseCallback
- *(i18n)* Types
- *(blogStore)* Search state
- <br> in bulletin:report:tendency
- *(bulletin-map)* Loaded={true}
- *(bulletin-map)* Repeated fetching of eaws-bulletins
- *(staticPage)* ScrollIntoView
- *(i18n)* Bulletin:report:dangerlevel tooltips
- *(staticPage)* Repeated fetching of content
- *(stationArchive)* SetActiveYear
- Fix value calculation
- Fix trigger show data point
- Fix keep selected time
- Fix missing keys
- Fix playback
- Fix analytic time
- Fix datamarker
- Fix overlay handling delay
- *(download-pdf-dialog)* ActiveBulletinCollection is undefined
- *(bulletin-toolbar)* Date header for n/a bulletins
- Playwright tests
- *(bulletin-glossary)* French
- *(bulletin-daytime-report)* TendencyType undefined

### 💼 Other

- Merge branch 'validTimePeriod' into 'master'

feat: replace am/pm with "earlier" and "later" from CAAMLv6

Closes #466

See merge request albina-euregio/albina-website!438
- Merge branch 'native-dialog' into 'master'

refact: use native <dialog>

See merge request albina-euregio/albina-website!435
- GitLab CI: bundle size as metrics report

https://docs.gitlab.com/ee/ci/testing/metrics_reports.html
- Merge branch 'nanostores' into 'master'

refact: remove obsolete/huge libraries

See merge request albina-euregio/albina-website!439
- Make timeline functional
- Make dragger functional
- Make weather cockpit functional
- Remove logs
- Rework player and dataoverlay component
- Rework player and dataoverlay component
- Merge branch 'fix/#582-data-overlay-problems-for-snow-heigh' of gitlab.com:albina-euregio/albina-website into fix/#582-data-overlay-problems-for-snow-heigh
- Remove logs
- Refine

fixes #582 #580
- Merge branch 'master' into fix/#582-data-overlay-problems-for-snow-heigh
- Merge branch 'fix/#582-data-overlay-problems-for-snow-heigh' into 'master'

Weather map cockpit rework

Closes #582 and #580

See merge request albina-euregio/albina-website!441

### 🚜 Refactor

- *(vite.config)* Typing
- *(tooltip)* Convert to TypeScript
- *(fetch)* Function fetchExists
- *(archive-item)* Functional components
- *(bulletin-map)* Type Props
- Migrate am/pm to ValidTimePeriod
- Use native <dialog>
- Extract weather-station-dialog
- Use WeatherStationDialog everywhere
- *(weather-station-diagrams)* TypeScript
- *(weather-station-dialog)* W/o modalDataStore
- *(weather-station-diagrams)* Simplify prev/next station
- *(weather-station-diagrams)* Extract YearFlipper
- *(weather-station-diagrams)* Extract StationFlipper
- *(weather-station-diagrams)* Extract MeasurementValues
- *(weather-station-diagrams)* Extract TimeRangeButtons
- *(weather-station-diagrams)* Extract StationDiagramImage
- *(weather-station-diagrams)* Extract StationOperator
- *(weather-station-diagrams)* Inline regionName
- *(stationTable)* Extract StationTableHeaderRow and StationTableDataRow
- Remove unused video-dialog
- *(bulletin-buttonbar)* Use native dialog
- Remove magnific-popup
- *(snowProfileMap)* Use native dialog
- Remove obsolete modal-dialog.jsx
- Remove obsolete modalStateStore.ts
- Remove obsolete fluidvids.js
- Remove modal-trigger debug_selector
- Inline window["page_body"]
- Use document.body.parentElement.lang
- Use nanostores for appStore
- Remove obsolete navigationStore
- Remove obsolete cookieStore
- Remove obsolete mapStore
- Extract microRegions.ts
- Convert blogPost to TypeScript
- *(dataOverlay)* Remove jQuery dependency
- *(leaflet-map-controls)* Remove jQuery dependency
- *(page-header)* Remove jQuery dependency
- *(orientationchange)* Remove jQuery dependency
- *(orientationchange)* Remove animejs dependency
- *(orientationchange)* Inline function
- *(page-header)* Remove animejs dependency
- Remove animejs dependency
- *(selectric)* Remove selectric
- Convert main to TypeScript
- Implement config.template to allow for code splitting of leaflet
- *(tooltip)* Remove framer-motion dependency
- *(leaflet-map)* Use useParams
- *(bulletin)* Convert to TypeScript
- *(bulletin)* Bulletin store data as props
- BulletinCollection.load/loadStatus
- *(bulletin)* UseProblems
- *(microRegions)* EawsRegionIds, microRegionIds
- *(leaflet-map)* Convert to TypeScript
- *(leaflet-map)* Remove obsolete zoom-dependent bounds
- *(microRegions)* EawsRegionIds, microRegionIds
- *(bulletin-map)* Remove obsolete onViewportChanged
- *(bulletin)* UseState for region
- *(bulletin)* UseState for latest
- *(bulletin)* UseState for BulletinCollection
- *(bulletin)* Split useEffect
- Use intl.locale
- Remove obsolete mobx observer
- Rename bulletinCollection.ts
- *(blog)* BlogPostPreviewItem.loadBlogPost
- *(bulletin)* Import leaflet in bulletin-map
- *(bulletin-map)* UseMapEvent
- *(stationMap)* Convert to TypeScript
- *(stationMap)* Functional components
- *(stationDataStore)* UseState for useStationData
- Refact(blogStore)
- *(blogStore)* BlogPostPreviewItem.loadBlogPosts
- *(menu)* Convert to TypeScript
- *(staticPage)* Convert to TypeScript
- *(staticPage)* Inline StaticPageStore.loadPage
- *(appStore)* Function loadMessages
- *(bulletin)* Use @nanostores/i18n
- *(more)* Convert to TypeScript
- *(more)* Functional components
- *(education)* Convert to TypeScript
- *(education)* Functional components
- *(warn-level-icon)* Functional components
- *(weather-station-diagrams)* Functional components
- *(subscribe-telegram-dialog)* Functional components
- *(subscribe-email-dialog)* Functional components
- Use @nanostores/i18n
- *(feature-info)* Convert to TypeScript
- *(feature-info)* Functional components
- Remove react-intl dependency
- @types/react
- *(weather-station-diagrams)* Prop destructuring
- *(weather-map-cockpit)* Use FormattedMessage
- *(linkTree)* Use FormattedMessage
- *(weather-map-cockpit)* Use FormattedDate
- *(timeline)* Use FormattedDate
- *(staticPage)* Inline _fetchData callback
- *(weather-station-diagrams)* Use FormattedNumberUnit
- *(synthesized-bulletin)* Extract URL to config
- *(blogPostPreviewItem)* Inline parseTags

### ⚡ Performance

- *(bulletin-glossary)* Set loading=lazy for images
- *(bulletin-glossary)* Run HTML parser not before tooltip is shown

### ⚙️ Miscellaneous Tasks

- *(pbf-map)* Load combined EAWS bulletin file
- *(weather-station-dialog)* Close button
- Add config for bun.sh bundler
- *(weather-station-dialog)* Width=90vw
- *(weather-station-dialog)* Border=0
- *(modals)* Animation
- *(i18n)* Update translations
- *(bulletin)* Reload when language changes
- *(menu)* Remove blogStore/mobx dependency
- *(i18n)* ReactStringReplace
- *(i18n)* ReactStringReplace
- *(i18n)* Inline @nanostores/i18n format
- *(glossary)* Update glossary content
- *(bulletinCollection)* Do not load bulletin w/o date
- *(eslint)* @typescript-eslint/prefer-includes
- *(eslint)* @typescript-eslint/prefer-string-starts-ends-with
- *(eslint)* @typescript-eslint/prefer-regexp-exec
- *(eslint)* @typescript-eslint/prefer-optional-chain
- *(eslint)* @typescript-eslint/prefer-for-of
- *(eslint)* @typescript-eslint/prefer-enum-initializers
- *(eslint)* @typescript-eslint/prefer-as-const
- Update @playwright

## [6.2.5] - 2023-12-22

### 🐛 Bug Fixes

- *(bulletin)* Navigate hash

## [6.2.4] - 2023-12-22

### 🐛 Bug Fixes

- Tendency date is off by 1

## [6.2.3] - 2023-12-18

### 🚀 Features

- Fallback for weather station data/plots
- Improve subscribe-dialog
- Improve subscribe-dialog

### 🐛 Bug Fixes

- *(vr)* Use correct email address for feedback
- *(bulletin-glossary)* I18n for avalanches.org/glossary link anchors
- *(leaflet-map-controls)* Re-enable geonames

### 💼 Other

- Merge branch 'dependencies' into 'master'

refact: 2023 dependency upgrade

Closes #558

See merge request albina-euregio/albina-website!434
- Merge branch 'bulletin-glossary' into 'master'

fix(bulletin-glossary): i18n for avalanches.org/glossary link anchors

See merge request albina-euregio/albina-website!436
- Merge branch 'weatherFallback' into 'master'

feat: fallback for weather station data/plots

See merge request albina-euregio/albina-website!418
- Merge branch 'subscribe-dialog' into 'master'

feat: improve subscribe-dialog

See merge request albina-euregio/albina-website!356

### 🚜 Refactor

- Rename CAAMLv6.ts

### ⚡ Performance

- *(bulletin-report)* Extract LocalizedText component
- *(bulletin-report)* Extract TendencyReport component
- *(bulletin-glossary)* Reuse class GlossaryReplacer
- React.lazy for BulletinGlossaryText

### ⚙️ Miscellaneous Tasks

- Upgrade to vite 5.0.6
- Upgrade to prettier 3.0.3
- Upgrade to sass 1.69.5
- Upgrade to eslint 8.55.0
- Upgrade to leaflet 1.9.4
- Upgrade to react 18.2.0 and react-leaflet 4.2.1
- Upgrade to mobx 6.12.0
- Upgrade to typescript 5.3.3
- Upgrade to jquery 3.7.1
- Upgrade to htmr 1.0.2
- *(filters)* Remove checkboxes for buttongroup

## [6.2.2] - 2023-12-08

### 🐛 Bug Fixes

- *(bulletin-glossary)* Empty glossary link phrase in OC

## [6.2.1] - 2023-12-08

### 🚀 Features

- *(glossary)* Add CA, ES, OC

### 💼 Other

- Fixes #562
- Merge branch 'fix/#562-wind-arrows-are-not-shown-on-weather' into 'master'

fix missing arrow for wind direction

Closes #562

See merge request albina-euregio/albina-website!433

## [6.1.20] - 2023-12-01

### 🐛 Bug Fixes

- Fix initial cursor position

fixes# 567
- Fix reformating

### 💼 Other

- Grey matrix colors, new shadow color, linkbox scrollbars and img opacity
- Npm -> yarn
- Merge branch 'feature/advent-improvements' into 'master'

Feature/advent improvements

See merge request albina-euregio/albina-website!432
- Set correct node version
- Merge branch 'master' into fix/#567-weathermapsnow-height-does-not-show-
- Merge branch 'fix/#567-weathermapsnow-height-does-not-show-' into 'master'

weather/map/snow-height does not show anything!

See merge request albina-euregio/albina-website!431

## [6.1.19] - 2023-11-30

### ⚙️ Miscellaneous Tasks

- *(pbf-map)* Micro-region stroke only for mouseOver and selected
- Update @eaws/micro-regions

## [6.1.18] - 2023-11-28

### 💼 Other

- Merge branch 'eaws-regions' into 'master'

chore: use @eaws/micro-regions

See merge request albina-euregio/albina-website!430
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

### 🚜 Refactor

- Update yarn.lock

### ⚙️ Miscellaneous Tasks

- *(README)* Document nginx
- *(i18n)* Update translations
- *(matrix-info)* Update colors
- *(matrix-info)* Change colors to black
- Use @eaws/micro-regions

## [6.1.17] - 2023-11-22

### 🐛 Bug Fixes

- Fix fresh in the past

fixes #563
- Fixes html in subscribe dialog

fixes #561

### 💼 Other

- Merge branch 'master' into fix/#560-click-on-date-jumps-to-wronh-time-pe
- Hide logs

fixes #560
- Remove logs
- Merge branch 'fix/#560-click-on-date-jumps-to-wronh-time-pe' into fix/#561-html-tags-in-subscribe-dialog
- Merge branch 'fix/#561-html-tags-in-subscribe-dialog' into 'master'

remove html in dialog

Closes #563, #561, and #560

See merge request albina-euregio/albina-website!429

## [6.1.16] - 2023-11-21

### ⚙️ Miscellaneous Tasks

- *(synthesized-bulletin)* Enable only for DE

## [6.1.15] - 2023-11-21

### 💼 Other

- Merge branch 'master' into feature/#534-weathermapsbutton
- Cleaning

fixes #534
- Wrong period selection for ranges when selecting day
- Merge branch 'feature/#534-weathermapsbutton' into 'master'

Feature/#534 weathermapsbutton

Closes #534

See merge request albina-euregio/albina-website!427

## [6.1.14] - 2023-11-17

### 🐛 Bug Fixes

- *(htmlParser)* Do not break on missing href

## [6.1.13] - 2023-11-17

### ⚙️ Miscellaneous Tasks

- *(vr)* Update button text

## [6.1.12] - 2023-11-17

### 🚀 Features

- *(stationDataStore)* Operator link from GeoJSON

### 💼 Other

- Merge branch 'master' into feature/#534-weathermapsbutton
- Implement button
- Refine showHideStations
- Enable i18n
- Hide stations on mobile by default
- Add detailed title
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

### ⚙️ Miscellaneous Tasks

- *(vr)* Add link to App Lab
- *(vr)* Update page
- *(vr)* Update page

## [6.1.11] - 2023-11-15

### 🐛 Bug Fixes

- *(stationDataStore)* LWD-Region may be undefined
- *(i18n)* Button:stations:stations:text

### 🚜 Refactor

- Inline handlers

### ⚙️ Miscellaneous Tasks

- *(i18n)* Types
- *(season-reports)* Add AT-07 report for 2022/23
- *(i18n)* Update translations

## [6.1.10] - 2023-11-11

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- *(i18n)* Update translations

## [6.1.9] - 2023-11-11

### 💼 Other

- Merge branch 'master' into feature/#557-update-geosphere-austria-logo
- Merge branch 'feature/#557-update-geosphere-austria-logo' into 'master'

Feature/#557 update geosphere austria logo

See merge request albina-euregio/albina-website!426

### 🚜 Refactor

- Remove obsolete polyline

### ⚙️ Miscellaneous Tasks

- *(season-reports)* Add report 22-23 for IT-32-BZ
- *(i18n)* Update translations for season-reports

## [6.1.8] - 2023-11-08

### 💼 Other

- Merge branch 'master' into feature/#534-weathermapsbutton
- Optimized implementation of geosphere logo
- Merge branch 'CAAMLv6' into 'master'

chore: update CaamlBulletin2022

See merge request albina-euregio/albina-website!417

### ⚙️ Miscellaneous Tasks

- Update CaamlBulletin2022
- *(bulletin)* Tendency array
- CAAMLv6.json

## [6.1.7] - 2023-11-07

### 🐛 Bug Fixes

- Fix dragger accuracy bug
- Fix dragger out of limits
- Fix show timeend for single ticks
- Fixes not available hour

fixes #552

### 💼 Other

- Added new icons to icon font
- Merge branch 'master' into fix/#545-new-snow-overlay-problem
- Merge branch 'master' into fix/#545-new-snow-overlay-problem
- Merge branch 'fix/#552-mapsnow-height-loads-not-yet-existin' into 'master'

fixes not available hour

Closes #552

See merge request albina-euregio/albina-website!424
- Show geosphere logo in cockpit

fixes #557
- Merge branch 'feature/#557-update-geosphere-austria-logo' into 'master'

show geosphere logo in cockpit

Closes #557 and #552

See merge request albina-euregio/albina-website!425

## [6.1.6] - 2023-11-06

### 💼 Other

- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Fix for selectric dropdowns
- Merge branch 'feature/#549-selectric-z-index' into 'master'

Fix for selectric dropdowns

See merge request albina-euregio/albina-website!423
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

### ⚙️ Miscellaneous Tasks

- *(weather)* Update references and logo of GeoSphere Austria
- *(eaws-regions)* Update link to CH
- *(zamg)* Remove ZAMG entries from config
- *(weather-map)* Use i18n for attribution
- *(i18n)* Update translations

## [6.1.5] - 2023-11-03

### 🐛 Bug Fixes

- Fix dragger

### 💼 Other

- Merge branch 'master' into fix/#547-snow-height-diff-maps-use-wrong-time
- Linting fix
- Liniting fix2
- Linting 3
- Merge branch 'fix/#547-snow-height-diff-maps-use-wrong-time' into 'master'

#574 Missing Days / Height Diff maps use wrong time slots

Closes #529

See merge request albina-euregio/albina-website!420
- Make overlays show past not future tick

fixes #545
- Merge branch 'master' into fix/#545-new-snow-overlay-problem
- Remove logs
- Merge branch 'fix/#547-snow-height-diff-maps-use-wrong-time' into fix/#545-new-snow-overlay-problem
- Merge branch 'fix/#545-new-snow-overlay-problem' into 'master'

#545 Overlay Files show information until and not from date in filename.

Closes #529 and #545

See merge request albina-euregio/albina-website!421

### ⚙️ Miscellaneous Tasks

- *(eaws-regions)* Update link to CH

## [6.1.4] - 2023-11-03

### 🐛 Bug Fixes

- Fix past periods
- Fixes #529
- *(stationDataStore)* Do not filter by observationStart in station measurements table, fixes #548

### 💼 Other

- Correct startdate
- Respect time change in periode

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations

## [6.1.3] - 2023-10-31

### 🐛 Bug Fixes

- *(weather-cockpit)* Missing days

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations

## [6.1.2] - 2023-10-19

### 💼 Other

- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Prepare vr page
- Restructure
- Add sample content
- Add german translation for feature
- Merge branch 'feature/#544-introduce-a-new-sub-page-representin' into 'master'

Feature/#544 introduce a new sub page representin

See merge request albina-euregio/albina-website!419

### ⚙️ Miscellaneous Tasks

- *(blog)* Add spaces between region ids
- *(blog)* Link regions to current language filter
- *(config)* New vapidPublicKey for dev
- *(i18n)* Update translations
- *(vr)* Add vr page to transifex
- *(vr)* Update content
- *(vr)* Add translation for DE

## [6.1.1] - 2023-08-28

### 🚀 Features

- *(blogStore)* Wordpress blog.avalanche.report
- *(blogStore)* Wordpress blog.avalanche.report

## [6.1.0] - 2023-08-28

### 🚀 Features

- *(blogPost)* Lang= filter

### 🐛 Bug Fixes

- Remove unused variable
- Lawine/produkte/ogd URL
- *(stationArchive)* Only use LWD Tirol stations
- *(yearFilter)* Allow current season
- *(blogPost)* Typo in className

### 💼 Other

- Merge branch 'feature/#538-weather-station-archive' into 'master'

feat: provide weather station data as download

Closes #538

See merge request albina-euregio/albina-website!413
- Merge branch 'master' into feature/#528-color-matrix-info
- Merge branch 'master' into feature/#528-color-matrix-info
- Use warning level colors for matrix info, opacity 0.5 vs. 1
- Merge branch 'feature/#528-color-matrix-info' into 'master'

Use warning level colors for matrix info, opacity 0.5 vs. 1

See merge request albina-euregio/albina-website!414
- Merge branch 'weather-archive-license' into 'master'

chore(weather/archive): specify license CC BY 4.0

See merge request albina-euregio/albina-website!416
- Basic styles for wordpress blog posts
- Styling for blog post in other languages
- Merge branch 'feature/#473-blog-wordpress' into 'master'

Basic styles for wordpress blog posts

Closes #473

See merge request albina-euregio/albina-website!415

### 🚜 Refactor

- Reuse StationData store
- Simplify download URL

### ⚙️ Miscellaneous Tasks

- Add station OGD data store
- Create station archive page
- Filter stations by observation start
- Add missing parameters, fix download link
- *(stationArchive)* Filter observers
- *(stationArchive)* Remove wrong parameters, use correct parameter ids for file download
- *(stationArchive)* Set minYear to 1973
- *(stationArchive)* LWD-Nummer
- *(stationArchive)* LWD Tirol joint stations
- *(stationArchive)* "latest" and "2022_2023"
- *(stationArchive)* Compute minYear
- Update transifex docs
- *(i18n)* Update translations
- Upgrade to vite 4.4.9
- Upgrade to eslint 8.47.0
- *(weather/archive)* Specify license CC BY 4.0
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(matrix)* Enable matrix info colors
- *(config)* Use test blog in dev env
- *(blogPost)* No static blog-language

## [6.0.0] - 2023-07-24

### 🚀 Features

- *(blogStore)* Wordpress blog.avalanche.report
- *(blogPost)* Show language links

### 🐛 Bug Fixes

- Fix missing stationdata

fixes #533
- *(dragger)* Map jumps in time
- *(dragger)* Map jumps in time
- *(lint)* Remove unused variable
- Fix #536

### 💼 Other

- Remove all summertime related adaptions due to the general usage of utc
- Improve timeline handling
- Remove log
- Start with startDate.ok hour
- Merge branch 'fix-map-jumps-in-time' into 'master'

fix(dragger): map jumps in time

Closes #508

See merge request albina-euregio/albina-website!410
- Merge branch 'master' into fix/533-weather-map-loads-wrong-image-file-a
- Merge branch 'fix/533-weather-map-loads-wrong-image-file-a' into 'master'

Fix/533 weather map loads wrong image file a

Closes #533

See merge request albina-euregio/albina-website!409
- Merge branch 'blog.avalanche.report' into 'master'

feat(blogStore): blog.avalanche.report

See merge request albina-euregio/albina-website!308
- Use additional CTRL key to jump 24 hours

fix #531
- Merge branch 'feature/#531-jump-24h-with-arrow-up-or-down' into 'master'

#531-jump-24h-with-arrow-up-or-down

Closes #531

See merge request albina-euregio/albina-website!412
- Respect absolute timespans

fix #535
- Merge branch 'feature/#535-enlarge-domain-of-wathermaps' into 'master'

#535-enlarge-domain-of-wathermaps

Closes #536 and #535

See merge request albina-euregio/albina-website!411

### 🚜 Refactor

- *(blogStore)* Interface BlogProcessor
- Refact(blogStore)
- *(blogPostPreviewItem)* ParseTags

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update about
- *(i18n)* Update about
- *(i18n)* Update about
- *(blogStore)* Simplify blog names in config
- *(synthesizer)* Remove inline style, remove feedback button
- *(synthesizer)* Enable for prod
- *(synthesizer)* Load files from static.avalanche.report

## [5.1.5] - 2023-04-13

### 💼 Other

- Merge branch 'master' into archive-tirol
- Merge branch 'archive-tirol' into 'master'

Archive tirol

See merge request albina-euregio/albina-website!406

## [5.1.4] - 2023-04-12

### 🐛 Bug Fixes

- *(bulletin-date-flipper)* Expected `onFocus` listener to be a function, instead got a value of `string` type.
- *(province-filter)* Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>
- Yarn.lock
- *(snowpack-stability)* Fix ordering and color

### 💼 Other

- Merge branch 'annual-reports' into 'master'

Annual reports

See merge request albina-euregio/albina-website!407
- Merge branch 'annual-reports' into 'master'

chore(i18n): update translations

See merge request albina-euregio/albina-website!408

### 🚜 Refactor

- *(season-reports)* Rename annual reports to season reports

### ⚙️ Miscellaneous Tasks

- Update to leaflet 1.9.3
- *(weather-station-diagrams)* Timezone in popup
- *(annual-report)* Add reports from arge and bz
- *(season-reports)* Add translations
- *(i18n)* Update translations
- *(menu)* Add entry
- *(season-reports)* Add all AT-07 reports

## [5.1.3] - 2023-03-25

### 🐛 Bug Fixes

- *(matrix-info)* Correct color for snowpack stability
- Fix overlay file retrieval

fixes #529

### 💼 Other

- Styles for colored bar on matrix info
- Add classes to problems
- Mapping according to bug report
- Refinement

fixes #528
- Merge branch 'feature/#528-color-matrix-info' into 'master'

Color matrix info texts

Closes #528

See merge request albina-euregio/albina-website!403
- Enable matrix colors only in dev & beta
- Merge branch 'feature/#528-color-matrix-info' into 'master'

enable matrix colors only in dev & beta

See merge request albina-euregio/albina-website!404
- Merge branch 'fix/#529-weather-maps-do-not-work-for-sunday-' into 'master'

fix overlay file retrieval

Closes #529

See merge request albina-euregio/albina-website!405

### ⚙️ Miscellaneous Tasks

- *(archive)* Set min year to 1960

## [5.1.2] - 2023-03-16

### 💼 Other

- Merge branch 'master' into glossary-it
- Merge branch 'glossary-it' into 'master'

Glossary it

See merge request albina-euregio/albina-website!402

### ⚙️ Miscellaneous Tasks

- *(glossary-it)* Prepare mapping file
- *(audio-files)* Add feedback button
- *(glossary-it)* Enable IT glossary links
- *(glossary-it)* Add links
- *(glossary-de)* Update links

## [5.1.1] - 2023-03-13

### 🐛 Bug Fixes

- *(glossary)* Whumpfing sound in de

## [5.1.0] - 2023-03-10

### 🚀 Features

- *(stationTable)* Concise measurements table
- *(stationTable)* Precipitation in 24h/48h/72h
- *(bulletinStoreEaws)* Add FI
- *(stationTable)* Date input for historic data
- *(bulletin-report)* Enable glossary everywhere
- *(stationTable)* Date input for historic data everywhere

### 🐛 Bug Fixes

- Fixed treeline position and added css for svg
- Duplicate leaflet-geonames-icon
- *(archive-item)* Bulletin map URL 2023
- *(education)* Www.avalanches.org/glossary/ link
- *(weather-station-diagrams)* Year flipper
- *(stationTable)* No default dateTime
- Fix "false" directions

fixes #523
- Fix missing latest bug

fixes #488
- Fix bulletin does not load
- *(archive)* Prefilled year/month
- *(audio-file)* Disable a11y for synthesized-bulletin
- *(audio-file)* Add missing dependencies to react hook

### 💼 Other

- Smaller glossary tooltips
- Find bug
- Added Name to class ...
- Fix archive map-preview
- Merge branch 'feature/#499-small-glossary-tooltip' into 'master'

smaller glossary tooltips

See merge request albina-euregio/albina-website!388
- Merge branch 'fix-leaflet-geonames-icon' into 'master'

fix: duplicate leaflet-geonames-icon

See merge request albina-euregio/albina-website!384
- Merge branch 'feat/concise-measurements' into 'master'

feat(stationTable): concise measurements table

Closes #509

See merge request albina-euregio/albina-website!386
- Merge branch 'feature/#499-small-glossary-tooltip' into 'master'

Feature/#499 small glossary tooltip

See merge request albina-euregio/albina-website!389
- Merge branch 'master' into feature/#499-small-glossary-tooltip
- Merge branch 'feature/#499-small-glossary-tooltip' into 'master'

Fix archive map-preview

See merge request albina-euregio/albina-website!392
- Merge branch 'master' into feature/#461-add-text-to-icons
- Style to narrow wide icon texts
- Add caption to problem icon
- Merge branch 'eaws-FI' into 'master'

feat(bulletinStoreEaws): add FI

See merge request albina-euregio/albina-website!394
- Merge branch 'master' into feature/#461-add-text-to-icons
- Add caption to problem icon #2

fixes #461
- Merge branch 'feature/#461-add-text-to-icons' into 'master'

Feature/#461 add text to icons

Closes #461

See merge request albina-euregio/albina-website!391
- Merge branch 'stationTable-historic-data' into 'master'

feat(stationTable): date input for historic data

See merge request albina-euregio/albina-website!393
- Merge branch 'master' into feature/#461-add-text-to-icons
- Fixed bulletin-report-pictos in archive layout
- Add calendar icon
- Added calendar icon
- Merge branch 'master' into feature/#488-jumptodate
- Add calendar picker
- Styles for calendar on bulletin
- 
- Improve calendar animation
- Refittet floating calendar
- Place tooltip above, dont reload if date is the same
- Merge branch 'master' into feature/#488-jumptodate
- Finetuning of calendar popup
- Including reduced img overlays on hover and touch
- Remove dependency
- Use generic date field instead of date picker
- Styles for browser default datetime-local input
- Bulletin calendar icon plus browser default calendar popup
- Rename property
- Merge branch 'feature/#488-jumptodate' into 'master'

Calendar widget for Dates / Jump to Date function

Closes #488

See merge request albina-euregio/albina-website!396
- Merge branch 'master' into feature/#461-add-text-to-icons
- Merge branch 'feature/#461-add-text-to-icons' into 'master'

Fixed bulletin-report-pictos in archive layout

See merge request albina-euregio/albina-website!395
- Merge branch 'fix/523-weather-maps-where-does-the-random-0' into 'master'

523-weather-maps-where-does-the-random-0

Closes #523

See merge request albina-euregio/albina-website!397
- Merge branch 'master' into feature/#488-jumptodate
- Remove log
- Merge branch 'feature/#488-jumptodate' into 'master'

fix missing latest bug

Closes #488

See merge request albina-euregio/albina-website!399
- Merge branch 'feature/#488-jumptodate' into 'master'

fix bulletin does not load

See merge request albina-euregio/albina-website!400
- Merge branch 'audio-files' into 'master'

Integrate audio files

See merge request albina-euregio/albina-website!398

### 🚜 Refactor

- *(bulletin-map)* Is-de-highlighted
- Extract currentSeasonYear
- *(tx)* Tx migrate

### ⚙️ Miscellaneous Tasks

- *(stationTable)* Th subtitle
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(stationTable)* 📅 pure-form
- *(stationTable)* "date" pure-form
- *(weather-map)* Diff-snow station overlay
- *(audio-files)* Add first implementation to integrate audio files
- *(audio-files)* Add audio controls
- *(audio-files)* Move env check to bulletin-report
- *(archive)* &region from search params
- *(archive)* Deduplicate avalanche problems
- *(archive)* Hide region bulletins if absent
- *(archive)* Tr borders
- *(i18n)* Update translations

## [5.0.5] - 2023-01-17

### 🚀 Features

- *(archive)* ProvinceFilter
- *(archive)* Danger ratings, avalanche problems
- *(bulletin-glossary)* Enable for English

### 🐛 Bug Fixes

- *(bulletin-awmap-static)* //
- *(weather-station-diagrams)* Select diagram based on clientWidth
- *(snowpack-stability)* Close html tag correctly
- *(stationTable)* Fix toggle filters "snowhight"
- *(warn-level-icon)* Center text
- Override chunkFileNames
- Width: 100%; height: 100%
- Harmonize "Snow Height" between measurements and weathermap

### 💼 Other

- Merge branch 'archive' into 'master'

feat(archive): danger ratings, avalanche problems

See merge request albina-euregio/albina-website!380
- Merge branch 'not-too-wide' into 'master'

fix(weather-station-diagrams): select diagram based on clientWidth

See merge request albina-euregio/albina-website!381
- Merge branch 'glossary-en' into 'master'

feat(bulletin-glossary): enable for English

Closes #504

See merge request albina-euregio/albina-website!382
- Revert "fix(bulletin-awmap-static): //"

This reverts commit 41bccf2e12190bd35d47234fe7bc318c6f714c39.
- Merge branch 'stationTable' into 'master'

fix(stationTable): fix toggle filters "snowhight"

See merge request albina-euregio/albina-website!383
- Merge branch 'warning-pictos-SVG' into 'master'

refact: transform warning-pictos to SVG

Closes #368

See merge request albina-euregio/albina-website!349

### 🚜 Refactor

- *(components/filters)* Convert to TypeScript
- *(archive)* Function getArchiveBulletinStatus
- *(archive)* Type LegacyBulletinStatus
- Refact(archive-item)
- Refact(stationTable)
- Refact(stationTable)
- Transform warning-pictos to SVG
- Transform exposition-icon to SVG
- StaticPageStore.loadPage

### ⚙️ Miscellaneous Tasks

- *(weatherStationOperators)* Eurac Research
- *(weatherStationOperators)* GeoSphere Austria
- *(i18n)* Update translations
- *(eaws-regions)* Update version

## [5.0.4] - 2022-12-30

### 💼 Other

- *(i18n)* Update translations!

## [5.0.3] - 2022-12-30

### 🚀 Features

- *(handbook)* Region table from eaws-regions
- PbfLayerOverlay component for mouse overlays
- *(bulletin-map)* De-highlighted aws w/o ratings
- *(bulletin-glossary)* Translate using Transifex
- "low" if elevation exceeds region threshold
- Playwright for end-to-end testing

### 🐛 Bug Fixes

- *(frequency)* Typos
- *(frequency)* Typos
- *(education)* Typos
- EawsRegionsWithoutElevation
- @typescript-eslint/adjacent-overload-signatures
- @typescript-eslint errors
- @typescript-eslint/no-explicit-any
- *(pbf-map)* Stroke for region
- *(bulletin-glossary)* Separate Transifex project
- *(blogStore)* Throw error
- *(bulletin-map)* EawsDangerRatings w/o albina
- *(config)* Google API key
- *(bulletin-map)* Select other region
- Exhaustive-deps, @typescript-eslint errors

### 💼 Other

- Merge branch 'handbook-region-table' into 'master'

feat(handbook): region table from eaws-regions

See merge request albina-euregio/albina-website!370
- Merge branch 'typescript-eslint' into 'master'

chore: enable TypeScript ESLint

See merge request albina-euregio/albina-website!371
- GitLab CI: disable slow jobs of little use
- Merge branch 'PbfLayerOverlay' into 'master'

feat: PbfLayerOverlay component for mouse overlays

See merge request albina-euregio/albina-website!372
- Merge branch 'low_high' into 'master'

chore(pbf-map): elevation=low_high

See merge request albina-euregio/albina-website!374
- Merge branch 'tx-bulletin-glossary' into 'master'

feat(bulletin-glossary): translate using Transifex

See merge request albina-euregio/albina-website!366
- Enable click (tabbing) on glossary for mobile usage

fixes #494
- Merge branch 'feature/494-how-to-use-the-glossary-on-a-smartph' into 'master'

enable click (tabbing) on glossary for mobile usage

Closes #494

See merge request albina-euregio/albina-website!375
- Merge branch 'blogStore-throw-error' into 'master'

fix(blogStore): throw error

See merge request albina-euregio/albina-website!376
- Enable only tabbable glossary

fixes #501
- Merge branch 'fix/501-betaweather-cannot-change-timespan' into 'master'

enable only tabbable glossary

Closes #501

See merge request albina-euregio/albina-website!377
- Merge branch 'elevation-threshold' into 'master'

feat: "low" if elevation exceeds region threshold

Closes #493

See merge request albina-euregio/albina-website!373
- GitLab CI: Node.js 18 LTS
- Merge branch 'playwright' into 'master'

feat: Playwright for end-to-end testing

See merge request albina-euregio/albina-website!355
- Merge branch 'select-other-region' into 'master'

fix(bulletin-map): select other region

See merge request albina-euregio/albina-website!378
- Merge branch 'fix-eslint' into 'master'

fix: exhaustive-deps, @typescript-eslint errors

See merge request albina-euregio/albina-website!379

### 🚜 Refactor

- *(handbook)* Regions tables
- *(bulletin)* Types
- Interface RegionOutlineProperties
- PbfRegionState component
- *(bulletinStore)* Remove obsolete stuff
- Remove micro_regions.polyline.json
- Separate EawsDangerRatings per region
- Type PbfStyleFunction
- Remove polyline.js
- Remove @mapbox/polyline
- Vite.config.ts
- Use eaws-regions micro-regions_properties
- Config.d.ts

### ⚙️ Miscellaneous Tasks

- Update sentry to 7.24.2
- Upgrade to vite 4.0.0
- Enable TypeScript ESLint
- *(pbf-map)* Handle events
- *(pbf-map)* Elevation=low_high
- *(contact)* Update address of aws tirol
- *(i18n)* Add translations
- *(i18n)* Update translations
- *(bulletin-status-line)* Max publicationTime
- *(i18n)* Update translations
- *(i18n)* Add glossary content for en
- *(i18n)* Update translations

## [5.0.2] - 2022-12-07

### 🚀 Features

- *(bulletinStoreEaws)* Add PL-12
- Load CAAMLv6_2022 bulletins
- *(footer)* Replace share dialog with links

### 🐛 Bug Fixes

- Fixed link for graph
- *(bulletinStore)* HTTP 404 for getBulletinStatus
- *(BulletinAWMapStatic)* Pm
- *(bulletinStore)* Status=n/a when loading fails
- Object.fromEntries from undefined
- *(EawsDangerRatings)* Catch error
- EawsRegionsWithoutElevation
- Sm-follow from config
- *(page-footer)* Remove icon tilt
- *(bulletin)* N/a heading
- *(frequency)* Typo

### 💼 Other

- Merge branch 'lawiny.topr.pl' into 'master'

feat(bulletinStoreEaws): add PL-12

See merge request albina-euregio/albina-website!364
- Merge branch 'icons-fc' into 'master'

refact(components/icons): functional components

See merge request albina-euregio/albina-website!346
- Written and desinged webpage for the topic frequency distribution based on EAWS standards
- Added en.html file with description of the spatial and temporal resolution according to EAWS standards
- Merge branch 'CAAMLv6_2022' into 'master'

feat: load CAAMLv6_2022 bulletins

Closes #491

See merge request albina-euregio/albina-website!347
- VectorGrid
- Static.avalanche.report/eaws_pbfvectorGrid
- VectorGrid
- VectorGrid
- MicroRegionElevationProperties
- DangerRatings
- OverlayPane
- Date for filterFeature
- MaxDangerRatings for albina
- Eaws-regions
- False
- Remove BULLETIN_STORE.loadEawss
- BULLETIN_STORE.microRegions
- CAAMLv6_2022
- Map.panTo
- 10
- EawsDangerRatings also w/o DangerRatings
- Merge branch 'vectorGrid' into 'master'

feat: vectorGrid for EAWS map

Closes #471 and #449

See merge request albina-euregio/albina-website!351
- Rearrange footer-logos and add sm-follow icons
- Merge branch 'footer-sm-follow' into 'master'

feat(footer): replace share dialog with links

See merge request albina-euregio/albina-website!352
- Merge branch 'remove-icon-tilt' into 'master'

fix(page-footer): remove icon tilt

Closes #489

See merge request albina-euregio/albina-website!367
- Merge branch 'organisms-fc' into 'master'

refact(organisms): functional components

See merge request albina-euregio/albina-website!365
- Set utc start for diff-snow
- Merge branch 'feature/set-utc-snowdiff' into 'master'

set utc start for diff-snow

See merge request albina-euregio/albina-website!368
- Merge branch 'no-cache' into 'master'

chore: fetchJSON with cache=no-cache

See merge request albina-euregio/albina-website!369

### 🚜 Refactor

- *(components/icons)* Convert to TypeScript
- *(components/icons)* Functional components
- *(filters)* Functional components
- *(dialogs)* Functional components
- *(components/blog)* Functional components
- *(components/blogs)* Convert to TypeScript
- *(search-field)* Functional components
- *(warn-levels)* TypeScript
- BULLETIN_STORE.problems
- BULLETIN_STORE.date
- Bulletin.publicationTime
- *(date)* Remove unused todayIsTomorrow
- Bulletin.publicationTime
- Bulletin.customData.LWD_Tyrol.dangerPatterns
- *(eaws-map)* Module Augmentation
- *(bulletinStore)* Remove microRegionsElevation
- Const date
- Leaflet/pbf-map
- VectorTileLayerStyles
- VectorGrid.options.dangerRatings
- Pbf-map types
- VectorGrid.options.dangerRatings
- *(organisms)* Functional components

### ⚙️ Miscellaneous Tasks

- *(CaamlBulletin2022)* Update to latest schema
- *(eaws-map)* ResetFeatureStyle
- *(eaws-map)* IT needs to be fetched separately
- FetchJSON with cache=no-cache
- *(menu)* Add new education pages
- *(education)* Add links on overview page
- *(i18n)* Update translations
- *(education)* Update sitemap
- *(edcuation)* Add resources to transifex config
- *(edcuation)* Add translations

## [5.0.1] - 2022-12-01

### 🚀 Features

- *(glossary)* Bulletin-glossary-de-links
- Functional page-loading-screen
- Page-loading-screen for blogPost
- *(archive)* UseSearchParams
- *(archive)* Buttongroup for months
- *(archive)* Nostalgia back to 1993
- *(archive)* South_tyrol nostalgia in de/it
- *(bulletinStoreEaws)* Add PL

### 🐛 Bug Fixes

- *(blogPost)* Intl.formatDate
- *(CaamlBulletin)* Convert enums to types
- *(archive-item)* Bulletin URLs w/ region mgmt
- *(components/bulletin)* Functional components
- *(bulletinStore)* Do not overwrite region
- Fix double tooltips in icons

fixes #486
- Fix(htmlParser)
- *(tooltip-dom)* Double tooltips in icons
- Double tooltips in icons
- Redundant tooltips on links
- *(leaflet-gesture-handling)* Map dragging
- *(index)* Set page-loaded
- *(archive-item)* Maps for daytime dependency
- Fix snow height diff
- Fix broken bulletin !345
- *(weather/timeline)* DateToShortDayString
- *(archive)* HTTP HEAD for nostalgia bulletins

### 💼 Other

- GitLab CI: browser_performance

https://docs.gitlab.com/ee/ci/testing/browser_performance_testing.html
- Merge branch 'ci' into 'master'

GitLab CI: browser_performance

See merge request albina-euregio/albina-website!341
- GitLab CI: fix browser_performance for MR
- Merge branch 'refact-date' into 'master'

chore: intl.formatDate/intl.formatTime

See merge request albina-euregio/albina-website!343
- Merge branch 'bulletin-fc' into 'master'

refact(components/bulletin): functional components

See merge request albina-euregio/albina-website!344
- Merge branch 'import-jquery' into 'master'

refact: import jquery where needed

See merge request albina-euregio/albina-website!335
- Configure TypeScript
- Honor region parameter
- Merge branch 'fix/honor-region-parameter' into 'master'

honor region parameter

See merge request albina-euregio/albina-website!345
- Added text to avalanche problem icons in filter and bulletin
- Updated SCSS to fix treeline positioning
- Fix archive map-preview
- New tab for external link, add reference link
- Merge remote-tracking branch 'origin/feature/#467-glossary-tooltip' into feature/#467-glossary-tooltip
- Styled glossary tooltip source link
- Merge remote-tracking branch 'origin/bulletin-glossary-content' into feature/#467-glossary-tooltip

fixes #467
- I18n for glossary tooltips
- Merge branch 'master' into feature/#467-glossary-tooltip
- Revert "fix double tooltips in icons"

This reverts commit 7763a2f48b121d8d70a4abfc7d8c8d615e5e192a.
- Merge branch 'feature/#467-glossary-tooltip' into 'master'

Feature/#467 glossary tooltip

Closes #467 and #486

See merge request albina-euregio/albina-website!305
- Merge branch 'fix-leaflet-gesture-handling' into 'master'

fix(leaflet-gesture-handling): map dragging

Closes #448

See merge request albina-euregio/albina-website!354
- Merge branch 'glossary-fc' into 'master'

feat(glossary): bulletin-glossary-de-links

See merge request albina-euregio/albina-website!359
- Merge branch 'html-page-loading-screen' into 'master'

feat: functional page-loading-screen

Closes #384

See merge request albina-euregio/albina-website!353
- Merge branch 'archive-fd' into 'master'

fix(archive-item): maps for daytime dependency

See merge request albina-euregio/albina-website!350
- Merge branch 'archive-buttongroup' into 'master'

feat(archive): years=winter seasons; months=buttongroup

See merge request albina-euregio/albina-website!357
- Merge branch 'archive-nostalgia' into 'master'

feat(archive): nostalgia back to 1993

See merge request albina-euregio/albina-website!358
- Change utc setting
- Remove log
- Merge branch 'feature/change-to-utc0' into 'master'

Change Weathermap for Snow to UTC0

See merge request albina-euregio/albina-website!360
- Merge branch 'fix/!345' into 'master'

fix broken bulletin !345

See merge request albina-euregio/albina-website!361
- Merge branch 'gopr.pl' into 'master'

feat(bulletinStoreEaws): add PL

See merge request albina-euregio/albina-website!363

### 🚜 Refactor

- Remove react-router-config
- *(html-header)* Use useEffect
- Import type LatLngExpression
- StationDataStore.sortedFilteredData
- *(stationTable)* Convert to TypeScript
- *(bulletin)* UseSearchParams
- *(blogOverview)* UseSearchParams
- *(components/bulletin)* Convert to TypeScript
- *(components/bulletin)* Functional components
- Import jquery where needed
- *(sm-share)* Loop over types
- Rename bulletin-glossary-de-content.json
- *(glossary)* Functional components
- *(archive)* Functional components
- *(archive)* Convert to TypeScript

### 🎨 Styling

- Glossary link
- Glossary link

### ⚙️ Miscellaneous Tasks

- *(app)* Set en-GB, de-AT locale
- *(stationTable)* Intl.formatDate/intl.formatTime
- Intl.formatDate/intl.formatTime
- *(dev)* Reload bulletin after language change
- *(geonames)* ShowMarker=false
- *(stationDataStore)* Collator.compare
- *(stationDataStore)* Cache: "no-cache"
- *(i18n)* Update translations
- *(aps)* Add short problem name
- Update bulletin-glossary-content
- Update bulletin-glossary-de-content
- *(bulletin-glossary)* Add heading, attribution
- Add bulletin-glossary-*-content
- *(ExpositionIcon)* Add expositions as tooltip
- *(archive)* No buttongroup!
- *(archive)* MinMonth={11}
- *(archive)* &buttongroup=1 from search params
- *(ExpositionIcon)* Translate expositions
- *(i18n)* Update translations

## [5.0.0] - 2022-11-17

### 🚀 Features

- *(bulletinStoreEaws)* Add CZ and ES-CT
- *(bulletinStoreEaws)* Add ES
- *(bulletinStoreEaws)* Add AD, update polylines IT
- *(bulletinStore)* Take regions valid for date
- *(stationTable)* Use eaws-regions names
- *(archiveStore)* Determine status from XML

### 🐛 Bug Fixes

- *(eaws_regions)* Regions IT and NO, add SK
- Fix education link handling
- Fix anchor linking
- Fix keys
- *(README)* Localhost:3000
- *(bulletin-map)* Fix simple link for "latest"
- *(danger-scale)* Open pdf in new tab
- *(bulletin-map)* Slow when synced due to am/pm
- *(i18n)* Title for button
- Remove unused imports
- Remove unused imports
- *(matrix-information)* Hide elements if no matrix info is available
- Fix click interaction

fixes #484
- *(stationTable)* Region:Salzburg and region:Vorarlberg
- Fix i18 terms

fixes #450
- *(bulletinStore)* Eaws-regions/filterFeature

### 💼 Other

- Merge branch 'eaws-cz-es-ct' into 'master'

feat(bulletinStoreEaws): add CZ and ES and ES-CT and AD

See merge request albina-euregio/albina-website!312
- Merge branch 'fix/it_regions' into 'master'

fix(eaws_regions): Regions IT and NO, add SK

See merge request albina-euregio/albina-website!314
- Merge remote-tracking branch 'origin/master' into feature/upgrade-react17
- Improve tooltips
- Improve linebreaks
- Improve tooltips style
- Merge branch 'feature/upgrade-react17' into 'master'

upgrade-react17

Closes #416

See merge request albina-euregio/albina-website!316
- Merge branch 'glossary-tooltip' into 'master'

refact(bulletin-glossary): tooltip

See merge request albina-euregio/albina-website!317
- Merge branch 'simple-link-latest' into 'master'

fix(bulletin-map): fix simple link for "latest"

See merge request albina-euregio/albina-website!271
- Revert "chore(bulletinStore): get style for split regions"

This reverts commit 2953c478bd2b2359c17e229414f832e3590093d3.
- Merge branch 'region-splitting' into 'master'

feat(bulletinStore): take regions valid for date

See merge request albina-euregio/albina-website!315
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'fix-slow-sync' into 'master'

fix(bulletin-map): slow when synced due to am/pm

See merge request albina-euregio/albina-website!319
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'yarn' into 'master'

refact: migrate to yarn package manager

See merge request albina-euregio/albina-website!318
- GitKraken Test
- Styles for compact controlbar / filter on small devices
- Added node_module normalize.css
- Update yarn
- Removed normalize-scss
- Merge branch 'feature/#401-reduce-space-on-controlbar' into 'master'

Feature/#401 reduce space on controlbar

See merge request albina-euregio/albina-website!321
- Upgrade purecss-sass from 1.0.0 to 2.0.6
- Merge branch 'feature/upgrade-purecss' into 'master'

Upgrade purecss-sass from 1.0.0 to 2.0.6

See merge request albina-euregio/albina-website!322
- Styles for bulletin matrix information
- Merge branch 'feature/#477-style-matrix-info' into 'master'

Styles for bulletin matrix information

Closes #477

See merge request albina-euregio/albina-website!323
- Simple styles for matrix information
- Merge branch 'feature/#477-style-matrix-info' into 'master'

Simple styles for matrix information

See merge request albina-euregio/albina-website!324
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- React to lang change

fixes #431
- Change to functional component
- Merge branch 'feature/#431-fix-i18-hover-message' into 'master'

add hover use i18n

Closes #431

See merge request albina-euregio/albina-website!325
- 
- Improve onHover and onClick behavior (mobile)

fixing #467
- Tooltip popup has max-width and overflow on max-height
- Actual CSS
- Merge branch 'feature/#467-glossary-tooltips-improvements' into 'master'

glossary-tooltips-improvements

Closes #467

See merge request albina-euregio/albina-website!326
- Make glossary link visible on Safari too
- Merge branch 'feature/#467-glossary-tooltips-improvements' into 'master'

Make glossary link visible on Safari too

See merge request albina-euregio/albina-website!327
- Upgrade animejs

fixes #418
- Merge branch 'feature/478-upgrade-animejs-from-220-to-321' into 'master'

upgrade animejs

Closes #418

See merge request albina-euregio/albina-website!328
- Remove offset

fixes #451
- Merge branch 'fix/451-weather-map-loads-wrong-weather-stat' into 'master'

Weather map loads wrong weather station data file

Closes #451

See merge request albina-euregio/albina-website!329
- Merge branch 'eaws_bulletins-subdir' into 'master'

chore: eaws_bulletins from date subdirectory

See merge request albina-euregio/albina-website!331
- Delete package-lock.json
- Update .gitignore
- Merge branch 'no-package-lock' into 'master'

Delete package-lock.json

See merge request albina-euregio/albina-website!330
- Merge branch 'eaws-regions-names' into 'master'

feat(stationTable):  use eaws-regions names

Closes #480

See merge request albina-euregio/albina-website!332
- GitLab CI: configure Dependency Scanning
- Merge branch 'set-dependency-scanning-config-1' into 'master'

Configure Dependency Scanning in GitLab CI

See merge request albina-euregio/albina-website!333
- GitLab CI: configure License Scanning

https://docs.gitlab.com/ee/user/compliance/license_compliance/index.html
- Merge branch 'archiveStore-head' into 'master'

feat(archiveStore): determine status from XML

Closes #481

See merge request albina-euregio/albina-website!334
- Merge branch 'fix/484-time-range-buttons-do-not-work-on-we' into 'master'

fix click interaction

Closes #484

See merge request albina-euregio/albina-website!339
- Merge branch 'fix-stationTable' into 'master'

fix(stationTable): region:Salzburg and region:Vorarlberg

See merge request albina-euregio/albina-website!336
- Merge branch 'fix/450-weatherstationdiagrams-text-without-' into 'master'

fix/450-weatherstationdiagrams-text-without-i18

Closes #450

See merge request albina-euregio/albina-website!340
- Merge branch 'functional-stationMeasurements' into 'master'

chore(stationMeasurements): functional components

Closes #487

See merge request albina-euregio/albina-website!342

### 🚜 Refactor

- *(bulletin-glossary)* Tooltip
- Remove tippy.js
- Migrate to yarn package manager
- Syncyarnlock -s -k
- Use eaws-regions as node module

### ⚙️ Miscellaneous Tasks

- *(bulletinStoreEaws)* Update polylines master
- *(i18n)* Update translations
- *(bulletinStore)* Get style for split regions
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(region)* Update config
- *(survey)* Remove banner
- *(thumbnail-maps)* Load thumbnails for euregio
- *(thumbnail-maps)* Load thumbnails for euregio
- *(region-mgmt)* Load correct maps depending on date
- *(region-mgmt)* Fix pdf download links
- *(map)* Enable variable opacity, set no coloring if warning level is undefined
- *(matrix)* Show matrix information for avalanche problem
- *(matrix)* Add links to matrix parameters
- *(i18n)* Update translations
- Delete package-lock.json
- Remove package lock
- *(wind_slab)* Rename avalanche problem
- *(wind_slab)* Update resource files
- *(images)* Rename avalanche problems folder, add cornices and no distinct problem
- Eaws_bulletins from date subdirectory
- *(bulletinStoreEaws)* Update polylines master
- *(i18n)* Update translations
- Upgrade to vite 3.1.3
- *(i18n)* Update contact name for IT-32
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(stationMeasurements)* Functional components
- Upgrade wind_drifted_snow to wind_slab

## [4.1.7] - 2022-04-11

### 🐛 Bug Fixes

- *(i18n)* Typo in handbook
- Fix popup events not working
- Fix staticpage routing
- Fix blog item
- Fix ref
- Fix blog
- Fix scrolling
- Fix bulletin
- Fix layer stack
- Fix bulletin map
- Fix dialogs
- Fix bulletin scrolling
- Fix dataoverlay player bug
- Fix this reference
- Fix ref
- Fix static pages routing
- Fix tooltip overflow
- Fix package.js

### 💼 Other

- Adjust tippy config after version update of tippy from 2 -> 6
- Added styles for react tippy #416
- Remove logs

fixes #416
- Ignore submodule
- Upgrade react and react-intl
- React-intl V5 adaptions #1
- Upgrade leaflet
- Upgrade router
- Router #2

router: cleaning
- Remove react-router package
- Cleaning
- Use router dom
- Clean modal updates
- Optimize effects
- Refine scrolling
- Clean
- Cleaning
- Simplify hooks
- Add tippy react
- Replace vanilla tippy
- Remove tooltip init
- Hide html title
- Vanilla tooltip for leaflet
- Update eslint and settings
- Liniting
- Improve tooltip design

### ⚙️ Miscellaneous Tasks

- *(index.html)* Rephrase noScript text, show simple links while loading
- *(i18n)* Update translations
- *(stationMap)* Avoid observer marker overlaps

## [4.1.6] - 2022-03-18

### 🚀 Features

- *(bulletin-map)* Am/pm for eaws bulletins
- *(map)* URLs with focus on province

### 🐛 Bug Fixes

- *(blogStore)* Config is undefined

### 💼 Other

- Merge branch 'eaws-ampm' into 'master'

feat(bulletin-map): am/pm for eaws bulletins

Closes #475

See merge request albina-euregio/albina-website!310
- Merge branch 'province' into 'master'

feat(map): URLs with focus on province

Closes #147

See merge request albina-euregio/albina-website!311

## [4.1.5] - 2022-03-16

### 🚀 Features

- *(bulletinStoreEaws)* Add IS

### 🐛 Bug Fixes

- *(package)* No git+ssh

### 💼 Other

- Optimize images in footer #470
- Optimize logo images in footer #470
- Optimize logo images in footer #470
- Optimize logo images in footer #470
- #470 optimze logo images in footer
- #470 optimze images in footer
- Merge branch 'feature/#470-images-in-footer' into 'master'

Feature/#470 images in footer

See merge request albina-euregio/albina-website!309

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- Update eaws-regions
- *(i18n)* Update translations

## [4.1.4] - 2022-02-24

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update FR translations
- *(interreg)* Change header logo
- *(i18n)* Update translations

## [4.1.3] - 2022-02-11

### 🚀 Features

- *(archive)* Add day of week

### 🐛 Bug Fixes

- Fix #469: positioning of external links icon

### 💼 Other

- Remove gust from config

fixes #468
- Merge branch 'fix/#468' into 'master'

remove gust from config

Closes #468

See merge request albina-euregio/albina-website!307
- Merge branch 'feature/#469-external-link' into 'master'

fix #469: positioning of external links icon

Closes #469

See merge request albina-euregio/albina-website!306

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- *(lawis)* Link to lawis for profiles and incidents

## [4.1.2] - 2022-01-31

### 🚀 Features

- *(station-overlay)* Station names as tooltip
- *(bulletinStoreEaws)* Add ES-CT-L and NO
- *(bulletinStoreEaws)* Add GB
- *(bulletin-report)* Link to glossary
- *(glossary)* Include glossary content

### 🐛 Bug Fixes

- *(elevation)* Show elevation bands with treeline, closes #443
- Station-icon-cluster-circle in map.scss
- Fix toggle buttons
- *(bulletinStore)* DaytimeBulletin is undefined
- *(glossary)* Robustness
- *(glossary)* Trailing whitespace
- *(interreg)* Show interreg logo

### 💼 Other

- Merge branch 'vite-2.7' into 'master'

chore: upgrade to vite 2.7.7

See merge request albina-euregio/albina-website!292
- Merge branch 'station-overlay-tooltip' into 'master'

feat(station-overlay): station names as tooltip

See merge request albina-euregio/albina-website!294
- Show main nav on weather page

fixes #437
- Merge branch 'fix/#437' into 'master'

show main menu on weather page

Closes #437

See merge request albina-euregio/albina-website!295
- Remove scroll trigger
- Merge branch 'fix/#437_#2' into 'master'

Show main menu on weather page #2

See merge request albina-euregio/albina-website!297
- Add font icons
- Add snow line overclick response

implements #414
- Remove logs
- Merge branch 'feature/add-snowline-to-weathermap' into 'master'

add-snowline-to-weathermap

Closes #414

See merge request albina-euregio/albina-website!296
- Merge branch 'more-eaws-regions' into 'master'

feat(bulletinStoreEaws): add ES-CT-L and GB and NO

See merge request albina-euregio/albina-website!293
- Merge branch 'chore/links_neighbors' into 'master'

chore(neighbors): ES-CT-L link only the warning service from which we show the danger level

See merge request albina-euregio/albina-website!300
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'eaws-uk' into 'master'

chore: update eaws-regions

See merge request albina-euregio/albina-website!301
- Merge branch 'link-glossary' into 'master'

feat(bulletin-report): link to glossary

Closes #446

See merge request albina-euregio/albina-website!299
- Merge branch 'interreg' into 'master'

fix(interreg): show interreg logo

See merge request albina-euregio/albina-website!302
- Revert "fix(interreg): show interreg logo"

This reverts commit e8e3c956829cad32a5b6edc33af2e3f5ad030941
- Merge branch 'revert-e8e3c956' into 'master'

Revert "fix(interreg): show interreg logo"

See merge request albina-euregio/albina-website!304
- Use precalculated max value for FR and GB
- Merge branch 'fix/fr_max_dangerlevel' into 'master'

fix(neighbors): correct max danger levels for FR

See merge request albina-euregio/albina-website!303

### 🚜 Refactor

- Refact(bulletinStore)
- *(warn-levels)* Convert to TypeScript
- *(warn-levels)* Type WarnLevelNumber
- Use eaws-regions/filterFeature
- *(glossary)* Extract bulletin-glossary-links

### ⚙️ Miscellaneous Tasks

- Upgrade to vite 2.7.7
- *(i18n)* Update translations
- *(neighbors)* Link only the warning service from which we show the danger level
- *(danger-patterns)* Replace videos with links, update alt text for images
- *(i18n)* Update translations
- *(bulletinStore)* Fallback to white
- *(i18n)* Update translations
- *(i18n)* Update translations
- HTMLHeader
- *(neighbors)* ES-CT-L link only the warning service from which we show the danger level
- *(convert-polyline)* Exclude some aws
- Update eaws-regions
- *(content)* Update alt texts for images
- *(i18n)* Update translations, add nbsp
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(a11y)* Add title to images (#457)
- *(i18n)* Update translations, add title to images (closes #457)
- BulletinGlossary component
- *(glossary)* .tippy-tooltip.custom-html-theme
- *(glossary)* Update glossary IDs for de
- *(glossary)* Replace all at once
- *(glossary)* Tooltip delay
- *(glossary)* Enable for beta
- *(glossary)* Add img
- *(snowProfileMap)* MaxZoom=12
- *(bulletinStoreEaws)* Use non-elevation polygons for CH/CZ/FI/FR/GB/IS/NO/PL
- Update eaws-regions
- *(interreg)* Replace euregio with interreg logo
- *(i18n)* Update translations

## [4.1.1] - 2021-12-27

### 🚀 Features

- Map of snow profiles
- *(snowProfile)* As modal dialog
- *(snowProfileMap)* Tooltips
- Map of incidents

### 🐛 Bug Fixes

- Fix level settings

fixes #433
- Config.d.ts
- *(bulletinStore)* Elevation is undefined
- Config.d.ts
- Europaregion.info
- BLOG_STORE.initLanguage
- *(handbook)* Update messenger services, closes #441

### 💼 Other

- Merge branch 'fix/#433' into 'master'

fixes: Blog banner over bulletin map does not disappear

Closes #433

See merge request albina-euregio/albina-website!288
- Merge branch 'snow-profiles' into 'master'

feat: map of snow profiles

See merge request albina-euregio/albina-website!287
- Merge branch 'static.avalanche.report' into 'master'

refact: static.avalanche.report

See merge request albina-euregio/albina-website!286
- Merge branch 'incident-map' into 'master'

feat: map of incidents

See merge request albina-euregio/albina-website!289
- Merge branch 'blog-store' into 'master'

fix: BLOG_STORE.initLanguage

Closes #440

See merge request albina-euregio/albina-website!290
- Merge branch 'eaws' into 'master'

refact: rename neighbor to eaws

See merge request albina-euregio/albina-website!291

### 🚜 Refactor

- *(snowProfileMap)* Convert to TypeScript
- Static.avalanche.report
- Static.avalanche.report/tms
- Static.avalanche.report/zamg_meteo
- React-router-config/es
- *(blogStore)* Convert to TypeScript
- Rename neighbor to eaws
- *(stationDataStore)* Convert to TypeScript

### ⚙️ Miscellaneous Tasks

- *(snowProfileMap)* Caption in modal dialog
- *(snowProfileMap)* GestureHandling=false
- *(snowProfileMap)* No mapOptionsOverride

## [4.1.0] - 2021-12-14

### 🚀 Features

- Add stylesheet for sitemap.xml
- *(bulletinStoreNeighbor)* Add IT-AINEVA
- *(bulletinStoreNeighbor)* Add FR
- *(bulletinStoreNeighbor)* Add IT-AINEVA
- *(bulletinStoreNeighbor)* Load pre-generated geojson including maxDangerRating
- *(bulletinStoreNeighbor)* Load ratings file
- Add Web app manifest
- *(bulletin-map)* Render overlay from micro regions

### 🐛 Bug Fixes

- Fix(sentry)
- *(blogStore)* Load loop for ca/es/oc
- *(i18n)* Headline avalanche problems IT
- *(bulletinStorageNeighbor)* Fix for absent upperBound/lowerBound
- *(bulletinStoreNeighbor)* Rename DE-BY
- *(bulletinStoreNeighbor)* Bulletins is undefined
- *(bulletinStore)* LoadNeighbors is a mobx action
- *(app)* Use React.lazy for StaticPage
- Fix lint errors
- Fix className

fixes #405
- Fix missing keys
- *(blogOverview)* Call checkUrl for language
- No-console

### 💼 Other

- Merge branch 'htmr' into 'master'

refact: replace html-to-react with htmr

Closes #415

See merge request albina-euregio/albina-website!263
- Merge branch 'polyline-recision' into 'master'

chore(geojson): reduce polyline precision

See merge request albina-euregio/albina-website!264
- Merge branch 'no-custom.js' into 'master'

refact: remove obsolete custom.js

See merge request albina-euregio/albina-website!272
- Merge branch 'sitemap.xsl' into 'master'

feat: add stylesheet for sitemap.xml

See merge request albina-euregio/albina-website!274
- Merge branch 'clean-package.json' into 'master'

refact(build): cleanup package.json

See merge request albina-euregio/albina-website!273
- Basic ajustments
- Add link and translation

fixes #407
- Revert "feat(bulletinStoreNeighbor): load pre-generated geojson including maxDangerRating"

This reverts commit 6c8f74fa1f0e7c734189058987217f1ae53b49a6.
- Merge branch 'caaml-ts' into 'master'

feat(bulletinStoreNeighbor): new CAAML, new regions IT-AINEVA, FR

Closes #425

See merge request albina-euregio/albina-website!270
- Merge branch 'React.lazy' into 'master'

refact(app): use React.lazy for all routes

See merge request albina-euregio/albina-website!269
- Merge branch 'i18n-dynamic-import' into 'master'

chore(i18n): dynamic import translations

See merge request albina-euregio/albina-website!267
- Merge branch 'master' into feature/improve-pdf-download-dialog
- Lock node version
- Update Sass
- Add back to all blogs link

fixes #122
- Make info more prominant

fixes #406
- Make plot year selectable
- Css adaptions
- Merge branch 'master' into feature/misc-improvements
- Merge branch 'feature/misc-improvements' into feature/improve-pdf-download-dialog
- Merge branch 'feature/improve-pdf-download-dialog' into 'master'

improve-pdf-download-dialog

Closes #122, #406, #405, and #407

See merge request albina-euregio/albina-website!278
- Merge branch 'eaws-regions' into 'master'

refact: use eaws-regions names

See merge request albina-euregio/albina-website!277
- Merge branch 'clean-meta' into 'master'

chore(index): remove nonsense meta tags

See merge request albina-euregio/albina-website!279
- Merge branch 'web-manifest' into 'master'

feat: add Web app manifest

See merge request albina-euregio/albina-website!280
- Add stationNames to Flipper

fixes #430
- Add Latest

fixes #429
- Add button title and i18n

fixes #431
- Merge branch 'feature/merge-275-enhancements' into 'master'

merge !275 enhancements

Closes #430, #429, and #431

See merge request albina-euregio/albina-website!281
- Merge branch 'refact-stores' into 'master'

refact: convert window.stores to constant imports

See merge request albina-euregio/albina-website!276
- Merge branch 'bulletin-geojson' into 'master'

feat(bulletin-map): render overlay from micro regions

See merge request albina-euregio/albina-website!282
- Fix for #432 positioning of buttons
- Add back link at top

fixes #427 #432
- Merge branch 'fix/#432' into 'master'

fix Blog Link to overview

Closes #432 and #427

See merge request albina-euregio/albina-website!283
- Merge branch 'import-config' into 'master'

chore: import config

See merge request albina-euregio/albina-website!284
- Add spacing

fixes #434
- Merge branch 'fix/#434' into 'master'

add keys in PDF Download Dialog

Closes #434

See merge request albina-euregio/albina-website!285

### 🚜 Refactor

- Replace html-to-react with htmr
- *(htmlParser)* Convert to TypeScript
- Refact(htmlParser: blogMode
- Remove obsolete custom.js
- *(bulletin-legend)* Use react-intl rich text formatting
- *(build)* Cleanup package.json
- *(caaml)* Convert to TypeScript
- Move to stores/bulletin
- *(bulletinStore)* Convert to TypeScript
- Rename .d.ts to .ts
- *(bulletinStore)* Convert to TypeScript
- *(bulletinStoreNeighbor)* LoadRegions
- *(bulletinStoreNeighbor)* LoadBulletins
- *(bulletinStoreNeighbor)* Load new CAAML
- *(bulletinStoreNeighbor)* Remove fallback
- *(app)* Use React.lazy for all routes
- *(eslint)* Ignore eaws-regions/
- *(eslint)* Disable jsx-a11y for now
- Extract avalancheProblems
- Use eaws-regions as node module
- Use eaws-regions names
- Move CookieStore to dialogs
- Move NavigationStore to organisms
- Move MapStore to components
- Move BulletinStore to components
- Move StationDataStore to components
- Move ArchiveStore to components
- Export APP_STORE as constant
- Move BlogStore to components
- Move WeatherMapStore to components
- Remove stores interface
- Async/await
- No braces for arrow functions
- Extract WARNLEVEL_COLORS

### ⚙️ Miscellaneous Tasks

- *(geojson)* Reduce polyline precision
- Update sentry to 6.15.0
- *(sentry)* Async
- *(i18n)* Update translations
- *(blogStore)* Remove fr
- *(bulletinStore)* Load neighbors afterwards
- Update eaws-regions
- *(bulletinStoreNeighbor)* IT-AINEVA has only one elevation
- Update micro-regions
- *(bulletinStoreNeighbor)* FR regions have only one elevation
- *(bulletinStoreNeighbor)* Split micro-regions_elevation
- *(bulletinStore)* Async load/parse regions
- *(bulletinStoreNeighbor)* Split IT-AINEVA
- Update micro-regions (start_date/end_date)
- *(i18n)* Dynamic import translations
- *(i18n)* Update translations
- *(map)* Allow zoom level 5 and 6, expand bounds
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(index)* Remove nonsense meta tags
- Update config-dev.json
- Import config

## [4.0.4] - 2021-11-25

### 🚀 Features

- *(measurements)* Operator links
- *(build)* Modern build using swc
- *(build)* Modern build using esbuild
- *(build)* Use ESBuildMinifyPlugin
- *(build)* Modern build using Vite

### 🐛 Bug Fixes

- Covert-polyline.js
- *(modal)* Downgrade to React 16

### 💼 Other

- Merge branch 'operator-link' into 'master'

feat(measurements): operator links

See merge request albina-euregio/albina-website!261
- GitLab CI: allow manual dev/beta deploys
- Revert "fix(build): use dist version react-intl"

This reverts commit 204daf83e7407c04afaa68e3ded29d9c14285d7b.
- Merge branch 'swc' into 'master'

feat(build): modern build using esbuild

See merge request albina-euregio/albina-website!251
- GitLab CI: Alpine Linux for deploy
- Merge branch 'vite' into 'master'

feat(build): modern build using Vite

See merge request albina-euregio/albina-website!262
- Merge branch 'fix-modal-react-16' into 'master'

fix(modal): downgrade to React 16

See merge request albina-euregio/albina-website!265

### 🚜 Refactor

- Remove fetch polyfill
- Remove url-search-params-polyfill
- Remove custom-event-polyfill
- Remove explicit customregenerator-runtime
- Remove requestanimationframe polyfill
- Remove format-message dependency
- Remove jsonfig.json
- Add stores to window interface

### ⚙️ Miscellaneous Tasks

- Upgrade eslint
- *(build)* Use esbuild-loader for node_modules
- *(measurements)* Meteomont operator link

## [4.0.3] - 2021-11-15

### 🐛 Bug Fixes

- Fix lock due to wrong node version locally
- Fix building bug
- Fix building bug #2
- Fix timestamp indicator position after coming back to weathermap

fixes #380
- Fix timestamp indicator position after coming back to weathermap

fixes #380

### 💼 Other

- Acitvate jumpnav

fixes #322
- Set navigation id
- Merge branch 'feature/activate-jumpnav' into 'master'

activate jumpnav

Closes #322

See merge request albina-euregio/albina-website!258
- Revert "refact(bulletinStore): mobx.makeAutoObservable"

This partially reverts commit 438b667997e28c42ba9921e735461cced42c57a8.

Fixes #412.
- Upgrade packages to fix bug

fixes #330
- Merge branch 'feature/fix-passiv-listeners-bug' into 'master'

upgrade packages to fix bug

Closes #330

See merge request albina-euregio/albina-website!259
- Merge remote-tracking branch 'origin/feature/fix-weathermap-timestamp' into feature/fix-weathermap-timestamp
- Merge branch 'feature/fix-weathermap-timestamp' into 'master'

fix timestamp indicator position after coming back to weathermap

Closes #380

See merge request albina-euregio/albina-website!260

### ⚙️ Miscellaneous Tasks

- *(config)* Use new TMS
- *(contact)* Update address for AWS tyrol!

## [4.0.2] - 2021-11-08

### 🐛 Bug Fixes

- Fix honor not used 540 image format settings

fixes #316
- *(stationDataStore)* Changing (observed) observable values without using an action is not allowed
- *(blogStore)* Changing (observed) observable values without using an action is not allowed

### 💼 Other

- Merge branch 'feature/ajust-weatherstation-images' into 'master'

fix honor not used 540 image format settings

Closes #316

See merge request albina-euregio/albina-website!256
- Add automatic subtitles

fixes #306
- Remove obsoletes
- Subtitle for measurements
- Merge branch 'feature/pages-subtitles' into 'master'

add automatic subtitles

Closes #306

See merge request albina-euregio/albina-website!257
- Merge branch 'mobx-6' into 'master'

chore: upgrade to mobx 6

See merge request albina-euregio/albina-website!255

### 🚜 Refactor

- *(mobx)* Replace deprecated decorators
- *(archiveStore)* Mobx.makeAutoObservable
- *(modalStateStore)* Mobx.makeAutoObservable
- *(navigationStore)* Mobx.makeAutoObservable
- *(mapStore)* Mobx.makeAutoObservable
- *(bulletinStore)* Mobx.makeAutoObservable
- *(mobx)* Replace @observer
- Remove @babel/plugin-proposal-decorators

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- Upgrade to mobx 6
- *(i18n)* Update link to aws tyrol on google maps

## [4.0.1] - 2021-11-08

### 💼 Other

- GitLab CI: use Node.js 14

node-sass 4.14.1 is incompatible with the new Node.js 16 LTS
- Merge branch 'nodejs-14' into 'master'

GitLab CI: use Node.js 14

See merge request albina-euregio/albina-website!254

## [4.0.0] - 2021-10-27

### 🚀 Features

- *(stationMap)* Add AWS observers
- *(bulletinStore)* Enable neighborBulletins

### 🐛 Bug Fixes

- *(web-push-dialog)* Fix intl message
- *(station-diagram)* StationData is undefined
- *(stationMap)* LWD-Region is undefined
- *(weather-station-diagrams)* Time range buttons

### 💼 Other

- SCSS for #397 linktree page
- Setup linktree ui basics
- Fetch links and images
- Remove logs
- Refine bulletin url
- Merge branch 'feature/#397-linktree' into 'master'

Feature/#397 linktree

See merge request albina-euregio/albina-website!250
- GitLab CI: update for new server
- Merge branch 'stations-marker-cluster' into 'master'

feat: improve station marker clustering

Closes #392

See merge request albina-euregio/albina-website!252
- Merge branch 'weather-station-observers' into 'master'

feat(stationMap): add AWS observers

Closes #391

See merge request albina-euregio/albina-website!253

### 🚜 Refactor

- WebpackChunkName
- *(archive)* Add @type
- *(cluster)* Cleanup
- Remove unused react-leaflet-control
- *(StaticPageStore)* Async function
- *(bulletinStore)* Const enableNeighborRegions

### 🎨 Styling

- Upgrade to Prettier 2.3.2

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- *(main)* Config.json timestamp hour precision
- Add .git-blame-ignore-revs
- *(station-icon)* Omit text element for ""
- *(cluster)* Simplify map clustering
- *(cluster)* MaxClusterRadius=11
- *(station-icon)* Double-circle for cluster markers
- *(weather-station-diagrams)* Remove 540px plot

## [3.1.9] - 2021-05-19

### 🐛 Bug Fixes

- *(open-data)* Add noopener and noreferrer

### 💼 Other

- Merge branch 'a11y' into 'master'

a11y

See merge request albina-euregio/albina-website!247
- Lots of focus states (not finished)
- Clean styles reset
- Keyboard focus styles for most focusable elements
- Corrected import path
- Merge branch 'feature/#400-focus' into 'master'

Feature/#400 focus

See merge request albina-euregio/albina-website!248
- Revert "chore(index.html): allow automatic translation, show message"

This reverts commit e5ddc248874a87a0607fe1cb141d9b14a1c1791d
- Merge branch 'revert-e5ddc248' into 'master'

Revert "chore(index.html): allow automatic translation, show message"

See merge request albina-euregio/albina-website!249

### ⚙️ Miscellaneous Tasks

- *(a11y)* Add aria-label to sm-share elements
- *(a11y)* Disable focus on elements within bulletin map (aria-hidden)
- *(a11y)* Shorten title
- *(a11y)* Add aria-hidden to subtitle
- *(a11y)* Add aria-label to search button in search-field
- *(a11y)* Add aria-label to selectric input field
- *(a11y)* Add title to youtube videos
- *(a11y)* Add alt text to archive maps
- *(a11y)* Add noopener and noreferrer
- *(a11y)* Add accessibility declaration
- *(a11y)* Add accessibility page to transifex
- *(i18n)* Update translations
- *(a11y)* Update accessibility declaration
- *(a11y)* Update accessibility declaration
- *(i18n)* Add translations for accessibility declaration
- *(i18n)* Update translations
- *(open-data)* Add link to eaws regions gitlab repository
- *(content)* Add noopener and noreferrer
- *(menu)* Remove accessibility, imprint and privacy from main menu
- *(i18n)* Update translations
- *(a11y)* Update page
- *(index.html)* Add aria-labels
- *(index.html)* Allow automatic translation, show message

## [3.1.8] - 2021-05-12

### 🐛 Bug Fixes

- *(a11y)* Remove duplicate ids
- *(a11y)* Add aria-label to home link
- *(a11y)* Add id, name and title to languages switch!
- *(a11y)* Add alt text to app images
- *(a11y)* Add title to selectric fields
- *(a11y)* Add aria-label to selectric fields
- *(a11y)* Remove aria-label
- Add user select for webkit and ms
- Add name to province filter
- *(a11y)* Use class is-visually-hidden for screen reader only texts
- *(a11y)* Use class is-visually-hidden for screen reader only texts
- Fix no bullets info

fixex #396

### 💼 Other

- Merge branch 'a11y' into 'master'

a11y

See merge request albina-euregio/albina-website!244
- Merge branch 'a11y' into 'master'

a11y

See merge request albina-euregio/albina-website!245
- Merge branch 'hotfix/fix-info-bar' into 'master'

fix no bullets info

See merge request albina-euregio/albina-website!246

### ⚙️ Miscellaneous Tasks

- *(wcag)* Add title to search button
- *(wcag)* Add title to app icons
- *(a11y)* Add role and tabIndex to language switches
- *(a11y)* Add jsx-a11y
- *(a11y)* Disable achor-is-valid and click-events-have-key-events rules
- *(a11y)* Add alt text to blog overview images
- *(a11y)* Add role and tabIndex to page flipper elements
- *(a11y)* Add title to video
- *(a11y)* Add alt text to station diagrams
- *(a11y)* Add role and tabIndex to <a> elements
- *(a11y)* Add hidden text to <a> elements in weather cockpit
- *(a11y)* Add title to selectric
- *(a11y)* Add translation string for color mode
- *(a11y)* Set select to readOnly
- *(a11y)* Add text to sort buttons in station table
- *(a11y)* Disable no-nointeractive-element-interactions rule
- *(a11y)* Show warnings for jsw-a11y rules
- *(selectric)* Fix title
- *(i18n)* Remove obsolete strings
- *(a11y)* Use aria-hidden on bulletin map (redundant content)
- *(a11y)* Add aria-label to several elements

## [3.1.7] - 2021-05-05

### 🐛 Bug Fixes

- *(info-bar)* Show missing text for latest, fixes #396

## [3.1.6] - 2021-05-03

### 🐛 Bug Fixes

- *(bulletin)* Load correct maps before 2019-05-06
- *(maps)* Url to maps before 2019-05-06
- *(maps)* Load thumbnail maps before 2019-05-06
- *(glossary)* Update links
- *(neighbor)* Change short code for Slovenia to SI
- Clicking/highlighting of warn regions
- *(bulletinStore)* Status=empty when loading fails
- Clicking/highlighting of warn regions
- *(bulletin-report)* Use correct id for section, fixes #293
- *(blog-overview)* Year and month filter
- *(archive)* Window.bulletinStore.bulletins[this.props.date] is undefined

### 💼 Other

- Add submodule eaws-regions

https://gitlab.com/eaws/eaws-regions
- Merge branch 'eaws-regions' into 'master'

refact: use eaws/eaws-regions

See merge request albina-euregio/albina-website!239
- Merge branch 'eaws-regions-elevation' into 'master'

chore: update micro-regions

See merge request albina-euregio/albina-website!240
- Merge branch 'eaws-regions-fix-highlight' into 'master'

fix: clicking/highlighting of warn regions

See merge request albina-euregio/albina-website!241
- Merge branch 'bulletinStore-fix-empty' into 'master'

fix(bulletinStore): status=empty when loading fails

See merge request albina-euregio/albina-website!242
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'master' into no-sticky-linkbar
- Merge branch 'no-sticky-linkbar' into 'master'

chore(bulletin-report): remove sticky linkbar

Closes #363

See merge request albina-euregio/albina-website!228
- #351 alt-text for missing region images, #395 clipped blog content
- Merge branch 'feature/#351-#395' into 'master'

#351 alt-text for missing region images, #395 clipped blog content

See merge request albina-euregio/albina-website!243

### 🚜 Refactor

- *(i18n)* Update translations
- Use micro-regions for micro_regions
- Use micro-regions for neighbor_regions
- Use micro-regions for neighbor_micro_regions
- Update eaws-regions
- Formatting

### ⚙️ Miscellaneous Tasks

- *(dev)* Allow more zoom levels for dev
- *(i18n-ally)* Update settings
- *(i18n)* Refactor translations
- *(i18n)* Update translations
- *(neighbor)* Add SI
- *(neighbor)* Add polygon for Slovenia
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(neighbor)* Add elevation polygons for Slovenia
- *(i18N)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations!
- Update micro-regions
- *(avalanche-problems)* Show all problems
- *(avalanche-problems)* Remove unused translation strings
- *(avalanche-problems)* Show two different problems in popup
- *(neighbor)* Show neighbor bulletins even if there is no own bulletin
- *(weather-station-diagram)* Start with time range 3 days
- *(station-diagram)* Navigate with arrow keys between diagrams
- *(station-diagram)* Sort by region id to navigate with arrow keys
- *(station-table)* Show lwd region in own column
- *(station-table)* Make operator and region searchable
- *(station-diagram)* Allow swipe
- *(neighbor)* Show neighbors in dev§
- *(micro-regions)* Use micro region names as alt text for thumbnail images
- *(station-diagram)* Add tolerance to swipe

## [3.1.5] - 2021-03-28

### 🐛 Bug Fixes

- *(subscribe)* Non-unique id
- *(menu)* Repeated re-rendering
- React/no-string-refs
- *(info-bar)* Clear timeouts on unmount
- *(menu)* Cannot read property 'history' of undefined
- *(selectric)* Performance
- *(neighbor-region)* Update geojson and polyline
- *(micro-regions)* Move id to correct place for euregio micro regions
- *(debugger)* Remove debugger statement
- Weathermaps summertime change bug

### 💼 Other

- Modified boundary
- Modified boundarys, add micro-regions for CH, add boundaries for STM, OOE, NOE
- Merge branch 'micro-regions-geojson' into 'master'

Micro regions geojson

See merge request albina-euregio/albina-website!234
- Modified attributes
- Merge branch 'micro-regions-geojson' of gitlab.com:albina-euregio/albina-website into micro-regions-geojson
- Merge branch 'micro-regions-geojson' into 'master'

Micro regions geojson

See merge request albina-euregio/albina-website!235
- Merge branch 'micro-regions-geojson' into 'master'

chore(polyline): update polylines for micro regions

See merge request albina-euregio/albina-website!236
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Remove logging
- Merge branch 'hotfix/weathermap–summertime-bug' into 'master'

Hotfix/weathermap–summertime bug

See merge request albina-euregio/albina-website!238

### 🚜 Refactor

- Remove unused react-iframe
- Remove unused react-iframe
- *(app)* Replace loadable with React.lazy
- *(cluster)* CreateClusterIcon
- *(weather-station-diagrams)* Simplify render
- *(appStore)* Language reaction

### ⚙️ Miscellaneous Tasks

- *(bulletinStoreNeighbor)* Daytime dependency
- *(bulletinStoreNeighbor)* Daytime dependency
- *(webpack)* Eval-cheap-module-source-map
- *(weather-staiton-diagrams)* Show date of data
- *(stationTable)* Use intl.formatNumber
- *(build)* Update caniuse-lite
- *(polyline)* Create new polyline files
- *(webpack)* Increase maxAssetSize a little bit
- *(polyline)* Update polylines for micro regions
- *(package.json)* Add possibility to test with real data
- *(neighbor)* Show micro regions for CH
- *(neighbors)* Update micro regions
- *(open-data)* Change link to base map repository, delete reference to TMS
- *(i18n)* Update translations

## [3.1.4] - 2021-03-09

### 🚀 Features

- *(bulletin-map)* Show neighbor bulletins
- *(bulletinStoreNeighbor)* Add CH, LI
- *(web-push)* Enable web push on production

### 🐛 Bug Fixes

- *(control-bar)* Style backgroundImage

### 💼 Other

- Merge branch 'neighbor-bulletin' into 'master'

feat(bulletin-map): show neighbor bulletins

Closes #369

See merge request albina-euregio/albina-website!219

### 🚜 Refactor

- *(bulletinStore)* NeighborBulletins in BulletinCollection
- *(bulletinStore)* Field initialisation

### ⚙️ Miscellaneous Tasks

- *(service-worker)* Obtain URL from JSON
- *(service-worker)* Notification image
- *(bulletinStoreNeighbor)* Filter validityDate
- *(bulletinStoreNeighbor)* Polyline encoding
- *(bulletinStoreNeighbor)* Separate JSON per region
- *(bulletinStore)* Notify status change for neighbors
- *(bulletinStoreNeighbor)* PyAvaCore JSON
- *(neighbor_regions)* Update for BY, CH
- *(bulletinStoreNeighbor)* Cache loadedRegions

## [3.1.3] - 2021-03-04

### 🐛 Bug Fixes

- *(i18n)* Typo

### 💼 Other

- #386 Style leaflet bulletin tooltips
- #385 Visual element to inform users about something
- #385 controlbars for CTAs
- Add controlbar component
- Replace existing controlbars
- Add community page
- Cleaning

Closes #385
- Merge branch 'feature/#385-#386' into 'master'

Feature/#385 #386

Closes #385

See merge request albina-euregio/albina-website!232
- Merge branch 'rm-SubscribeConfirmation' into 'master'

chore: remove SubscribeConfirmation

See merge request albina-euregio/albina-website!231
- Merge branch 'master' into feature/survey
- Merge branch 'feature/survey' into 'master'

Feature/survey

See merge request albina-euregio/albina-website!233

### 🚜 Refactor

- *(build)* License and repository

### ⚙️ Miscellaneous Tasks

- *(sitemsap)* Add handbook
- *(community)* Hide community page in menu
- Remove SubscribeConfirmation
- *(i18n)* Add community page to transifex
- *(community)* Place some placeholder texts!
- *(community)* Show in menu
- *(community)* Add to sitemap
- *(community)* Fill page with content
- *(community)* Add community page to education overview page
- *(survey)* Add control bar to landing page
- *(webpack)* Simplify git invocation
- *(i18n)* Update translations
- Configure i18n-ally for VS Code
- *(i18n)* Update translations
- *(community)* Update URL to survey
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations!
- *(i18n)* Update translations

## [3.1.2] - 2021-02-04

### 🚀 Features

- *(stationMeasurements)* Support deeplinks

### 🐛 Bug Fixes

- *(avalanche-problems)* Persistent weak layers
- *(util/fetch)* Import unfetch/polyfill
- Www.lawinen.report is in English
- *(subscribe-email-dialog)* Content-Type for POST
- *(subscribe-email-dialog)* Use fetchText

### 💼 Other

- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'fix-www' into 'master'

fix: www.lawinen.report is in English

See merge request albina-euregio/albina-website!227
- Merge branch 'station-measurements-deeplink' into 'master'

feat(stationMeasurements): support deeplinks

Closes #129

See merge request albina-euregio/albina-website!230

### 🚜 Refactor

- *(bulletin)* Extract bulletin-footer

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- *(bulletin-report)* Remove sticky linkbar
- *(bulletin)* Back to map below tendency section

## [3.1.1] - 2021-01-29

### 🐛 Bug Fixes

- Fix rotation #1
- Fix rotation #2

### 💼 Other

- Try to compensate for early hours
- Merge branch 'hotfix/IOS-wind-directions' into 'master'

Hotfix/ios wind directions

Closes #379

See merge request albina-euregio/albina-website!226
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

### ⚙️ Miscellaneous Tasks

- *(web-push)* Enable web push for beta
- *(handbook)* Closes #287
- *(i18n)* Update translations

## [3.1.0] - 2021-01-26

### 🚀 Features

- Add support for push-notifications
- *(subscribe-web-push-dialog)* Language + region selection
- *(bulletin-map)* Select micro region
- *(bulletin-map-details)* Display active region
- *(bulletin-map)* Select micro region
- *(bulletin-map-details)* Display active region
- *(bulletin-vector-layer)* Add region tooltip

### 🐛 Bug Fixes

- UseEffect must not return anything warning
- *(debugger)* Remove debugger statement
- *(blogStore)* URL update for /beta/ and /dev/
- Fixes #360
- Fix selection
- Fix linting
- *(subscribe-web-push-dialog)* Lost i18n strings
- React-hooks/rules-of-hooks
- React/jsx-no-target-blank
- React/no-direct-mutation-state
- React/no-string-refs
- React/no-unescaped-entities
- React/display-name
- *(neighbors)* Show country and region name only once!
- *(highlights)* Remove bulletin-report-public-alert-text span
- *(bulletin-map)* Unique key
- *(bulletin-awmap-static)* For archive-item w/o publication time
- *(neighbor_regions)* Lombardia (MultiPolygon)
- Fix startTime
- Fix merge
- *(overlay)* Fixes #381
- *(bulletin)* Delete unused import

### 💼 Other

- Merge branch 'push-notification' into 'master'

feat: add support for push-notifications

Closes #304

See merge request albina-euregio/albina-website!211
- Merge branch 'mobx-react-6' into 'master'

refact: update and simplify mobx usage

See merge request albina-euregio/albina-website!210
- Merge branch 'refact-base' into 'master'

refact: replace Base class

See merge request albina-euregio/albina-website!212
- #355 Fix z-value for dropdowns
- #360 Add unit to legend of weather maps
- #366 Breakpoint for mobile menu
- #377 Blog Badge in Footer margin
- Show units in legend
- #355 Fix z-value for dropdowns
- #360 Add unit to legend of weather maps
- #366 Breakpoint for mobile menu
- #377 Blog Badge in Footer margin
- Merge remote-tracking branch 'origin/feature/#355-#360-#366-#376' into feature/#355-#360-#366-#376
- Add span
- #355 #360 #366 #377
- Add unit title
- Merge branch 'feature/#355-#360-#366-#376' of gitlab.com:albina-euregio/albina-website into feature/#355-#360-#366-#376
- Introduce telegram subscription
- Merge branch 'feature/telegram' into 'master'

Feature/telegram

See merge request albina-euregio/albina-website!213
- Merge branch 'web-push-dialog' into 'master'

feat(subscribe-web-push-dialog): language + region selection

Closes #304

See merge request albina-euregio/albina-website!215
- Merge branch 'master' into feature/#355-#360-#366-#376
- Merge branch 'feature/#355-#360-#366-#376' into 'master'

Feature/#355 #360 #366 #376

Closes #360

See merge request albina-euregio/albina-website!214
- Merge branch 'eslint-react' into 'master'

chore(eslint): plugin:react, plugin:react-hooks

See merge request albina-euregio/albina-website!216
- Merge branch 'subscribe-description' into 'master'

chore(subscribe-dialog): add description text

Closes #136

See merge request albina-euregio/albina-website!217
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'select-microregions' of gitlab.com:albina-euregio/albina-website into select-microregions
- DOM structure for styling of micro region names
- #376 Style popup info for micro regions
- Merge branch 'use-fetch' into 'master'

refact: replace axios with fetch API

See merge request albina-euregio/albina-website!220
- Merge branch 'avoid-status' into 'master'

refact(bulletinStore): do not call /status

See merge request albina-euregio/albina-website!221
- Merge branch 'micro-region-tooltip' into 'master'

feat(bulletin-vector-layer): add region tooltip

See merge request albina-euregio/albina-website!218
- Merge branch 'polyline-multipolygon' into 'master'

fix(neighbor_regions): Lombardia (MultiPolygon)

See merge request albina-euregio/albina-website!222
- Merge branch 'polyline-micro-regions' into 'master'

chore: use polyline encoded micro regions

See merge request albina-euregio/albina-website!223
- Merge branch 'top-loadable' into 'master'

chore: use dynamic import only on top-level

See merge request albina-euregio/albina-website!224
- Try to compensate for early hours
- Merge branch 'hotfix/fix-weather-overlays' into 'master'

Hotfix/fix weather overlays

See merge request albina-euregio/albina-website!225

### 🚜 Refactor

- *(config)* Extract vapidPublicKey
- Extract isPushNotificationSupported
- Rename Web Push
- Kill LocaleStore, mobx-react-intl
- Drop react-intl component API usages
- Replace Base.makeUrl with URLSearchParams
- Replace Base.searchChange
- Replace Base.searchGet
- Extract app/utpl/searchParams.js
- Extract app/util/blendMode.js
- Extract app/util/clamp.js
- Refact(subscribe-dialog)
- *(bulletinStore)* GetBulletinForMicroRegion
- *(bulletinStore)* GetBulletinForMicroRegion
- *(bulletin-vector-layer)* Simplify
- *(bulletin)* I18n keys button:weather:*:text
- *(bulletin)* I18n keys bulletin:blog:*:text
- *(bulletin)* I18n keys button:blog:*:link
- *(bulletin)* I18n keys button:snow:*:link
- *(bulletin)* I18n keys button:education:*:link
- *(weather-map-cockpit)* I18n keys *unit:title
- *(micro_regions)* Remove unused props, use id
- *(neightbor_regions)* Use id
- *(bulletin)* Use GeoJSON.Feature.id
- *(stationMeasurements)* I18n keys button:snow:*:link
- Replace axios with fetch API
- *(bulletinStore)* Do not call /status
- *(bulletinStore)* Remove activeBulletinValid

### ⚙️ Miscellaneous Tasks

- Enable push-notification only for /dev/
- Translate dialog:subscribe-web-push
- Update to mobx-react 6.3.1
- *(thumbnail-maps)* Load thumbnail maps from subdirectory
- *(overlay-map)* Load overlay map from subdirectory
- *(translation)* Do not allow automatic translation of the website
- *(webpack)* Typings
- *(i18n)* Update translations
- *(subscribe-dialog)* Add Web Push selection
- *(eslint)* Plugin:react, plugin:react-hooks
- *(subscribe-dialog)* Change order
- *(subscribe-dialog)* Add description text
- *(i18n)* Updated -> Created, shorten update text
- *(i18n)* Udpate translations
- *(i18n)* Update translations
- *(micro_regions)* Update from albina-admin-gui
- *(webpack)* Increase maxAssetSize
- *(micro_regions)* Update from albina-admin-gui
- *(webpack)* Increase maxAssetSize
- *(micro-regions)* Show name in different languages
- *(neighbors)* Show country and region name from i18n
- *(micro-regions)* Allow to select one micro region and change it within a warning region
- *(i18n)* Update translations
- Merge branch select-microregions, update neighbor regions polyline
- *(i18n)* Update translations
- *(appStore)* Typings
- Use polyline encoded micro regions
- Use dynamic import only on top-level
- *(i18n)* Update translations

## [3.0.10] - 2021-01-04

### 🐛 Bug Fixes

- *(bulletinStore)* Load as text, use DOMParser
- *(open-data)* Rename gis data to geodata
- *(timeline)* Use getLeftForTime

### 💼 Other

- Merge branch 'deprecate-babel/polyfill' into 'master'

refact: replace @babel/polyfillis with core-js

See merge request albina-euregio/albina-website!199
- Merge branch 'array.every' into 'master'

refact(dataOverview): use Array.every

Closes #362

See merge request albina-euregio/albina-website!200
- Revert "chore(caaml): return undefined for undefined"

This reverts commit 533c1fe09f1473ab2a4c9d532a034a8cb7ebaba8.
- Merge branch 'axios-xml' into 'master'

fix(bulletinStore): load as text, use DOMParser

Closes #361

See merge request albina-euregio/albina-website!202
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'feature/open-data' into 'master'

feature/open data

Closes #207 and #348

See merge request albina-euregio/albina-website!203
- Merge branch 'size-plugin' into 'master'

chore(build): enable size-plugin

See merge request albina-euregio/albina-website!205
- Merge branch 'webpack-merge-config' into 'master'

chore(build): merge config.json files via webpack

See merge request albina-euregio/albina-website!206
- Merge branch 'refact-regionCodes' into 'master'

refact: extract regionCodes from appStore

See merge request albina-euregio/albina-website!207
- Merge branch 'refact-warnLevel' into 'master'

refact: extract getWarnlevelNumber from appStore

See merge request albina-euregio/albina-website!208
- Merge branch 'polyline' into 'master'

chore: compress region coordinates using polyline

See merge request albina-euregio/albina-website!209
- Merge branch 'timeline-getLeftForTime' into 'master'

fix(timeline): use getLeftForTime

Closes #364

See merge request albina-euregio/albina-website!201

### 🚜 Refactor

- Replace @babel/polyfillis with core-js
- *(dataOverview)* Use Array.every
- Extract regionCodes from appStore
- Extract getWarnlevelNumber from appStore

### ⚙️ Miscellaneous Tasks

- *(open-data)* Add page
- *(open-data)* Add xml
- *(open-data)* Mention GPLv3
- *(i18n)* Add open-data page to transifex
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(open-data)* Add java dude
- *(i18n)* Update translations
- *(build)* Enable size-plugin
- *(build)* Merge config.json files via webpack
- Compress region coordinates using polyline
- Use polyline encoded neighbor regions

## [3.0.9] - 2020-12-13

### 🚀 Features

- *(bulletin-map)* Load overlay.webp
- *(bulletin-awmap-static)* Load overlay.webp

### 🐛 Bug Fixes

- *(page-header)* Duplicate key
- *(leaflet-map)* _leaflet_pos is undefined
- *(archive-item)* Threshold date

### 💼 Other

- Merge branch 'overlay-webp' into 'master'

feat(bulletin-map): load overlay.webp

Closes #367

See merge request albina-euregio/albina-website!186
- Merge branch 'overlay-webp' into 'master'

feat(bulletin-awmap-static): load overlay.webp

Closes #367

See merge request albina-euregio/albina-website!187
- Merge branch 'update-sentry' into 'master'

chore: update sentry, migrate to @sentry/react

See merge request albina-euregio/albina-website!189
- Merge branch 'page-header-duplicate-key' into 'master'

fix(page-header): duplicate key

See merge request albina-euregio/albina-website!190
- Merge branch 'componentWillReceiveProps-is-deprecated' into 'master'

refact: componentWillReceiveProps is deprecated

See merge request albina-euregio/albina-website!191
- Merge branch 'no-console' into 'master'

refact: no-console

See merge request albina-euregio/albina-website!192
- Merge branch 'leaflet-map-moveend' into 'master'

refact(leaflet-map): remove workaround for moveend

See merge request albina-euregio/albina-website!193
- Merge branch '_leaflet_pos' into 'master'

fix(leaflet-map): _leaflet_pos is undefined

Closes #331

See merge request albina-euregio/albina-website!194
- Merge branch 'archive-threshold-date' into 'master'

fix(archive-item): threshold date

See merge request albina-euregio/albina-website!195
- Merge branch 'archive-item-am-fd' into 'master'

chore(archive-item): load fd_albina_thumbnail if am_albina_thumbnail fails

See merge request albina-euregio/albina-website!196
- Merge branch 'update-urls' into 'master'

chore(neighbor_regions): update URLs

See merge request albina-euregio/albina-website!197
- Remove sorting of problems, stick to xml sorting
- Merge branch 'hotfix/fix-bulletin-problems-sorting' into 'master'

remove sorting of problems, stick to xml sorting

See merge request albina-euregio/albina-website!198

### 🚜 Refactor

- ComponentWillReceiveProps is deprecated
- No-console
- *(leaflet-map)* Remove workaround for moveend

### ⚙️ Miscellaneous Tasks

- Update sentry, migrate to @@sentry/react
- *(archive-item)* Load fd_albina_thumbnail if am_albina_thumbnail fails
- *(neighbor_regions)* Update URLs

## [3.0.8] - 2020-12-04

### 🐛 Bug Fixes

- *(subscribe-dialog)* Link to privacy
- *(danger-patterns)* Anchors
- Fix sorting

### 💼 Other

- Merge branch 'hotfix/fix-bulletin-problems-sorting' into 'master'

fix sorting

See merge request albina-euregio/albina-website!185

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations

## [3.0.7] - 2020-12-04

### 🐛 Bug Fixes

- *(i18n)* Link text new snow in DE

## [3.0.6] - 2020-12-04

### 💼 Other

- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

## [3.0.5] - 2020-12-03

### 🐛 Bug Fixes

- Fix all buttons move time back (fixes #365)

### 💼 Other

- Merge branch 'hotfix/not-every-button-to-change-time' into 'master'

fix all buttons move time back (fixes #365)

Closes #365

See merge request albina-euregio/albina-website!184

## [3.0.4] - 2020-12-03

### 💼 Other

- Use direction of wind for gust domain
- Merge branch 'fix/gust-winddirection' into 'master'

use direction of wind for gust domain

See merge request albina-euregio/albina-website!182
- Merge branch 'master' into hotfix/winddirection
- Restore fix for null values
- Merge branch 'hotfix/winddirection' into 'master'

Hotfix/winddirection

See merge request albina-euregio/albina-website!183

## [3.0.3] - 2020-12-03

### 🐛 Bug Fixes

- *(handbook)* One, two or more avalanche problems

### 💼 Other

- Use correct datalayer, reverse direction
- Merge branch 'hotfix/winddirection' into 'master'

use correct datalayer, reverse direction

See merge request albina-euregio/albina-website!181

### ⚙️ Miscellaneous Tasks

- *(i18n)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations, fix links to weather maps

## [3.0.2] - 2020-12-02

### 🐛 Bug Fixes

- *(lang)* Order of languages in menu
- *(lang)* Language name aranese

### ⚙️ Miscellaneous Tasks

- *(oc)* Change language name from Occitan to Aranese
- *(i18n)* Update translations
- *(i18n)* Update translations

## [3.0.1] - 2020-11-30

### 🐛 Bug Fixes

- *(header)* Logo for IT and DE
- *(staticPageStore)* Extract title from <h1>
- *(station-icon)* Display for value=0
- *(blogStore)* Only update /blog URLs
- *(bulletin-problem-item)* DangerRating undefined
- *(caaml)* Avoid document.children spread
- *(page-header)* Delete unused variable
- *(caaml)* Document.children is undefined

### 💼 Other

- I18n update
- Merge branch 'StaticPageStore-title' into 'master'

fix(staticPageStore): extract title from <h1>

Closes #356

See merge request albina-euregio/albina-website!175
- Merge branch 'station-icon-zero' into 'master'

fix(station-icon): display for value=0

Closes #353

See merge request albina-euregio/albina-website!176
- Merge branch 'no-latest-request' into 'master'

refact(bulletinStore): avoid /latest API call

Closes #261

See merge request albina-euregio/albina-website!177
- Merge branch 'blog-query-param' into 'master'

fix(blogStore): only update /blog URLs

Closes #357

See merge request albina-euregio/albina-website!178
- Merge branch 'dangerRating-undefined' into 'master'

fix(bulletin-problem-item): dangerRating undefined

Closes #358

See merge request albina-euregio/albina-website!179
- Merge branch 'document.children-spread' into 'master'

fix(caaml): avoid document.children spread

Closes #359

See merge request albina-euregio/albina-website!180
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

### 🚜 Refactor

- *(bulletinStore)* Avoid /latest API call

### ⚙️ Miscellaneous Tasks

- *(sentry)* Ignore axios errors
- *(caaml)* Return undefined for undefined

## [3.0.0] - 2020-11-25

### 🚀 Features

- *(neighbor_regions)* Add neighbors to map
- Change dev config
- *(index.html)* Add link to simple version
- *(VideoModal)* Add easter egg
- Add images to more and education page
- Update images on about and education page
- Add French language
- Use avalanche report tms in dev
- Allow zoom 11 and 12 on development
- Add translations!
- *(app)* Add URL paths for additional languages
- *(i18n)* Add Catalan, Spanish, Occitan language
- Add Català, Español, Occitan
- Subdomains for languages

### 🐛 Bug Fixes

- *(jsx)* ClassName
- *(neighbor_regions.geojson.json)* Reduce amount of services
- *(table-measurements)* Cursor=pointer on tbody
- *(bulletinStore)* Glitches in CAAML conversion
- *(bulletinStore)* Glitches in CAAML conversion
- Change maxZoom to 13
- Do not use webp (revert this commit after testing)
- Comment ununsed lines (revert after testing)
- *(VideoModal)* Delete unused var
- *(NeighborRegions)* Update neighbor regions GeoJSON
- Fix translation in en
- *(caaml)* MaxWarnlevel for "n/a"
- Lint errors
- Class to className
- Delete unused import
- Lint
- Remove duplicate i18n entry
- *(i18n)* Delete empty lines for fr
- Set tms to false for avalanche report map
- Use correct references to figures in handbook, fix typo
- Reference to figure
- *(i18n)* Typo in translation key
- *(bulletin-report)* Handle <br>
- *(caaml)* Persistent_weak_layers
- *(appStore)* Config is not defined
- *(info-bar)* Warning: Each child in a list should have a unique "key" prop.
- *(info-bar)* Typo in code "Interval"
- Remove info bar if blog posts were found
- Z-index of dropdowns in controlbar
- Typo in about
- Fix ticks
- Fix range
- Fix loading circle for update of domain and timespan
- Fix stationdata appearance
- Fix legend
- Fix mouseup
- Fix hourly caption
- Fix analytic indicator
- Fix range calculation
- Fix end of forecast
- Fix layout (scroll bar)
- Fix label
- Fix handling of 0 value
- Fix bbox
- Fix lost subscribtion changes
- Fix range size
- Fix weatherstations
- Fix open station info
- Fix stamp positioning
- Fix lower limit for timearray calculation
- *(blogStore)* Ignore false-positive eslint warn
- Fix player
- Fix stations for player
- Fix agl date for 24, 48, 72
- Fix for weathermap vh bug and range selector anchor hours
- Typos
- Contact url for tyrol
- Fix wintertime offset on timespans >6
- Blue hover on blog images (their table based implementation is strange anyway)
- Position of map scale on weather map (needs .section-weather-map-cockpit added to .section-weather-map) vs. station map (don't add .section-weather-map-cockpit)
- Fix marker position
- Fix data layer differences
- Fix srolling
- Fix spiderfy
- Fix tooltips
- Fix cluster icon opacity
- Fix unwanted adding of problems
- Fix feature links
- Fixing subscribe popup
- Subscribe modal and button hover states on touch
- Fix property name
- Fix class
- Allow only de, it and en as languages for blog posts
- Headlines for pages in category more
- Delete empty translation string, add texts for education overview page in EN
- Length of introduction texts for education
- Translation key for headline and title in archive
- Use translation ids for title in about page
- Translation in de
- *(bulletin-date-flipper)* /more/archive link
- Upgrade from 3 to 7 languages in handbook
- Spanish translation of placeholder
- *(imprint)* Link to privacy policy
- *(about)* The future is now
- *(handbook)* Explain elevations, link to lawis
- *(subscribe-social-media-dialog)* Link to contact page
- *(danger-scale)* Translation persistent weak layer, link
- *(handbook)* Danger_icons image url, link to weather maps new snow
- *(about)* Use present instead of future
- *(handbook)* Use relative urls
- *(imprint)* Use relative url
- *(handbook)* Link to lawis in en, typo
- *(privacy)* Structure
- *(privacy)* Delete link duplicate
- *(danger-scale)* Link to eaws pdf
- *(i18n)* Use translations for weather map cockpit (play, stop, select parameter)
- *(i18n)* Use en-GB!
- *(header)* Show Avalanche.report in header for new languages
- *(archive)* New languages link to PDF and XML in English, map and link to bulletin is hidden
- *(handbook)* Add languages to textblock
- *(lang)* Add new languages to regions array

### 💼 Other

- Merge branch 'neighbor' into 'master'

feat: link other warning services in map

Closes #30

See merge request albina-euregio/albina-website!155
- All such buttongroups are switched to list-buttongroup-dense
- Layout repair
- Merge branch 'master' into buttongroups
- Merge branch 'buttongroups' into 'master'

Buttongroups

See merge request albina-euregio/albina-website!156
- Merge branch 'master' into neighbor
- Merge branch 'neighbor' into 'master'

Neighbor

See merge request albina-euregio/albina-website!157
- Merge branch 'neighbor-highlight' into 'master'

chore(neighbor_regions): highlight active neighbor

See merge request albina-euregio/albina-website!158
- Delete _fetch_from_cms.js

The CMS has been shut down.
- Merge branch 'use-caaml' into 'master'

refact(bulletinStore): use CAAML

See merge request albina-euregio/albina-website!143
- Merge branch 'station-data-sorting' into 'master'

chore(stationDataStore): sort using localeCompare

See merge request albina-euregio/albina-website!160
- Revert "fix: comment ununsed lines (revert after testing)"

This reverts commit 288a89111a4ac4f62571236f9bee76ec73654fc3.
- Revert "fix: do not use webp (revert this commit after testing)"

This reverts commit d66b4389c8705b58245102c830145983e87b4843.
- Revert "fix: change maxZoom to 13"

This reverts commit 07db54fa95d1fd09e1d5894d89dc896623ffd2e3.
- Revert "feat: change dev config"

This reverts commit 3f843d0d2a1278ae491aa2ebfc8ecfeac9e8edc8.
- Merge branch 'master' into french
- Merge branch 'master' into french
- Merge branch 'master' into french
- Merge branch 'master' into french
- Merge branch 'french' into 'master'

feat: add French language

See merge request albina-euregio/albina-website!161
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'use-caaml-6.0' into 'master'

refact(bulletinStore): use CAAML 6.0

See merge request albina-euregio/albina-website!162
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'i18n-url' into 'master'

feat(app): add URL paths for additional languages

Closes #350

See merge request albina-euregio/albina-website!163
- Merge branch 'i18n-ca-es-oc' into 'master'

feat(i18n): add Catalan, Spanish, Occitan language

See merge request albina-euregio/albina-website!164
- Add timedimension plugin
- Try without leaflet timedimension
- Use plugin
- Inspection
- Without timedimension
- Add css
- New config, new store
- Tempering with reactivity
- Get overlayfilename
- Basic time control
- Remove timedimension plugin
- Enable +- timeSpans
- Init time control
- Use new overlays
- Add timedimension plugin
- Try without leaflet timedimension
- Use plugin
- Inspection
- Without timedimension
- Add css
- New config, new store
- Tempering with reactivity
- Get overlayfilename
- Basic time control
- Remove timedimension plugin
- Enable +- timeSpans
- Init time control
- Use new overlays
- Merge branch 'eature/weathermaps-new' into feature/weathermaps-with-timedimensions
- Merge remote-tracking branch 'origin/feature/weathermaps-with-timedimensions' into feature/weathermaps-with-timedimensions
- Get stationdata for utc time
- Hide log
- Use stationdata for timestamp
- Switch to new weathermapstore
- Change title for new store
- Use canvas
- Introduce data overlay handling
- Enable multipe dataOverlays
- DataOverlay only when not playing
- Add wm cockpit
- Add domains and timeArray to cockpit
- Refine cockpit
- Se funky setup yo
- Remove bower relations
- Hooking optimized
- Merge branch 'feature/weathermaps-with-timedimensions' into feature/weathermaps-styling
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Include styling
- New icons for weather map: Fontello and SCSS
- Refined / renewed buttons and icons on maps: zoom, search, locate, scale
- General map/bulletin/template preparations
- Progress on weather map cockpit
- Layer-selector added to weather maps cockpit
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Use styling
- Merge branch 'feature/weathermaps-with-timedimensions' into feature/weathermaps-styling
- Images/dev
- Merge remote-tracking branch 'origin/feature/weathermaps-styling' into feature/weathermaps-styling
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Weather-map-cockpit z-index
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Cockpit timeline
- Enhance timescale
- Multiple days in timeline
- New page-header #1
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Logo_euregio_transparent.png for new lower .page-header
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- .page-header progress and .js-dragging on cockpit range and point elements
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Draggable time selector
- Dragging coordination
- Cleaning
- Range hanlding
- Cleaning
- Small page-header-logo
- Blog-posts styles
- Blog new post labels
- HTML for new page-header
- Public alert
- Renaimed german main menu items
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Add prev next buttons
- Cleaning
- Show station for analysis only
- Übersetzungen ergänzt
- Show marker on dataLayer click
- Hide logs
- Add mobile trigger function
- Add new station icons
- Refine icons
- Cleaning
- Remove logs
- Refine circles
- Respect timespan for timeline length
- Cleaning
- Dont show stations while playing
- Refine station parameter settings
- Refine station parameter settings
- Merge remote-tracking branch 'origin/feature/weathermaps-with-timedimensions' into feature/weathermaps-with-timedimensions
- Refine config
- Timeline as seperate component
- Replace draggable
- Refine dragging coordination
- Merge branch 'feature/improve-cockpit' into feature/weathermaps-with-timedimensions
- Show data marker at click position
- Round temperature
- No fontsize for icons
- Refine domain buttons
- Remove debugging indicator
- Hide footer
- Reset datamarker onupdate
- Display last and next update time
- Show all bulletin report avalanche problems by clicking trigger
- Bulletin icons for situation-frequencies
- Page-header for weather-map
- Added page-header-trigger for weather map
- Merge branch 'feature/weathermaps-styling' into feature/weathermaps-with-timedimensions
- Hide/show page-header
- Add en labels
- Hide log
- Introduce debug modus to verify data layers
- Rework update times
- Cleaning
- Enable public alert
- Remove log
- Show badge for new blog entries
- Merge branch 'feature/blog-new-entries-badge' into feature/weathermaps-update
- Add frequency
- Merge branch 'feature/bulletin-add-frequency' into feature/weathermaps-update
- Enable more problems
- Remove fakes
- Merge branch 'feature/bulletin-more-problems' into feature/weathermaps-update
- Subscription using overview tabs
- Merge branch 'feature/weathermaps-styling' into feature/improve-subscribe-dialogs
- Auto stash before merge of "feature/improve-subscribe-dialogs" and "feature/weathermaps-styling"
- Open sub dialogs within subscribe dialog
- Remove log
- Merge branch 'feature/improve-subscribe-dialogs' into feature/weathermaps-update
- Lang main not clickable
- Open submenu on touch devices
- Restrict double touch to touchdevices > 1024
- Merge branch 'feature/new-menu-layout' into feature/weathermaps-update
- Enable next prev and play with keyboard
- Little improvements
- Reposition map scale (Massstab)
- Merge remote-tracking branch 'origin/feature/weathermaps-update' into feature/weathermaps-update
- Linting
- Remove (c)
- Highlight current day
- Hide flipper and playbutton if there is only one option
- Hide time info when dragging
- Make days clickable
- Introduce timespan specific agls
- Merge branch 'feature/weathermaps-update' into 'master'

Feature/weathermaps update

See merge request albina-euregio/albina-website!165
- Merge branch 'hotfix/fix-wm-player' into 'master'

fix player

See merge request albina-euregio/albina-website!166
- Remove logs
- Merge branch 'hotfix/wm-stations-for-player' into 'master'

Hotfix/wm stations for player

See merge request albina-euregio/albina-website!167
- Little improvements
- Reposition map scale (Massstab)
- Merge branch 'feature/weathermaps-styling' into hotfix/timespan-agl-fixing
- Ajust viewport height for mobiles
- Cleaning
- Merge branch 'timespan-agl-fixing' into 'master'

Timespan agl fixing

See merge request albina-euregio/albina-website!168
- I18n update
- Remove <VideoDialog> from components/page
- GitLab CI: improve caching

- https://docs.gitlab.com/ee/ci/caching/#caching-nodejs-dependencies
- https://docs.gitlab.com/ee/ci/yaml/#cachekeyfiles
- GitLab CI: split build/deploy jobs
- GitLab CI: apt-get install webp
- Add touch dragging
- Dont loop with arrows
- Stop playing when changing domain
- Keep currentTime on domain change
- Start with time closest to now
- Better weather map cockpit release update breakpoint
- Better solution for public alert
- Merge branch 'feature/weathermaps-styling' into feature/weathermap-update-feedback
- Page-header only hidden with body.s-weathermap-2020
- Merge branch 'feature/weathermaps-styling' into feature/weathermap-update-feedback
- Make header sticky
- Add tooltip to station icons
- Remove obsolete timedimension settings
- Cleaning
- Cleaning
- Show wind indicators
- Wind inidcators scaling
- Improve wind indicators
- Long arrows
- Direction arrows handling / timimg
- Show only two main problems
- Make more problems hideable part #1
- Hide frequency
- Enhance public alerts
- Enhance public alerts in details
- CSS no longer controls visibility of list-bulletin-report-pictos
- Merge branch 'feature/weathermaps-styling' into feature/weathermap-update-feedback
- Hide and show more problems for each sections seperately
- Ajust dev env config
- Use diffent zoom range for weather and station maps
- Refine zoom settings
- Override with additional config instead of replacing
- Add config info
- Enable dataoverlay while playing
- Show stations on station map
- Hide log
- Linting
- Linting #2
- Merge remote-tracking branch 'origin/feature/weathermap-update-feedback'
- Revert "fix: use translation ids for title in about page"

This reverts commit 8e275eaa244d4c7d80b8f4c77c828a30cdcc2c17
- Merge branch 'revert-8e275eaa' into 'master'

Revert "fix: use translation ids for title in about page"

See merge request albina-euregio/albina-website!171
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Merge branch 'lang-ca-es-oc' into 'master'

feat: add Català, Español, Occitan

See merge request albina-euregio/albina-website!172
- Merge branch 'language-subdomains' into 'master'

feat: subdomains for languages

Closes #354

See merge request albina-euregio/albina-website!173
- Merge branch 'archive-links' into 'master'

fix: /archive links

See merge request albina-euregio/albina-website!174
- Update README.md
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

### 🚜 Refactor

- *(bulletinStore)* Use CAAML
- *(bulletinStore)* Change CAAML to ALBINA JSON
- *(bulletinStore)* Change CAAML to ALBINA JSON
- New bulletinStore after changing locale
- *(bulletinStore)* Computation of maxWarnlevel
- *(bulletinStore)* Add tendency
- *(weather-station-diagrams)* Plot URL to config
- *(bulletinStore)* Use CAAML 6.0
- *(caaml)* Use plural variable names
- Refactor player
- Refactor player
- Refactor wm store, remove gap
- Refactor nextupdate date

### 🎨 Styling

- Style direction arrows

### 🧪 Testing

- Testing
- Testing
- Test

### ⚙️ Miscellaneous Tasks

- Add eaws_areas_neighbour_regions_epsg4326
- *(neighbor_regions)* Remove nonsense
- *(neighbor_regions)* Rename file
- *(neighbor_regions)* Remove nonsense
- *(neighbor_regions)* Improve names
- *(neighbor_regions)* COORDINATE_PRECISION=4
- *(neighbor_regions)* Support multiple services
- *(package.json)* Remove --open
- *(package.json)* Add start-dev
- *(webpack)* Fix historyApiFallback for dev
- *(neighbor_regions)* Highlight active neighbor
- *(stationDataStore)* Sort using localeCompare
- *(neighbors)* Use more detailed polygons for neighbor regions
- *(MicroRegions)* Add geojson for micro regions
- *(PublicAlert)* Add public alert to bulletin
- Remove covid-19 text
- *(More)* Move more from content to views, add translation to i18n
- Add button groups to views, add translation to i18n
- *(i18n)* Add education texts to i18n
- Add page title and headline to i18n
- *(content)* Add content html files again to test transifex fix
- *(transifex)* Add one content page to transifex config
- Use content files where useful
- Add translation files to transifex config
- Delete translation files for content (has to be translated via transifex)
- *(prettier)* Ignore translated app/content/
- *(i18n)* I18n update
- *(weather-station-diagrams)* Wiski.tirol.gv.at
- *(i18n)* I18n update
- *(bulletin)* Add typing
- *(caaml)* Add typing for CAAML 6.0
- *(bulletinStore)* Typings
- *(config)* Update CAAML v6 filename
- Update translations
- Update translations
- Show month filter only if year is selected
- *(fr)* Do not update hostname unless changed
- *(i18n)* I18n update
- *(webpack)* Increase maxAssetSize
- Shorten main menu texts
- Update translations
- Delete video link in bulletin header
- *(fr)* Set French language
- *(i18n)* Update translations
- Allow email subscription only for de, it and en
- Add translations
- Delete obsolete about.jsx file
- Sort languages alphabetical
- *(app)* Redirect /archive to /more/archive
- Update translations (snow height diff)
- *(i18n)* Use link to mountain weather in south tyrol
- *(handbook)* Update text of mobile observers
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(i18n)* Update translations
- *(prettier)* Ignore new language content files
- *(i18n)* Update translations
- Add region names to translation file, show region name in weather station diagram in correct lang
- *(i18n)* Update translations for region names

## [2.2.2] - 2020-03-17

### 🚀 Features

- Add covid-19 text

### 🐛 Bug Fixes

- Allow to click whole text of info message over map
- Typo

### 💼 Other

- Add bower and scss files
- Use scss instead of css
- Merge branch 'scss-in-project' into 'master'

Scss in project

Closes #346

See merge request albina-euregio/albina-website!154

## [2.2.1] - 2020-02-13

### 💼 Other

- GitLab CI: use npm ci

Ref: https://docs.npmjs.com/cli/ci

### 🚜 Refactor

- Generate separate sentry.js
- Generate separate polyfill.js

## [2.2.0] - 2020-02-12

### 🚀 Features

- Feat(stationMap)
- *(build)* Serve CSS/HTML/JS/SVG with brotli

### 🐛 Bug Fixes

- *(bulletinStore)* Typo
- *(build)* Webp in development mode
- Fix(tendency-icon)

### 💼 Other

- Merge branch 'stationMap' into 'master'

feat(stationMap)

See merge request albina-euregio/albina-website!142
- Merge branch 'update-package-lock' into 'master'

refact: update package-lock.json

See merge request albina-euregio/albina-website!144
- Merge branch 'leaflet-geonames' into 'master'

chore: update to leaflet-geonames 0.4.8

See merge request albina-euregio/albina-website!145
- Revert "Merge branch 'leaflet-geonames' into 'master'"

This reverts merge request !145
- Merge branch 'revert-845c1afa' into 'master'

Revert "Merge branch 'leaflet-geonames' into 'master'"

Closes #335

See merge request albina-euregio/albina-website!146
- Merge branch 'leaflet-geonames-0.4.9' into 'master'

chore: update to leaflet-geonames 0.4.9

See merge request albina-euregio/albina-website!147
- Delete .travis.yml

We use GitLab CI now
- Merge branch 'brotli' into 'master'

feat(build): serve CSS/HTML/JS/SVG with brotli

See merge request albina-euregio/albina-website!148
- Merge branch 'i18n' into 'master'

I18n: clarify dangerlevel strings

Closes #338 and #323

See merge request albina-euregio/albina-website!149
- Merge branch 'tendency-icon' into 'master'

fix(tendency-icon)

Closes #342

See merge request albina-euregio/albina-website!150
- Merge branch 'weather-map-title-date' into 'master'

chore(weather-map-title): consistent date format

Closes #333

See merge request albina-euregio/albina-website!151
- Merge branch 'weather-map-title-date-it' into 'master'

chore(weather-map-title): match mercoledì

See merge request albina-euregio/albina-website!153
- Merge branch 'station-map-blue' into 'master'

chore(stationMap): use blue markers

See merge request albina-euregio/albina-website!152
- "" for missing bulletin

### 🚜 Refactor

- *(bulletin-buttonbar)* Remove inactive code
- Update package-lock.json
- *(i18n)* Remove unused keys `bulletin:*`
- *(i18n)* Drop separate keys `bulletin:*:alt`

### ⚙️ Miscellaneous Tasks

- Change links to /weather/stations
- *(station-marker)* Add station name as title
- *(config)* Remove gaTrackingId
- Update to leaflet-geonames 0.4.8
- Update to leaflet-geonames 0.4.9
- *(i18n)* Clarify dangerlevel strings
- *(i18n)* I18n update
- *(weather-map-title)* Consistent date format
- *(weather-map-title)* Match mercoledì
- *(stationMap)* Use blue markers
- *(blogOverview)* Hide "No content found" while loading

## [2.1.3] - 2020-01-07

### 🚀 Features

- *(sm-share)* Add share via Telegram
- *(footer)* Display license of project

### 🐛 Bug Fixes

- *(footer-logos)* Add <img alt="...">
- *(index)* Absolute href for apple-touch-icons
- *(vanilla-tilt)* Custm Event polyfill for IE11
- *(content/education/danger-pattern)* Anchors
- *(leaflet-map)* MaxBounds for fractional zooms
- *(leaflet-map)* Cleanup moveend handler
- *(leaflet-map)* Cleanup internal moveend handler
- *(bulletin-map)* Cleanup click handler
- *(content/weather/measurements)* No /beta links

### 💼 Other

- Merge branch 'responsive-img-handbook' into 'master'

chore(content/education/handbook): responsive images

See merge request albina-euregio/albina-website!133
- Merge branch 'responsive-img-avp' into 'master'

chore(content/education/avp): responsive images

See merge request albina-euregio/albina-website!132
- Merge branch 'responsive-img-avalanche-sizes' into 'master'

chore(content/education/avalanche-sizes): responsive images

See merge request albina-euregio/albina-website!131
- Merge branch 'noopener' into 'master'

chore: add rel="noopener" to target="_blank" links

See merge request albina-euregio/albina-website!134
- Telegram icon in fontello font and necessary CSS
- Merge branch 'fontello-telegram' into share-telegram
- Merge branch 'share-telegram' into 'master'

feat(sm-share): add share via Telegram

See merge request albina-euregio/albina-website!73
- Merge branch 'footer-license' into 'master'

feat(footer): display license of project

See merge request albina-euregio/albina-website!135
- Merge branch 'custom-event-polyfill' into 'master'

fix(vanilla-tilt): Custm Event polyfill for IE11

Closes #329

See merge request albina-euregio/albina-website!136
- Merge branch 'anchor-dp' into 'master'

fix(content/education/danger-pattern): anchors

See merge request albina-euregio/albina-website!137
- Merge branch 'tune-leaflet' into 'master'

Improve usage of the leaflet library

See merge request albina-euregio/albina-website!138
- Merge branch 'obsolete-fixme' into 'master'

refact: remove obsolete FIXME comments

See merge request albina-euregio/albina-website!139
- Merge branch 'content-link-beta' into 'master'

fix(content/weather/measurements): no /beta links

See merge request albina-euregio/albina-website!141
- Merge branch 'imprint-tbbm' into 'master'

chore(content/imprint): add TBBM

See merge request albina-euregio/albina-website!140

### 🚜 Refactor

- Use preprocessContent from htmlParser
- *(leaflet-map)* Add @type
- *(leaflet-map)* Leaflet tracks resize by default
- Remove obsolete FIXME comments

### ⚙️ Miscellaneous Tasks

- *(content/education/handbook)* Responsive images
- *(content/education/avp)* Responsive images
- *(content/education/avalanche-sizes)* Responsive images
- Add rel="noopener" to target="_blank" links
- *(content/imprint)* Add TBBM

## [2.1.2] - 2020-01-02

### 🚀 Features

- *(build)* Build and deploy .htaccess
- *(leaflet-map)* Enable fractional zoom levels
- *(bulletin)* Select microregion via URL

### 🐛 Bug Fixes

- Typo
- *(weather-station-diagrams)* Unexpected token )
- *(build)* Remove console.log debugging
- *(leaflet-map)* Geosearch missing marker icon
- *(bulletin-map)* React-warning-keys
- *(build)* Use dist version react-intl

### 💼 Other

- Merge branch 'rm-getBasePath' into 'master'

refact(main): use APP_ASSET_PATH

See merge request albina-euregio/albina-website!119
- Merge branch 'fix-javascript-void' into 'master'

fix(weather-station-diagrams): Unexpected token )

Closes #325

See merge request albina-euregio/albina-website!120
- Merge branch 'htaccess' into 'master'

build and deploy .htaccess, specify caching headers

See merge request albina-euregio/albina-website!121
- I18n update
- Merge branch 'locate-control' into 'master'

chore(leaflet-map): i18n update for locate-control

See merge request albina-euregio/albina-website!122
- Merge branch 'rm-ConfigStore' into 'master'

refact: replace ConfigStore with vanilla JS object

See merge request albina-euregio/albina-website!118
- Merge branch 'fix-marker-icon' into 'master'

fix(leaflet-map): geosearch missing marker icon

See merge request albina-euregio/albina-website!123
- Merge branch 'map-fractional-zool' into 'master'

feat(leaflet-map): enable fractional zoom levels

See merge request albina-euregio/albina-website!124
- Merge branch 'html-lang' into 'master'

chore(main): set html language

See merge request albina-euregio/albina-website!125
- Update to babel 7.7.7
- Merge branch 'update-babel' into 'master'

Update to babel 7.7.7

See merge request albina-euregio/albina-website!126
- Update .eslintignore
- Merge branch 'update-eslintignore' into 'master'

Update .eslintignore

See merge request albina-euregio/albina-website!127
- Merge branch 'bulletin-microregion' into 'master'

feat(bulletin): select microregion via URL

Closes #148

See merge request albina-euregio/albina-website!128
- Merge branch 'bulletin-map-fix-keys' into 'master'

fix(bulletin-map): react-warning-keys

See merge request albina-euregio/albina-website!129
- Merge branch 'react-intl-dist' into 'master'

fix(build): use dist version react-intl

Closes #328

See merge request albina-euregio/albina-website!130

### 🚜 Refactor

- *(main)* Use APP_ASSET_PATH
- Replace ConfigStore with vanilla JS object
- *(leaflet-map)* Simplify config.map.geonames

### ⚙️ Miscellaneous Tasks

- Sync config-dev.json with config.json
- *(page-header)* Fix language change in devmode
- *(htaccess)* Specify caching headers
- *(leaflet-map)* I18n update for locate-control
- *(main)* Set html language
- *(build)* Limit asset size to 1.5 MiB

## [2.1.1] - 2019-12-23

### 💼 Other

- GitLab CI: deploy config.json to production

Fixes #324.
- GitLab CI: delete extraneous files from production

## [2.1.0] - 2019-12-22

### 🐛 Bug Fixes

- Fix version linking

in order to reflect changes for gitlab link
- Typo
- Typo
- Wrap warning level icons properly
- Page-header, optimize: weather pages flipper-controls, distinguish: map height 50vh for bulletin map but 65vh for weather map
- *(weather-station-diagrams)* Hide unmeasured params
- Fix wrapping
- Fix linting errors
- Fix linting
- Fix non clickable icons
- Fix wrapping warn level icons
- Linting error
- Fix cluster station selection

fixes #270
- Fix tooltip on warn level icon

fixes #297
- Fix tootip

fixes #250
- Show subs arrows on menu items
- Fade in of details
- Aligning of header-footer-logo-secondary
- Fix tilt again
- Flickering right border on hover of .bulletin-report-picto
- Linting error
- *(bulletin-map)* InfoBar missing for latest
- *(react-intl)* Remove dash from placeholders
- Fix pageloading screen
- Fix markup errors

fixes #239
- Fix scrolling bug

closes #309
- Fix workaround video problem

fixes #262
- Coding
- Hacky way to bypass false positive eslint

### 💼 Other

- Show blog date and time (not only date)
- Merge branch 'blog-post-time' into 'master'

blogPost: show blog date and time (not only date)

See merge request albina-euregio/albina-website!63
- Add <noscript> and link to /simple
- Merge branch 'noscript' into 'master'

index.html: add <noscript> and link to /simple

See merge request albina-euregio/albina-website!61
- Added favicons 886, main menu visibility 816, euregio logo 883, logo animation 887, image compression 888
- Merge branch 'master' into 20101004-RF-Task-Set

# Conflicts:
#	app/css/style.css
- Compressed CSS; add: styles for messengerpeople
- Working on bulletin header and map, reconsider/renew styles, slowly move app.scss to scss-stack
- Fintune Bulltein Buttonbar/Flipper, List, Map, move app.scss in stack to further defrag asap
- Optimized bulletin buttonbar, avalanche problem filter, version in page footer, relict in index.html
- Merge branch 'master' into 20101004-RF-Task-Set
- Link Dangerlevel Icons to dangerlevel page
- Merge branch '20101004-RF-Task-Set' into 'master'

20101004 rf task set

See merge request albina-euregio/albina-website!64
- Retain original bulletin sorting
- Merge branch 'no-sort-bulletin-list' into 'master'

bulletin-list: retain original bulletin sorting

See merge request albina-euregio/albina-website!62
- Split tranlations.json to de/en/it.json
- Add Transifex configuration
- Merge branch 'transifex' into 'master'

Use Transifex for translations

See merge request albina-euregio/albina-website!65
- Replace history for init /bulletin/latest redirect
- Install and configure eslint
- Apply eslint fixes

no-unused-vars
no-undef
- Enable eslint for jsx files
- Apply eslint fixes to jsx files
- GitLab CI: enable eslint
- Fix `className`
- Merge branch 'eslint' into 'master'

Install and configure eslint, apply fixes

See merge request albina-euregio/albina-website!66
- Use de-AT for "Jänner"
- Merge branch 'jänner' into 'master'

Intl.DateTimeFormat: use de-AT for "Jänner"

See merge request albina-euregio/albina-website!59
- Add script to fetch all content from CMS
- Add app/content/ from CMS
- Use content/
- Get title from top HTML comment
- Remote CMS call to footer_text
- Include menuLinks from CMS
- Remove id of menu items
- Migrate menuStore to separate JSON files
- Merge branch 'cms-rip' into 'master'

Replace cms.avalanche.report API with local content/menu

See merge request albina-euregio/albina-website!67
- Revert "Merge branch 'cms-rip' into 'master'"

This reverts commit fe431f36e167dbb99cddd3899d320e51c0546312, reversing
changes made to 1adacecaa65d467bcc7e97f92e8b0a4a57c1075f.
- Debugging and further relsoving of app.scss, also optimization of leaflet
- Footer logos, am/pm, fixes for task set, external links, version number
- Short date for bulletin navigation

Jira: 931
- Add data payload
- Enable direct triggering of modals
- Enable triggering of weather station diagram popoup
- Renew images periodically
- Show info when info is missing
- Add plot getter
- Trigger diagram feature form weathermap
- HTML and CSS for .modal-weatherstation
- Merge remote-tracking branch 'origin/wip-feat-weather-station-diagrams' into wip-feat-weather-station-diagrams
- Refine image selection
- Merge branch 'master' into wip-feat-weather-station-diagrams
- Introduce language variables
- Clean component
- Clean component
- Merge remote-tracking branch 'origin/wip-feat-weather-station-diagrams' into wip-feat-weather-station-diagrams
- Merge remote-tracking branch 'origin/wip-feat-weather-station-diagrams' into wip-feat-weather-station-diagrams
- Merge remote-tracking branch 'origin/wip-feat-weather-station-diagrams' into wip-feat-weather-station-diagrams
- Remove not needed params
- Decreased height of bulletin map to 50vh on desktop
- Styled am/pm and fixed positioning of controls, legend and detail panel on map
- Got rid of homless code
- Trigger station info directly, improve provided information
- Fix for linked avalanche-situation pictograms
- Merge branch 'clean-scss' into wip-feat-weather-station-diagrams
- Merge remote-tracking branch 'origin/feat-weather-station-diagrams'
- Set shareable
- Strip title
- Use asset path to fetch content
- Fix HTML, format HTML
- Merge branch 'fix-content' into 'master'

Fix bugs from cms.avalanche.report migration

See merge request albina-euregio/albina-website!70
- I18n update
- Merge branch 'weather-station-dialog' into 'master'

Some fixes/improvements to the weather station dialog

See merge request albina-euregio/albina-website!71
- Use de-AT for "Jänner"
- Merge branch 'jänner' into 'master'

Intl.DateTimeFormat: use de-AT for "Jänner"

See merge request albina-euregio/albina-website!72
- Remove datatables.net dependency
- Use FormattedNumber for rounding/i18n
- Share column configuration
- Re-enable column filtering
- Use FormattedNumber for rounding/i18n
- Merge branch 'no-datatables' into 'master'

stationTable: remove datatables.net dependency

See merge request albina-euregio/albina-website!46
- I18n update
- Use console.log debugging only in dev mode
- Support language-dependent URLs
- Merge branch 'menu-lang' into 'master'

menu: support language-dependent URLs

See merge request albina-euregio/albina-website!75
- Show station region
- Merge branch 'weather-station-region' into 'master'

weather-station-diagrams: show station region

See merge request albina-euregio/albina-website!74
- Remove .jshintignore
- GitLab CI: deploy to /beta and /dev
- Merge branch 'beta-dev' into 'master'

GitLab CI: deploy to /beta and /dev

Closes #264

See merge request albina-euregio/albina-website!77
- GitLab CI: deploy config.json to /beta and /dev
- Merge branch 'config-beta-dev' into 'master'

GitLab CI: deploy config.json to /beta and /dev

See merge request albina-euregio/albina-website!78
- Show development version warning
- Merge branch 'dev-warning' into 'master'

page: show development version warning

See merge request albina-euregio/albina-website!80
- Add sitemap.xml
- Merge branch 'sitemap' into 'master'

Add sitemap.xml

See merge request albina-euregio/albina-website!76
- Migrate CMS images to /content_files
- Merge branch 'content-files' into 'master'

Migrate CMS images to /content_files

Closes #263

See merge request albina-euregio/albina-website!85
- Remove empty class=""
- Merge branch 'content-empty-class' into 'master'

content: remove empty class=""

See merge request albina-euregio/albina-website!86
- Fix timing problem in bulletin loading
- Merge branch 'bulletin-load' into 'master'

bulletin: fix timing problem in bulletin loading

See merge request albina-euregio/albina-website!87
- Move tilty to components
- Remove pl metas
- Move costum.js functionality
- Add splash screen
- Merge branch 'master' into loading-info
- Merge branch 'loading-info' into clean-custom-js
- Merge branch 'clean-custom-js' into 'master'

Clean custom js

See merge request albina-euregio/albina-website!83
- Hide filter
- Raise nr of blog items
- Merge branch 'blog-hide-tag-filter' into 'master'

Blog hide tag filter

Closes #258

See merge request albina-euregio/albina-website!84
- Add tooltip class
- Merge branch 'warn-level-icon-tooltip' into 'master'

warn-level-icon: add tooltip class

Closes #300

See merge request albina-euregio/albina-website!89
- Update package-lock.json
- Simplify attribution text
- Merge branch 'leaflet-map-attribution' into 'master'

leaflet-map: simplify attribution text

See merge request albina-euregio/albina-website!90
- Drop version param for EUREGIO-TMS
- Merge branch 'leaflet-map-no-hash' into 'master'

leaflet-map: drop version param for EUREGIO-TMS

See merge request albina-euregio/albina-website!92
- Revert "Merge branch 'warn-level-icon-tooltip' into 'master'"

This reverts merge request !89
- Merge branch 'revert-fef314e1' into 'master'

Revert "Merge branch 'warn-level-icon-tooltip' into 'master'"

See merge request albina-euregio/albina-website!93
- Fix typo "Webagemtur"
- Merge branch 'typo-Webagemtur' into 'master'

imprint: fix typo "Webagemtur"

See merge request albina-euregio/albina-website!94
- Merge branch 'delete-bulletin-map-static' into 'master'

style.css: delete bulletin-map-static

See merge request albina-euregio/albina-website!81
- Delete style_old.css
- Merge branch 'delete-style-old' into 'master'

Delete style_old.css

See merge request albina-euregio/albina-website!79
- Delete app/images/dev/
- Merge branch 'delete-images-dev' into 'master'

Delete app/images/dev/

See merge request albina-euregio/albina-website!82
- Images/dev
- Eaws logo, del: old style
- Controlbar-notice for dev version warning
- Make elements sticky onscroll, plus: little debugs
- Sticky linkbar
- Add caption via intl
- Sticky section-bulletin-linkbar
- Merge branch 'clean-custom-js' into clean-scss-2
- Add stickiness
- Debug header appearance
- Add tertiary logo
- Sticky linkbar
- Page-flipper aka bulletin-flipper in blog
- Blog-flipper
- Flippers
- Flipper for modal weather station, time range selector as filter list instead of dropdown
- Merge branch 'clean-scss-2' into weatherstation-diagrams-improvements
- Replace dropdown with button list

part of 270
- Merge branch 'master' into weatherstation-diagrams-improvements
- Merge branch 'master' into weatherstation-diagrams-improvements
- Merge branch 'weatherstation-diagrams-improvements' into 'master'

Weatherstation diagrams improvements

See merge request albina-euregio/albina-website!91
- Update README.md
- Update to leaflet 1.6.0
- Merge branch 'leaflet-1.6.0' into 'master'

Update to leaflet 1.6.0

See merge request albina-euregio/albina-website!95
- Use console.log debugging only in dev mode
- Fix id
- Remove useless marker overlay
- Merge branch 'grid-overlay' into 'master'

Fix grid overlay

Closes #259

See merge request albina-euregio/albina-website!96
- Fix react-warning-keys
- Merge branch 'weather-station-disagrams-fix-key' into 'master'

weather-station-diagrams: fix react-warning-keys

See merge request albina-euregio/albina-website!97
- Remove obsolete TODO
- Hide flipper
- Merge branch 'weatherstation-diagrams-hide-flipper' into 'master'

hide flipper

See merge request albina-euregio/albina-website!98
- Fix HTML
- Remove img.title
- Merge branch 'danger-patterns' into 'master'

content/danger-patterns: fix HTML

See merge request albina-euregio/albina-website!99
- Remove title="The Link"
- Remove title="The Button"
- Merge branch 'content-title' into 'master'

content: remove title="The …"

See merge request albina-euregio/albina-website!100
- Remove unused app/bower_components/jquery-3.3.1
- Merge branch 'jquery-3.3.1' into 'master'

Remove unused app/bower_components/jquery-3.3.1

See merge request albina-euregio/albina-website!104
- Remove unused app/bower_components/normalize-scss_7.0.1
- Merge branch 'normalize-scss_7.0.1' into 'master'

Remove unused app/bower_components/normalize-scss_7.0.1

See merge request albina-euregio/albina-website!105
- Remove unused app/bower_components/pure-scss_1.0.0
- Merge branch 'pure-scss_1.0.0' into 'master'

Remove unused app/bower_components/pure-scss_1.0.0

See merge request albina-euregio/albina-website!106
- Remove unused app/bower_components/sweet-scroll-master_3.0.0
- Merge branch 'sweet-scroll-master_3.0.0' into 'master'

Remove unused app/bower_components/sweet-scroll-master_3.0.0

See merge request albina-euregio/albina-website!107
- Obtain tippy.js from npm
- Fix target="_blank"
- Merge branch 'content-fix-target' into 'master'

content/archive: fix target="_blank"

See merge request albina-euregio/albina-website!112
- Link indicator on station measurement table rows, minor text edits
- Use vanilla tilty satisfyingly

closes #296
- Use vanilla tilty satisfyingly

closes #269
- Merge remote-tracking branch 'origin/clean-scss-2' into clean-scss-2
- Layout correction: indent on page dangerscale
- Merge remote-tracking branch 'origin/clean-scss-2' into clean-scss-2
- Refine tilting
- Refine tilting
- Merge remote-tracking branch 'origin/clean-scss-2' into clean-scss-2
- Merge branch 'master' into clean-scss-2
- Merge branch 'master' into clean-scss-2
- Welcome to the smallest possible css change
- Welcome to the smallest possible css change
- Merge branch 'clean-scss-2' of gitlab.com:albina-euregio/albina-website into clean-scss-2
- Welcome again
- Merge remote-tracking branch 'origin/clean-scss-2' into clean-scss-2
- Merge branch 'clean-scss-2' into 'master'

Clean scss 2

Closes #297, #250, #251, #231, #269, and #296

See merge request albina-euregio/albina-website!102
- Add links to region and language
- Merge branch 'blog-post-links' into 'master'

blogPost: add links to region and language

Closes #107

See merge request albina-euregio/albina-website!103
- Replace history when cycling through regions
- Merge branch 'bulletin-replace-history' into 'master'

bulletin: replace history when cycling through regions

See merge request albina-euregio/albina-website!111
- Add poor man's archive for Tyrol
- Merge branch 'poormans-archive-tyrol' into 'master'

archive: add poor man's archive for Tyrol

See merge request albina-euregio/albina-website!113
- Merge branch 'master' into tippy.js
- Merge branch 'clean-custom-js' into bulletin-blog-loading-info
- Introduce loading information
- Move logic to info bar
- Merge branch 'master' into bulletin-blog-loading-info
- Loadinginfo for bulletin and blog
- Cleaning
- Add proper simple link
- Cleaning
- Merge branch 'master' into bulletin-blog-loading-info
- Raise timeout
- Merge branch 'master' into bulletin-blog-loading-info
- Merge branch 'bulletin-blog-loading-info' into 'master'

Bulletin blog loading info

See merge request albina-euregio/albina-website!101
- Obtain magnific-popup from npm
- Merge branch 'magnific-popup' into 'master'

Obtain magnific-popup from npm

See merge request albina-euregio/albina-website!108
- Obtain jquery-selectric from npm
- Merge branch 'selectric' into 'master'

Obtain jquery-selectric from npm

See merge request albina-euregio/albina-website!109
- Merge branch 'master' into tippy.js
- Merge branch 'tippy.js' into 'master'

Obtain tippy.js from npm

See merge request albina-euregio/albina-website!110
- Merge branch 'master' into weather-diagrams-fix-clustering
- Merge branch 'weather-diagrams-fix-clustering' into 'master'

Weather diagrams fix clustering

Closes #270

See merge request albina-euregio/albina-website!114
- I18n update
- I18n update
- Merge branch 'intl' into 'master'

Fix and simplify i18n

Closes #315

See merge request albina-euregio/albina-website!115
- Use console.log debugging only in dev mode
- Remove unused app/bower_components/tilt_1.1.19/
- Merge branch 'tilt_1.1.19' into 'master'

Remove unused app/bower_components/tilt_1.1.19/

See merge request albina-euregio/albina-website!116
- Remove not needed divs
- Hack vidoes to be dispayed
- Merge branch 'master' into fix-video-pages
- Ignore
- Merge branch 'fix-video-pages' of gitlab.com:albina-euregio/albina-website into fix-video-pages
- Merge branch 'fix-video-pages' of gitlab.com:albina-euregio/albina-website into fix-video-pages
- Updated css from archive-add-loading-info
- Merge remote-tracking branch 'origin/fix-video-pages' into fix-video-pages
- Content cut-off by removing animation from section (cause: bad nesting of content)
- Merge branch 'fix-video-pages'
- Remove not needed class removal

fixes #262
- Merge branch 'fix-video-pages'

### 🚜 Refactor

- *(intlHelper)* Use react-intl rich text formatting
- *(bulletin-map)* Simple URL from config

### 📚 Documentation

- *(README)* Extend Transifex documentation

### 🎨 Styling

- Weather map feture-box CSS and HTML
- Weather station modal diagram
- Delete bulletin-map-static

### ⚙️ Miscellaneous Tasks

- *(weather-station-diagrams)* Display units to measured values
- *(weather-station-diagram)* Unit for elevation
- *(blogOverview)* Link to all standalone blogs
- *(weather-station-diagrams)* Reword operator string

## [2.0.3] - 2019-11-19

### 🐛 Bug Fixes

- *(blogPost)* Include parameters in HTTP query

### 💼 Other

- Try to fix "Cannot read property 'topleft' of undefined"
- Try to fix "Cannot read property 'lat' of undefined"
- Use ES6 version
- Fix localStorage detection
- Specify environment
- Fallback to English
- Merge branch 'fix-blog-post' into 'master'

fix(blogPost): include parameters in HTTP query

See merge request albina-euregio/albina-website!60

## [2.0.2] - 2019-11-18

### 💼 Other

- Fix HTML
- Improve error logging
- Improve info logging for language change
- Add Date.now for loading config.json, drop local cache purging

window.cache.delete often causes "SecurityError: The operation is insecure"
- Merge branch 'config-cache' into 'master'

Add Date.now for loading config.json, drop local cache purging

See merge request albina-euregio/albina-website!54
- Update config.json to production config
- Compress favicon.ico files
- Embed favicon.ico in index.html
- Copy favicon.ico to /
- Merge branch 'compress-favicon' into 'master'

Compress favicon

See merge request albina-euregio/albina-website!56
- Delete unused default react favicon.ico
- Use axios for HTTP GET requests
- Use axios for HTTP POST requests
- Merge branch 'axios' into 'master'

Use axios for HTTP requests

See merge request albina-euregio/albina-website!55
- Use icons in webp format if browser supports
- Programmatically switch to webp if supported
- Use webp for logo_euregio if supported
- Merge branch 'webp' into 'master'

Use icons in webp format if browser supports

See merge request albina-euregio/albina-website!57
- Delete extraneous files on webserver
- Fix loading correct overlay.png and regions.json

Specify bulletin's publication date in query parameter to avoid possible caching problems.
- Merge branch 'files-publication-date' into 'master'

Fix loading correct overlay.png and regions.json

See merge request albina-euregio/albina-website!58
- Do not delete existing .htaccess
- Write file hash to filename

## [2.0.1] - 2019-11-15

### 💼 Other

- Disable Sentry for development
- Improve error logging
- Use hostLanguageSettings to detect language
- Merge branch 'hostLanguageSettings' into 'master'

app: use hostLanguageSettings to detect language

See merge request albina-euregio/albina-website!51
- Add date to query string for config.json request

Forces reload at least once a day to avoid stale config.
- Merge branch 'config-cache' into 'master'

Add date to query string for config.json request

See merge request albina-euregio/albina-website!52
- Specify release
- Merge branch 'sentry-release' into 'master'

Sentry: specify release

See merge request albina-euregio/albina-website!53

## [2.0.0] - 2019-11-14

### 🐛 Bug Fixes

- *(selectric)* Get rid of checkPropTypes warning
- *(DownloadPdfDialog)* Typo in component name
- Set new widget urls
- Fix und foxi: following se rulz yo
- Remove not needed wrapping

### 💼 Other

- Close bulletin map details on mouseclicks outside of defined regions.
- Use `filter:grayscale` instead of separate icons
- Merge branch 'css-grayscale' into 'master'

Use `filter:grayscale` instead of separate icons

See merge request albina-euregio/albina-website!17
- Shrink logo_euregio to 128px height

233068 -> 22735 bytes.
- Remove footer/ORIZZONTALE.png

Relates to 28964e3d8020fa2e2cde01e6622346a204b2817b.
- Merge branch 'logos' into 'master'

Shrink logo_euregio, remove footer/ORIZZONTALE.png

See merge request albina-euregio/albina-website!18
- Use MiniCssExtractPlugin also for scss
- Merge branch 'extract-scss' into 'master'

build: use MiniCssExtractPlugin also for scss

See merge request albina-euregio/albina-website!19
- Cleanup package.json

- Remove unused dependencies
- Differentiate between dependencies and devDependencies
- Merge branch 'cleanup-package.json' into 'master'

Cleanup package.json

See merge request albina-euregio/albina-website!20
- Replace stringinject with leaflet's Util.template

Saves one dependency.
- Merge branch 'no-stringinject' into 'master'

Replace stringinject with leaflet's Util.template

See merge request albina-euregio/albina-website!21
- Use webp format if browser supports
- Merge branch 'tms-webp' into 'master'

EUREGIO-TMS: use webp format if browser supports

See merge request albina-euregio/albina-website!22
- Remove warning for outdated browsers

ALBINA-876
- Merge branch 'drop-unsupported-browser-dialog' into 'master'

Remove warning for outdated browsers

See merge request albina-euregio/albina-website!25
- Replace `@turf/centroid` with `Polygon.getCenter`

Ref: https://leafletjs.com/reference-1.5.0.html#polygon-getcenter
- Replace `@turf/flip` with `GeoJSON.coordsToLatLngs`

Ref: https://leafletjs.com/reference-1.5.0.html#geojson-coordstolatlngs
- Avoid unnecessary object cloning
- Merge branch 'no-turf' into 'master'

Replace turf by leaflet functions

See merge request albina-euregio/albina-website!27
- Fix icon
- Merge branch 'icon-geolocate' into 'master'

leaflet-locatecontrol: fix icon

See merge request albina-euregio/albina-website!28
- Move settings initialisation
- Add tooltips to logos
- Merge branch 'fix-tootips' into 'master'

Fix tootips

See merge request albina-euregio/albina-website!30
- Add icon for external links
- Merge branch 'nav-external' into 'master'

navigation: add icon for external links

See merge request albina-euregio/albina-website!29
- Format code using Prettier, add pre-commit hook

Prettier provides a consistent code style throughout the project.
- Merge branch 'prettier'
- BulletinList component added.
- Fix static maps.
- Make report list an observer.
- Scroll to active bulletin.
- Add basic syling.
- Sort by danger level in descending order.
- BulletinList component added.
- Make report list an observer.
- Scroll to active bulletin.
- BulletinList component added.
- Fix static maps.
- Make report list an observer.
- Scroll to active bulletin.
- Add basic syling.
- Sort by danger level in descending order.
- Merge branch 'bulletin-list' of gitlab.com:albina-euregio/albina-website into bulletin-list
- Merge remote-tracking branch 'origin/bulletin-list'
- Parallel view.
- Show correct bulletion map overlays and details.
- Make parallel bulletin view responsive.
- Remove bulletinStore.settings.ampm and dependent code fragements
- Fix bulletin map when no daytime dependency
- Add am/pm label to parallel bulletin maps
- Use Leaflet.Sync plugin instead of mobx observers to sync am and pm map.
- Code cleanup.
- Localise "am" and "pm" in parallel bulletin map view.
- Parallel view.
- Fix bulletin map when no daytime dependency
- Add am/pm label to parallel bulletin maps
- Use Leaflet.Sync plugin instead of mobx observers to sync am and pm map.
- Use Leaflet.Sync plugin instead of mobx observers to sync am and pm map.
- Fixing runtime errors due to updates in master branch.
- Parallel view.
- Show correct bulletion map overlays and details.
- Make parallel bulletin view responsive.
- Remove bulletinStore.settings.ampm and dependent code fragements
- Fix bulletin map when no daytime dependency
- Add am/pm label to parallel bulletin maps
- Use Leaflet.Sync plugin instead of mobx observers to sync am and pm map.
- Code cleanup.
- Localise "am" and "pm" in parallel bulletin map view.
- Parallel view.
- Show correct bulletion map overlays and details.
- Make parallel bulletin view responsive.
- Remove bulletinStore.settings.ampm and dependent code fragements
- Fix bulletin map when no daytime dependency
- Add am/pm label to parallel bulletin maps
- Use Leaflet.Sync plugin instead of mobx observers to sync am and pm map.
- Code cleanup.
- Localise "am" and "pm" in parallel bulletin map view.
- Parallel view.
- Show correct bulletion map overlays and details.
- Make parallel bulletin view responsive.
- Remove bulletinStore.settings.ampm and dependent code fragements
- Fix bulletin map when no daytime dependency
- Add am/pm label to parallel bulletin maps
- Use Leaflet.Sync plugin instead of mobx observers to sync am and pm map.
- Code cleanup.
- Localise "am" and "pm" in parallel bulletin map view.
- Merge branch 'am-pm-parallel' of gitlab.com:albina-euregio/albina-website into am-pm-parallel
- Merge branch 'am-pm-parallel' of gitlab.com:albina-euregio/albina-website into am-pm-parallel
- Merge branch 'am-pm-parallel' of gitlab.com:albina-euregio/albina-website into am-pm-parallel
- Remove unused code.
- Temporarily change Node version to 12 to prevent from build errors with Node 13
- Merge branch 'am-pm-parallel' into 'master'

Am/pm parallel bulletin view

See merge request albina-euregio/albina-website!23
- GitLab CI: use Node.js LTS
- Merge branch 'ci-lts' into 'master'

GitLab CI: use Node.js LTS

See merge request albina-euregio/albina-website!31
- Use dynamic imports to reduce main bundle size

Make use of dynamic imports, webpack code splitting and @loadable/component.
- Merge branch 'loadable-component' into 'master'

Use dynamic imports to reduce main bundle size

See merge request albina-euregio/albina-website!32
- Split version and versionDate
- Merge branch 'config-split-version' into 'master'

config: split version and versionDate

See merge request albina-euregio/albina-website!34
- Merge branch 'fix-selectric-warning' into 'master'

fix(selectric): get rid of checkPropTypes warning

See merge request albina-euregio/albina-website!36
- Merge branch 'fix-download-typo' into 'master'

fix(DownloadPdfDialog): typo in component name

See merge request albina-euregio/albina-website!37
- Use console.log debugging only in dev mode
- Merge branch 'no-console-log' into 'master'

Use console.log debugging only in dev mode

See merge request albina-euregio/albina-website!35
- GitLab CI: manually deploy to production
- Merge branch 'ci' into 'master'

GitLab CI: manually deploy to production

See merge request albina-euregio/albina-website!38
- Fix typo
- Merge branch 'WeatherMapStore-typo' into 'master'

weatherMapStore: fix typo

See merge request albina-euregio/albina-website!39
- Fix typo "shouldColumnGroupsUpdate"
- Merge branch 'stationTable-typo' into 'master'

stationTable: fix typo "shouldColumnGroupsUpdate"

See merge request albina-euregio/albina-website!41
- Ignore vscode ide settings
ignore vscode settings

ignore vscode ide settings
- Ignore vscode ide settings
ignore vscode settings
- Ignore vscode ide settings
- Ignore vscode settings
- Merge remote-tracking branch 'origin/master'
- Merge remote-tracking branch 'origin/master'
- Work with GeoJSON station data
- Merge branch 'stationDataStore-geojson' into 'master'

stationDataStore: work with GeoJSON station data

See merge request albina-euregio/albina-website!42
- Enable devtool
- Merge branch 'devtool' into 'master'

build: enable devtool

See merge request albina-euregio/albina-website!43
- Add information how to get beta data
- Merge branch 'messengerPeople-update' into 'master'

Messenger people update

See merge request albina-euregio/albina-website!44
- Unset height, use page scolling
- Merge branch 'stationTable-height' into 'master'

stationTable: unset height, use page scolling

See merge request albina-euregio/albina-website!40
- Merge branch 'bulletinContentWrapping' into 'master'

fix: remove not needed wrapping

See merge request albina-euregio/albina-website!45
- Display operator
- Merge branch 'station-operator' into 'master'

stationTable/stationOverlay: display operator

See merge request albina-euregio/albina-website!47
- Remove console.log debugging
- Revert "Use favicons-webpack-plugin"

This reverts commit 1f394c60f781cb1f960cc5031373aa5a1711b9a4.
- Merge branch 'no-favicons-webpack-plugin' into 'master'

Revert "Use favicons-webpack-plugin"

See merge request albina-euregio/albina-website!49
- Link version to GitLab
- Merge branch 'link-version-gitlab' into 'master'

page-footer: link version to GitLab

See merge request albina-euregio/albina-website!48
- Mark as private
- Enable Sentry error tracking
- Merge branch 'sentry' into 'master'

Enable Sentry error tracking

See merge request albina-euregio/albina-website!50

## [1.0.38] - 2019-09-23

### 💼 Other

- GitLab CI: deploy to development
- Merge branch 'ci' into 'master'

GitLab CI: deploy to development

See merge request albina-euregio/albina-website!6
- Remove unused font-awesome
- Merge branch 'no-font-awesome' into 'master'

Remove unused font-awesome

See merge request albina-euregio/albina-website!10
- Fix/update version identifier in footer

Automatically obtain from latest git commit.
- Merge branch 'fix-version' into 'master'

Fix/update version identifier in footer

See merge request albina-euregio/albina-website!9
- Run `optipng -o7` on all PNG files
- Merge branch 'optipng' into 'master'

Run `optipng -o7` on all PNG files

See merge request albina-euregio/albina-website!8
- GitLab CI: build-beta for deploy-beta
- Merge branch 'ci' into 'master'

GitLab CI: build-beta for deploy-beta

See merge request albina-euregio/albina-website!7
- Obtain leaflet-geonames from npm
- Move leaflet.css import to leaflet-map
- Merge branch 'npm-leaflet' into 'master'

Obtain leaflet-geonames from npm

See merge request albina-euregio/albina-website!12
- Use favicons-webpack-plugin

This allows to get rid of many favicon, apple-touch-icon files
in the repository.
- Merge branch 'favicons-webpack-plugin' into 'master'

Use favicons-webpack-plugin

See merge request albina-euregio/albina-website!11
-  Obtain fluidvids from npm
- Merge branch 'npm-fluidvids'
- Remove unused Base.now()
- Merge branch 'no-base-now' into 'master'

Remove unused Base.now()

See merge request albina-euregio/albina-website!15
- Update tileLayers url
- Allow caching of /api/bulletins

Appending the current time as hash breaks caching.

ALBINA-845
- Merge branch 'caching-bulletin' into 'master'

Allow caching of /api/bulletins

See merge request albina-euregio/albina-website!14
- Enable caching for CMS and Blogs using nginx

ALBINA-846
- Merge branch 'caching' into 'master'

Enable caching for CMS and Blogs using nginx

See merge request albina-euregio/albina-website!16
- Delete euregio logo from footer (already in header).
- Update Land Tirol logo.
- Move latest check to bulletin store.
- Fix loading with dynamic latest date.
- Latest API working.
- Fix parsing of ISO Timestamp in latest API.
- Remove debugging output
- Reset config to work with live API.
- Fix browser back button navigation to bulletin/latest.
- Npm audit fix

## [1.0.37] - 2019-08-05

### 💼 Other

- Include page title in HTML header.
- Refactored noBulletin message.
- Add share parameters.
- Upgraded to React 16
- Fix month filter.
- Add license file.
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Replaced interreg logo for euregio logo.
- Update name, description, homepage
- Merge branch 'package-name' into 'master'

package.json: update name, description, homepage

See merge request albina-euregio/albina-website!4
- Shrink footer logos to 64px height

Before: 4 requests / 1.40 MB
After:  4 requests / 30 KB
- Merge branch 'logos' into 'master'

Shrink footer logos to 64px height

See merge request albina-euregio/albina-website!3
- Remove yarn.lock in favour of package-lock.json

It does not make sense to have both.
- Merge branch 'no-yarn' into 'master'

Remove yarn.lock in favour of package-lock.json

See merge request albina-euregio/albina-website!1
- Enable GitLab CI
- GitLab CI: use npm
- GitLab CI: cache node_modules/
- Merge branch 'ci' into 'master'

Enable GitLab CI

See merge request albina-euregio/albina-website!2
- Reflect license from LICENSE
- Merge branch 'package.json-license' into 'master'

package.json: reflect license from LICENSE

See merge request albina-euregio/albina-website!5
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website

## [1.0.36] - 2019-06-17

### 💼 Other

- WeatherMapStore extended.
- Static map renders.
- Static map renders.
- Overlay visible.
- Zamg logo placeholder.
- Added legend control.
- Station API changes.
- Improved legend and zamg control.
- Align controls horizontally.
- Refactoring.
Overlays scaled beyond bounds.
- Added grid overlay.
- Fixed styles of zamg logo.
- Grid showing up.
- Grid select feature working.
- Deselect markers by clicking on map.
- Added feature info box.
- Add feature-date div to infobox.
- Refactor Station marker into separate component.
- StationOverlay added.
- Add marker cluster plugin.
- WeatherMapStore extended.
- Static map renders.
- Static map renders.
- Overlay visible.
- Merge branch 'meteoviewer' of https://gitlab.com/albina-euregio/albina-website into meteoviewer

Conflicts:
	app/components/leaflet-map2.jsx
	app/config.json
	app/stores/weatherMapStore.js
	app/views/weather.jsx
- Removed react-leaflet-markercluster dependencies.
- Cluster icons changed.
- Fix position of markers.
- Station animation working.
- Use new leaflet map compoent for bulletin.
- Removed legacy code for bulletin map.
- Refactoring.
- Pass reference to leaflet map to parent component.
- Added react-router-scroll library.
- Arrows added to station markers.
- Added missing map options.
- Remove outdated markers
- Fix observer.
- Fix url param "false" when CMS content arrives before domains.
- Fix styles.
- Fix incorrect handling of child markers when switching domains.
- Move event listener to map component.
- Add arrows to grid.
- Add elevation and country to station info.
- Reuse icons of markers for clusters.
- Use L.divIcon instead of react-leaflet-div-icon to fix propagation of mouse events.
- Fix closing of clusters.
- Refactoring.
- Autoselect active marker on cluster spiderfy.
- Use customised version of placementstrategies plugin.
- Output console error if weather data is not available.
- Active Markers positioned at cluster circle.
- Add cluster-selected-marker.
- Grid point highlighting fixed.
- Removed unused code.
- Add zoom observation to weather map.
- Force redraw of grid layer when domain changes.
- Move meteoviewer config from "links" to "apis" section.

### 🚜 Refactor

- Refactoring
- Refactoring map store

## [1.0.35] - 2019-05-22

### 💼 Other

- Remove albina-web from URL.
- Moved blogcache into separate repository.
- Removed blogcache script commands.
- Enable language specific domains.
- Change hostname when switching language.

## [1.0.34] - 2019-04-01

### 💼 Other

- Working table (without styling).
- Added filter bar.
- Added table header translations.
- Filter bar components added.
- Station table headers added.
- Tooltip texts added
- Default ordering.
- Styles integrated.
- Fix headers.
- Connect select filters to store.
- Select filters working.
- Region filter connected to store.
- Region filter change working.
- Prepare region filtering in table.
- Region filter working when applied once.
- Region filter finished.
- Text search filter working.
- Sort working.
- Sort toggle tooltip.
- Update translations.
- Remove datatables default message on empty table.
- Improve usability on mobile devices.
- Disable hover styles on hide-filters after click.
- Don't break table cells with wind direction.
- Merge branch 'ogd-table'
- Add online-survey button.
- Highlight survey button.

## [1.0.33] - 2019-04-01

### 💼 Other

- Fix bulletin status request on winter->summertime switch.
- Updated readme and build scripts.
- Feedback dialog showing up.
- Introduce second button for feedback dialog.
- Add approved translations and links.
- Merge branch 'feedback-dialog'
- Fix typo.
- Updated italian translation.

## [1.0.32] - 2019-03-18

### 💼 Other

- Handle timezones with negative offset correctly.
- Fix mobile menu for screen width 1023px.

## [1.0.31] - 2019-03-11

### 💼 Other

- Fix wrong escaping of ellipsis in text.
- Reset e-mail-subscribe-dialog after closing the modal window.
- Fix incorrect handling of getSuccDate and publicationDate, causing some missing values in the archive.
- Use current year as maximum year for blog filter - replace hardcoded maximum year.

## [1.0.30] - 2019-03-04

### 💼 Other

- Enable HTML tags in bulletin report.
- Merging HTML support for bulletin report
Merge branch 'report-html'
- Do not make additional history entry when adding the lang param. Fixes broken back-button.
- Remove unnecessary 'bulletin' path elments from url.
- Allow to switch back to "latest" bulletin using the browser back button.
- Remove unnecessary logging.

## [1.0.29] - 2019-02-13

### 🐛 Bug Fixes

- Fixing blog search parameter

### 💼 Other

- Add padding to static pages.
- Yellow highlighting placement bug
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Bulletin mouseover region
- Leaflet.GestureHandling implemented
- Css kleinen blauen Strich an der Oberkannte der Logos
- Albina_domains.json
- UseWindowWidth set to true
- Wrong path solved by adding a new "/"
- Scss
- Section.section-centered padding for small screens
- Leaflet sleep removed
- Leaflet geonames translations
- Path to meteo_viewer
- Meteoviewer paths
- New bulletin url
- Zulu time
- Previous day for requests
- Id of selected region in search
- Using hash to store region id
- Rendering regions on initialisation
- Info box works again
- Html parsing
- Map zoom buttons without margin
- Flipper arrows alignment
- Parsing links
- Links parsing pt2
- Italian typo
- Translating page on three times
- Avalanche problems link
- New leaflet control geonames plugin
- Italian translation
- Anchor points work
- Version changed
- Region id set as search parameter
- Map attribution
- Cleaning
- Development mode for the date flipper
- Styling leaflet buttons
- Leaflet geonames translation
- Attribution
- Default language
- Handling search parameters
- Setting region through Base
- 2030
- 00 to 23:00
- Leaflet buttons styling
- Additional authors were removed
- Default date changed to 16/2
- Default date changed to 16/2
- Pdf url dependent on language
- Language filter in archive hidden
- Problem elevation picture
- Intereg link language
- Translations for treeline problem
- Links to bulletin reports
- Archive prepared for 2030 presentation
- Zoom control moved
- Sections padding
- Padding for headings was removed
- Zamg removed from the attributions
- Content heading styling
- Xml language dependent link and config update
- Language change does not push history
- Leaflet locate plugin
- Config updated + locateOptions
- Font awesome
- Leaflet locate implementation
- Bulletin author was hidden
- 2030 -> 2018
- 23 -> 22
- Sweet scroll removed
- Hiding vertical line if bulletin is empty
- Blog language filter
- Bug resolved -  "more info" link dissapeared when language was changed
- Summertime/wintertime changes
- Blog subscribe button inverted
- Facebook pages added to config
- "draft version" text removed
- Blog removed from subscriptions
- Subscription email
- Header refactor
- Disabling map on loading
- Disabled map styling
- Gesture handling fix
- Path to ogd table
- Follow dialog initialisation
- New blogs
- Follow us - only used social medias
- Bulletin dialog to email dialog
- Social media region filter
- Reseting region in case of filter is applied
- Propagating the region deselect
- Hiding subscribe buttons
- Ampm
- Tyrol to tirol
- Pdf is hidden when no data to show
- Subnavigation margin
- Missing bulletin header bar
- Disabled map
- Linking blog in bar
- Removing console.logs
- Google analytics update
- Linking fix
- Bulletin banner
- Banner blog link
- Menu styling fix
- Basic blog caching middleware
- Blog middleware stats endpoint
- Deploying blog server
- Cleaning
- No bulletin info german translation fix
- Styling of external links
- Iframe react package
- Messenger people iframe urls
- Opengraph default values
- Subscribe buttons unhidden
- Blog middleware update
- Cookie german fix
- Social media subscription
- New blogger middleware url
- Selectric allowed for mobile phones
- Hiding subscribe button
- Setting actual date to the blog filter
- Cleaning blog url creation proccess
- Blog pagination
- Styling blogposts
- Blogs updated
- Blog displaying running time
- Max stored and cleaning intervals
- Search change method refactor
- Blog search, still not working!!
- Blog no contennt
- Handling next / previous page
- Validating page number
- Search blog fix
- Perpage for mobile devices
- Validating post page
- Validating blog month
- Validating year
- Validating regions and languages in blog url
- Blog url parameters validation
- Blog url problem checking bug
- Blogs posts do not show images when there are none
- Footer images
- Footer images
- All regions from email subscription removed
- Footer logos in config
- Styling footer icons
- Utf meta tag
- Google analytics removed
- Checkbox agreement translations
- Setting document lang meta
- Aggreement checkbox translations
- Subscribe email fixing
- Linking to disclaimer
- Footer logos path
- Email subscription texts
- No region selected option
- Aggreement new tab
- Blog store default values
- Change date to tomorrow after 5pm and add one hour for bulletin
- Author removed from the blog
- Bulletin reports bugs
- Incredible small footer logos
- Blog mobile styling
- Blog mobile styling update
- Blog posts styling all sizes
- Blog post section padding
- Validating email
- Tyrol
- Google analytics react plugin removed
- Blog post titles
- Blogposts padding
- No bulletin banner
- Image interpolation for IE
- Cleaning
- Delete "Danger level" in tooltip if there is no snow
- Station table iframe margin
- Bulletin status line classes
- Zamg logo
- External link icons
- Zamg logo
- Leafelt scale bar
- Actual date bulletin button
- External links icons
- Date.parse fix
- Subscribe widget language fix
- Css paths fixes
- Getting rid of external link arrows
- Caption text unified
- Map controls order
- Unified blog styling
- Leaflet controls fix
- DocumentMeta initialised
- Time isSameDay and isAfter methods
- Bulletin date flipper next date 5pm fix
- Weather map default domain fix
- Bulletin flipper no future date line residuum
- Bulletin map - turning over off on mobile screens
- Over is completely disabled for mobile screens
- Bulletin vector layer refactor
- Bulletin map extents
- IsTomorrow hours and minutes
- Getting rid of the zamg logo
- Weather  map title
- Bulletin map - panning to selected region if the user has mobile phone
- Resubmitted bulletin
- Do not scroll to top when the location consists of bulletin
- Do not show tendency if there is no text
- Wrong or misleading visualisation of elevation bands within avalanche problems pictogram list
- Bulletin map refactor
- Latest parameter for bulletin
- Padding of bulletin report headers
- Bounds for geonames
- Leaflet locate outside of the bounds message
- Version change
- Wrong region selected (region mouseover problem)
- Adaptative max bounds
- Hiding filters in the archive
- Download pdf dialog
- Page anchors
- Linking region problem level
- Pdf download dialog translations
- Howto bulletin text
- Removing region parameter from the bulletin api
- Scrolling update
- Pdf dialog
- Blog and language #712
- Bulletin howto is hidden when a region is selected
- Blog styling
- Hashing bulletin request url
- Version in the footer
- How to styling
- Bulletin  report anchor points
- How to styling
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Danger level underscore in link
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website

Conflicts:
	app/views/staticPage.jsx
- Resolve conflict.
- Pdf linking
- Scroll timeout
- Cleaning
- SearchLang fixed
- Blog classes of selects
- Cleaning
- Fluent scrolling
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website
- Fix npm dependencies for unsave package flatmap-stream.
- Iframe station table height
- Package dependencies update
- New babel
- Initial pdf link
- Mouseover bulletin
- Latest date
- Fix hover text for avalanche problems occuring below treeline.
- /latest path handling
- Blog link styling
- Archive pdf links
- Allow optional parameter "v" (version number) in URL of tile layers.

## [0.0.26] - 2018-08-30

### 💼 Other

- Cleanup code
- Remove styles an scripts from static content.
- Detecting unsupported browsers
- Styling unsupported browser message
-  unsupported browser cleaning
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Detecting unsupported browsers based on es5
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website
- Browser language ie
- RequestAnimationFrame polyfill
- Polyfill update
- Leaflet search for bulletin map
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website
- Fix CMS path translation by adding an additional / at the start of the path

## [0.0.25] - 2018-08-27

### 💼 Other

- Remove query string module.
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Rsync package.json script
- Preprocess CMS content.
- Cleanup code
- Footer block imported from CMS.
- Blending mode support check
- Meteo-viewer keeps map center and zoom in state
- Merge branch 'master' of gitlab.com:albina-euregio/albina-website
- Default domain from the domains.json
- Weather map item flipper labels
- Leaflet map base import fix
- IE blending cleaning
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website
- Add clearfix for CMS content.
- Add overview pages.
- Updated package version number.

## [0.0.24] - 2018-08-27

### 💼 Other

- Vulnerable dependencies update
- Meteo viewer iframe loaded with albina config
- Changing weather domain
- Domains.json file in data folder
- Few ideas for the weatherMap component
- Fix menu handling for menus with duplicated URL entries.
- Disable incompatible filters while searching.
Disable search text while filtering.
- Detect default language.
- Weather map iframe component.
- Cleanup of code.
- Item flipper component and weathermapStore added.
- Weather map store
- Flipping items
- Cleaning
- Weather map active buttons
- Weahter domain buttons from domains.json
- Last cleaning
- Cleaning
- IE support udpate
- Updated package version number.
- Fix lookup path computation.

## [0.0.23] - 2018-08-21

### 💼 Other

- Add link to interreg.
- Fix babel misconfiguration.
- Map details are always positioned right aligned.
- Include babel polyfill.

## [0.0.22] - 2018-08-21

### 💼 Other

- Fix dropdown selects occluded by footer.
- Fix typo.
- Bulletin daytime reports now enclosed in max-warnlevel styles.
- Update package version number.

## [0.0.21] - 2018-08-14

### 💼 Other

- Fitvids integration.
- Blog search.
- Update package version number.

## [0.0.20] - 2018-08-14

### 💼 Other

- Modal window for blog images.
- Blog Tags added.
- Add avalanche problem filter.
- Implement filtering by labels.
- Update package version number.

## [0.0.19] - 2018-08-14

### 💼 Other

- Multiple blogs supported.
- Handle multiple posts and HTTP 304 codes.
- Add header_text and shareable field to CMS.
- Update package version number.

## [0.0.18] - 2018-08-13

### 💼 Other

- Add regions to bulletin subscribe dialog.
- Test server reply.
- Subscribe confirmation added.
- Subscribe confirmation finished.
- Add icons to feed downloads.
- Add opacity to header when loading.
- Bulletin header formatting when loading.
- Show am and pm reports, if available.
- Update package version number.

## [0.0.17] - 2018-08-09

### 💼 Other

- Warnlevels no_snow and no_rating fixed.
- Use default subheader texts from active top level navigation element.
- Weather map menu integrated.
- Weather map dateflipper added.
- Added time flippers
- Fix menu translation.
- Fix mobile navigation.
- Fix mobile navigation.
- Dehighlight regions if some filter is active.
- Always start with current date when clicking HOME.
- Place current link after date flipper.
- Update package version number.

## [0.0.16] - 2018-08-09

### 💼 Other

- Fix xml download link.
- Missing translations added.
- Fix icons for increasing and decreasing tendency.
- Shrink margin of map container.
- Bulletin subscribe dialog added.
- Subscribe to blog dialog.
- Group blogs by region.
- Translation of archive table header.
- Use fd_overlay if no daytime dependency.
- Updated package version number.
- Config switch for map width added.
- Checkin updated config.

## [0.0.15] - 2018-08-07

### 💼 Other

- Simplify tooltip init using a mobx-reaction.
- Fix tooltips with line breaks.
- Always render all child menu entries - otherwise mobile menu is missing some entries.
- Move download links for PDF and XML to config.json
- Archive items tooltips and translations fixed.
- Translate filters and search.
- Updated package version number.

## [0.0.14] - 2018-08-06

### 💼 Other

- Don't link to author (mailto).
- Fix tooltips.
- Add steady icon.
- Tooltips for bulletin details.
- Fix hover texts.

## [0.0.13] - 2018-08-06

### 💼 Other

- Use localstorage to prevent cookie dialog from popping up repeatedly.
- Follow on Social Media dialog.
- Disable pointer events on page loading screen when page is loaded.
- Switch between subscribe and social-media-subscribe dialog.
- App config added.
- Subscribe to app dialog.
- Add missing bulletin translations.
Add padding at bottom of static pages.
- Add interreg link.
- Bulletin status translations.
- Do not show snowpack structure and tendency headlines if no text is provided.
- Add space after author title.
- Enable smooth scroll plugin.
- Append lang param to all iframes.
- Updated package version number.

## [0.0.12] - 2018-08-02

### 💼 Other

- Add Google Analytics support.
- Added Google Analytics key.
- Updated package version number.
- Subscribe Dialog added.
- Link Bulletin subscribe to footer subscribe dialog.
- Move dialogs to page component.
- Cookie Consent dialog

## [0.0.11] - 2018-07-31

### 💼 Other

- Subnavigation for weather map.
- Remove query paramerters from url when testing for active menu entry.
- Unify static page url lookup and loading.
- Don't refresh page if changing domain.
- No snow added to hover text.
- Use additional map params for initial weather map.

## [0.0.10] - 2018-07-31

### 💼 Other

- New translation lookup json.
- Icon titles and alts.
- Bulletin Header translations.
- Map info box translations.
- Bulletin legend translations.
- Use tranlation key "all" to apply a string for all languages.
- Footer translations.
- Use HTML formatting for non-hover and non-alt texts.
- Bulletin report translation.
- Fetch Bulletin headline and context from server.
- Add danger patterns to translation file.
- Updated version number.

## [0.0.9] - 2018-07-26

### 💼 Other

- Integrated station measurements iframe.
- Handle 'favorable situation'.
- Add favourable situation icons.
- Fix link addresses in date flipper.
- Add "dehighlighted" style for bulletin vector layer.
- Updated version number.
- Updated version number.

## [0.0.8] - 2018-07-25

### 💼 Other

- Start archive with current month.
- Remove empty list element if month filter is hidden.
- Home Link working.
- Config option for polygon smoothing added.
- Disable leaflet sleep plugin.
- Leaflet zoom buttons added.
- Vector layer styling.
- Fix icons for warnlevel 5.
Rerender infobox on am-pm change.
- Links added for avalance problems, warnlevels and danger patterns.
- Add steady class for tendency.
- Scroll to top on forward page changes.
- Close mobile menu on selection.
- Use leaflet zoom control.
- Update package version number.

## [0.0.7] - 2018-07-24

### 💼 Other

- Fix handling of multi polygons.
- Invalidate bulletin map size after window size has changed.

## [0.0.6] - 2018-07-23

### 💼 Other

- New test date 2018-07-17
- Hide map search.
- Use react router instead of window location to speed up menu creation.

## [0.0.5] - 2018-07-18

### 💼 Other

- Reorganised component directory tree.
- 404 page added
- Handle invalid date params for bulletin route.
- Footer-more menu delivered by CMS now
- Menu component added.
Support for child menus.
- Incremented package version.

## [0.0.4] - 2018-07-16

### 💼 Other

- Station measurments view added
- Subnavigation fixed for snow & weather
- Move search field to own component.
- Use filter as children for filter bar
- Add hash param to bundle to prevent from browser caching outdated bundles.
- MaxBounds changed
- Add extra margin to map to enable scrolling on mobile devices
- Incremented version number
- Fix map layer misalignment issue when trying to pan beyond max bounds

## [0.0.3] - 2018-07-12

### 💼 Other

- Restrict area of map panning.
- Resize map on window resize and orientationchange events.
- Add version number to development builds in footer.
- Updated README.
- Updated version number

## [0.0.2] - 2018-07-11

### 🐛 Bug Fixes

- Fix status line
- Fix accept header
- Fix icon class
- Fix ampm switch
- Fix ampm in report
- Fix problem elevation icon when two elevations given
- Fix status line when bulletin is missing
- Fix region highlighting when switching between dates
- Fix incorrect date calculation in archive store
- Fix menu active classes when not running at webserver's root directory
- Fix header menu's active class when not running at the webserver's root directory

### 💼 Other

- Boilerplate
- Initialised navigation
- Getting rid of eslint ... for now
- Footer initialised
- Subnavigation
- Page navigation
- Cleaning
- Routing
- Default routes
- Forcing default page
- Writing news
- Webpack works
- Added Blog integration.
Added CMS integration.
Added static config.
- Handle static page ids dynamically.
- Integrated blog + cms
- Page header footer working
- Import patterns from patternlab
- New templates
- Added Rainer's new template files.
- Cleanup
- Use Rainer's component separation.
- Mobx integrated
- Bulletin components compiled from templates.
- Remove Google Maps - create empty map compontent.
- Bulletin store added.
- Bulletin store working.
- Bulletin store working.
- Leaflet map component with basic functionality
- Package.json cleaned
- Package.json scripts updated
- Webpack works
- Requesting config
- History api fallback set
- Bower components are loaded in main.jsx
- Sweet scroll dependency
- Custom.js mess and hundreds of global variables :/
- Clean cache base method
- Bulletin header date changes.
- Code cleanup.
- Am pm in config.json
- Ampm switch
- Ampm switch working
- Code cleanup.
- BulletinDateFlipper added.
Dateformatin moved to separate file.
- Date flipper working.
- Status line shows loading text.
- Add status class to bulletin header.
- Added status-dependent CSS.
- Merge branch 'bulletin-store'

Conflicts:
	app/base.js
	app/components/organisms/bulletin-header.jsx
	app/components/organisms/bulletin-map.jsx
	app/views/bulletin.jsx

AMPM component
DateFlipper component
Bulletin status added
- Bulletin store reorganised.
- Changing viewports
- Overlaying map
- Zoom buttons
- Scrolling on "alt" pressed down
- In-house tilemap
- Leaflet-sleep implemented
- Merging map
- Key press checker removed
- Get problems from bulletin
bulletin-filter component added
- .
- Problem button list rendered.
- Problem toggling working
- Two spaces added
- New icons added.
Use ProblemIcon component consistently.
- Cleanup waiting animation.
- Code cleanup.
- Cleanup of unused props
- Warn level icon component
- Elevation icon added
- Exposition icon
- Added reusable icon components
- Fix webkit issue with date-flipper component
- Cleanup repository.
- Updated readme
- Use data1.geo.univie.ac.at as CMS instead of localhost to decouple webapp and CMS development.
- Changes due to Rainer's style updates
- Fix elevation icons
- Unify warn-level icon
- Added problem-icon-link component
- Remove data-scroll attributes to make hash links working again
- React-intl working
- Translate header strings.
- Locale date
- Add optional type parameter.
- Move translations to separate file
- Add mobx-4 compatible mobx-react-intl.
- Make mobx-4 compatible react-intl version.
- Merge
- Remove patternlab dependencies.
- Webpack update, moving config on build
- Merge branch 'master' of https://github.com/adammertel/albina
- Dynamically load config.json
Fix image paths in production builds.
- Create component for static warn level map.
- Add README
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website
- Updated readme
- Fix linter in Atom editor
- Code cleanup.
- Load report only when needed
- Renamed bulletin collection to distinguish it from single bulletin
- Use maximum as publication date
- Immediately show report when fetching a bulletin collection of length 1
- Fix warnlevels.
- Set tendendy to 'unknown' if not given
- Dynamic loading of bulletin report if only a single bulletin selected
- Dynamic snowpack structure section
- Added Rainer's updated styles and icons.
- Handle "hasDaytimeDependency" correctly
- Fix icon when no elevation dependency is given
- Fix icon paths for weak_persistent_layer
- AM-PM fixed
Icon paths fixed
- Bulletin status query added
- Translate treeline
- Report status "published" if bulletin is ok and not "republished"
- Fix custom.js errors and animejs.
- Don't reload page on internal link
- Add language-specific classes to body
- Language-specific body classes
- Inject language handling to footer
- Add bulletin date to URL.
- Prefer date URL param over store settings
- Fix history when switching between dates
- GeoJSONs loading
- Make hasDaytimeDependency a normal function
- Vector layer shown
- Highlighting region now possible
- Select bulletin on map working
- AW static maps included
- Fix undefined string appearing when where is set to 'all'
- Also highlight region when selected
- Problem icons in map details
- Mouseover events working for vector layer
- Code cleanup
- Filter for geojson implemented
- Problem filtering
- Changed meteo iframe size
- Make map more configurable.
- Make maps fit to container width instead of window width.
- Disable mouseover effect
- Deselect currently selected feature when clicking on background layer
- Handling region state
- Rendering regions
- Styling regions
- Styling regions
- Avalanche warning map overlays integrated.
- Fix overlay when selected region changes
- Regions blending mode
- Ordering regions based on the state
- Hide next arrow, if latest bulletin is active
- Update fill properties to override leaflet default settings
- Bulletin archive view and achivestore added
- Move all status handling to archiveStore
- Tms values config update
- Merge branch 'master' of https://gitlab.com/albina-euregio/albina-website
- Make status line use archiveStore instead of bulletinStore
- Subnavigation added
- Rerender page header on location change
- Make static pages centered
- Imported styles into pages other than bulletin
- Added todo
- Problem filter now hightlights region instead of deselecting it
- Styling of highlighted regions
- Enable hard page reload of bulletins
- Remove projectRoot setting from config.json - now determined by webpack output.publicPath setting
- Set deployment output path for development server installation.
- Archive filter bar.
- Imported Rainer's changes
- Add filter bar to blog overview
- Imported Rainer's styles.
- Integrated search field
- Added BlogStore.
- Filter working with pure select.
- Move selectric to own component.
- Filter blog posts by date.
- Hide Month filter if year is unset.
- Use region codes as keys instead of region names.
- Blog post item region and lang parameters imported from config.json.
- Use smarter blogger params to save network traffic.
- Abstract blogger-specific code into processor object
- Add blogger labels as tags if available
- Rename blog to blogOverview
- Blog post view added.
- Changed preview map icon
- Day filter added
- Move minYear config out of filter component
- Set maxResult for archive entries in config
- Date filter working for bulletin archive
- Refresh selectric when options changed
- Fix url of thumbnail map.
- Changed URL to map tiles
- Auto select January when a year is selected.
- Link thumbnail map to bulletin.

### 📚 Documentation

- Documentation added

<!-- generated by git-cliff -->
