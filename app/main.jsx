/* IE polyfills */
import 'babel-polyfill'
if (!window.Intl) {
  window['Intl'] = require('intl')
}
console.log('Ints after polyfill', Intl)
console.log('Ints after polyfill', Intl)

require('window.requestanimationframe')

import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/app.jsx'
import Base from './base.js'
import AppStore from './appStore.js'
import ConfigStore from './configStore.js'
import ModalStateStore from './stores/modalStateStore'
import StaticPageStore from './stores/staticPageStore'
import ReactGA from 'react-ga'
import { addLocaleData } from 'react-intl'
import { reaction } from 'mobx'
import { storageAvailable } from './util/storage'
import en from 'react-intl/locale-data/en'
import de from 'react-intl/locale-data/de'
import it from 'react-intl/locale-data/it'
addLocaleData([...en, ...de, ...it])

/* available languages and initial language */
const availableLanguages = ['en', 'de', 'it']

// used by mobx-react-intl - query before appStore constructor call
const userPreferenceLanguage = storageAvailable()
  ? window.localStorage.getItem('locale')
  : ''

const _getDefaultLanguage = () => {
  // 1 highest priority: URL lang param
  const urlLang = window.location.search
    ? window.location.search.substr(1).split('&').reduce((acc, e) => {
      if (!acc) {
        let matches = e.match(/^lang=(.*)/)
        if (
            matches &&
            matches.length > 1 &&
            availableLanguages.indexOf(matches[1]) >= 0
          ) {
          return matches[1]
        }
      }
      return acc
    }, '')
    : ''

  // 2 high priority: last language setting
  const userLang = urlLang || userPreferenceLanguage

  // 3 medium priority: config param (set to "auto" to omit this step)
  const configLang = userLang ||
    availableLanguages.indexOf(config.get('defaults.language')) >= 0
    ? config.get('defaults.language')
    : ''

  // 4 lowest priority: browser accept-language settings
  let browserLangSettings = window.navigator.language ? window.navigator.language : ''
  browserLangSettings = window.navigator.browserLanguage
    ? window.navigator.browserLanguage
    : ''

  browserLangSettings = browserLangSettings.substr(0, 2).toLowerCase()
  console.log(browserLangSettings)

  const browserLang = configLang || availableLanguages.indexOf(browserLangSettings) >= 0
    ? browserLangSettings
    : ''

  console.log('browserLang', browserLang)

  return browserLang || 'en' // if everything els fails
}

/* bower components */
window['jQuery'] = window['$'] = require('jquery')
require('./bower_components/jquery-selectric/public/jquery.selectric.min.js')
require('./bower_components/tilt_1.1.19/dest/tilt.jquery.min.js')
require('./bower_components/magnific-popup_1.1.0/dist/jquery.magnific-popup.min.js')
window[
  'SweetScroll'
] = require('./bower_components/sweet-scroll-master_3.0.0/sweet-scroll.min.js')
window['tippy'] = require('./bower_components/tippyjs_2.2.3/dist/tippy.all.min.js')
window['fluidvids'] = require('./bower_components/fluidvids_2.4.1/dist/fluidvids.min.js')

// TODO: check content API for maintenance mode before starting the app
window['appStore'] = new AppStore(availableLanguages)
window['staticPageStore'] = new StaticPageStore()
window['modalStateStore'] = new ModalStateStore()

require('./js/custom.js')

/*
 * Set project root directory. The project root is determined by the location
 * of the bundled javascript (the first script tag within body). It can be
 * set by output.publicPath setting in webpack config when deploying the app.
 *
 * The project root directory is used by the app to determine all relative
 * paths: config, images, jsons, ...
 */
const getBasePath = () => {
  const bodyScriptTags = document.body.getElementsByTagName('script')
  if (bodyScriptTags.length > 0) {
    const bundleLocation = bodyScriptTags[0].getAttribute('src')
    return bundleLocation.substring(0, bundleLocation.lastIndexOf('/') + 1)
  }
  return '/' // fallback
}
const basePath = getBasePath()

/*
 * Request config.json before starting the app (do not cache config!).
 * config.json is not bundled with the app to allow config editing without
 * redeploying the whole app.
 */
const configUrl = basePath + 'config.json'
Base.cleanCache(configUrl)
Base.doRequest(configUrl).then(configData => {
  var configParsed = JSON.parse(configData)
  configParsed['projectRoot'] = basePath
  configParsed['version'] = VERSION // included via webpack.DefinePlugin

  // TODO: exchange this config with the commented line below when going live!!!
  configParsed['developmentMode'] = true
  // configParsed['developmentMode'] = DEV; // included via webpack.DefinePlugin

  window['config'] = new ConfigStore(configParsed)

  // set initial language
  window['appStore'].language = _getDefaultLanguage()

  // init Analytics software - only on production builds
  if (!DEV) {
    const trackingKey = window['config'].get('apiKeys.gaTrackingId')
    if (trackingKey) {
      ReactGA.initialize(trackingKey)
      ReactGA.pageview(
        window.location.hostname + window.location.pathname + window.location.search
      )
    }
  }

  // replace language-dependent body classes on language change.
  const languageDependentClassesHandler = reaction(
    () => window['appStore'].locale.value,
    newLang => {
      document.body.className = document.body.className
        .replace(/domain-[a-z]{2}/, 'domain-' + newLang)
        .replace(/language-[a-z]{2}/, 'language-' + newLang)
    }
  )

  // initially set language-dependent body classes
  const initialLang = window['appStore'].locale.value
  document.body.className +=
    (document.body.className ? ' ' : '') +
    'domain-' +
    initialLang +
    ' language-' +
    initialLang

  ReactDOM.render(<App />, document.body.appendChild(document.createElement('div')))
})
