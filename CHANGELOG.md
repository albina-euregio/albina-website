# Changelog

<!-- To update, run `yarn changelog`. -->

## [7.0.4] - 2024-11-28

### ⚙️ Miscellaneous Tasks

- _(eaws-regions)_ Update dependency to v7.0.1
- _(eaws-regions)_ Update dependency to v7.0.2
- _(season-reports)_ Season report for 2023-24 for Austria

## [7.0.3] - 2024-11-25

### 🚀 Features

- Different favicons and logos for beta and dev
- Tech blog

## [7.0.2] - 2024-11-13

### ⚙️ Miscellaneous Tasks

- Indicate when a bulletin has been updated. For each region, a visualization of the differences to the previous version can be toggled.
  (This feature has been tested on beta for several months, and was finally enabled in production.)

## [7.0.1] - 2024-11-07

### 🚀 Features

- Ability to create PDFs per warning region (in the currently selected language)
- Improved uPlot diagrams:
  - Wind direction with nominal axis
  - Hide "interactive" if not available
  - Move unit to axis label

### ⚙️ Miscellaneous Tasks

- _(eaws-regions)_ Update dependency to v7.0.0

## [7.0.0] - 2024-10-15

### Breaking Changes

- Bulletins are now valid from 5pm until 5pm.  
  The validity is displayed at the top for each bulletin.

### 🚀 Features

- Blog entries have associated categories for easier filtering:  
  _Current situation_, _Incident_, _Education_, _Statistics_, _Winter review_
- _(stationArchive)_ Add IT-32-BZ
- _(season-reports)_ Add avalanche report 2023/24
