/* eslint no-undef: 0 */
/* eslint no-unused-vars: 0 */

import { observable, action, computed, toJS } from 'mobx'
import React from 'react'
import { LocaleStore } from './util/mobx-react-intl.es5.js'
import CookieConsentStore from './stores/cookieConsentStore'
import NavigationStore from './stores/navigationStore'
import translations from './data/translations.json'

class AppStore extends React.Component {
  @observable
  keyDown
  @observable
  locale
  @observable
  _unsupportedBrowserModal
  cookieConsent
  navigation
  regions
  languages
  warnlevelNumbers

  constructor(languages) {
    super()
    this.languages = ['en', 'de', 'it']
    const translationFallbackLanguage = 'all'

    this._unsupportedBrowserModal = observable.box(false)

    const translationLookup = {}
    this.languages.forEach(lang => {
      translationLookup[lang] = {}
    })

    Object.keys(translations).forEach(key =>
      this.languages.forEach(lang => {
        // take language key, or "all", if translation is missing
        translationLookup[lang][key] = translations[key][lang]
          ? translations[key][lang]
          : translations[key][translationFallbackLanguage]
      })
    )

    // initial language is changed after config has arrived!!!
    this.locale = new LocaleStore('en', translationLookup)
    this.cookieConsent = new CookieConsentStore()
    this.navigation = new NavigationStore()

    this.regions = {
      'AT-07': translations['region:AT-07'],
      'IT-32-BZ': translations['region:IT-32-BZ'],
      'IT-32-TN': translations['region:IT-32-TN']
    }

    this.warnlevelNumbers = {
      low: 1,
      moderate: 2,
      considerable: 3,
      high: 4,
      very_high: 5,
      no_snow: 0,
      no_rating: 0
    }

    this.avalancheProblems = Object.keys(translations)
      .filter(k => k.match(/^problem:/))
      .map(k => k.substr(8))
  }

  get language() {
    return this.locale.value
  }

  get unsupportedBrowserModal() {
    return toJS(this._unsupportedBrowserModal)
  }

  @action
  unsupportedBrowserModalOn() {
    this._unsupportedBrowserModal.set(true)
  }

  @action
  unsupportedBrowserModalOff() {
    this._unsupportedBrowserModal.set(false)
  }

  @action
  setLanguage(newLanguage) {
    if (this.languages.includes(newLanguage)) {
      console.log('setting new language', newLanguage)

      this.locale.value = newLanguage
      return true
    } else {
      return false
    }
  }

  /**
   * Get regions for current language.
   */
  getRegions() {
    return Object.keys(this.regions).reduce((acc, r) => {
      acc[r] = this.getRegionName(r)
      return acc
    }, {})
  }

  getRegionName(code) {
    if (this.regions[code]) {
      const lang = this.language
      return this.regions[code][lang]
    }
    return ''
  }

  getWarnlevelNumber(id) {
    if (this.warnlevelNumbers[id]) {
      return this.warnlevelNumbers[id]
    }
    return 0
  }

  getWarnLevelId(num) {
    if (num > 0) {
      return Object.keys(this.warnlevelNumbers).find(k => {
        return this.warnlevelNumbers[k] == num
      })
    }
    return ''
  }
}

export default AppStore
