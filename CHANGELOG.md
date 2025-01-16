# Changelog

<!-- Update using `yarn changelog <TAG>` before creating new tag <TAG> with git. -->

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
