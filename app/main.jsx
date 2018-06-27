import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.jsx';
import Base from './base.js';
import AppStore from './appStore.js';
import ConfigStore from './configStore.js';
import {addLocaleData} from 'react-intl';
import {reaction} from 'mobx';
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';
addLocaleData([...en, ...de, ...it]);

/* bower components */
window['jQuery'] = window['$'] = require('jquery');
require('./bower_components/jquery-selectric/public/jquery.selectric.min.js');
require('./bower_components/tilt_1.1.19/dest/tilt.jquery.min.js');
require('./bower_components/magnific-popup_1.1.0/dist/jquery.magnific-popup.min.js');
window[
  'SweetScroll'
] = require('./bower_components/sweet-scroll-master_3.0.0/sweet-scroll.min.js');
window[
  'tippy'
] = require('./bower_components/tippyjs_2.2.3/dist/tippy.all.min.js');
window[
  'fluidvids'
] = require('./bower_components/fluidvids_2.4.1/dist/fluidvids.min.js');

require('./js/custom.js');

// TODO: check content API for maintenance mode
window['appStore'] = new AppStore();

// clean cache
const getBasePath = () => {
  const bodyScriptTags = document.body.getElementsByTagName('script');
  if(bodyScriptTags.length > 0) {
    const bundleLocation = (bodyScriptTags[0]).getAttribute('src');
    return bundleLocation.substring(0, bundleLocation.lastIndexOf('/') + 1);
  }
  return '/'; // fallback
};
const basePath = getBasePath();
const configUrl = basePath + 'config.json';
Base.cleanCache(configUrl);

// request config.json before starting the app (do not cache config!)
Base.doRequest(configUrl).then((configData) => {
  var configParsed = JSON.parse(configData);
  configParsed['projectRoot'] = basePath;

  window['config'] = new ConfigStore(configParsed);
  const initialLang = window['appStore'].locale.value;

  const languageDependentClassesHandler = reaction(
    () => window['appStore'].locale.value,
    (newLang) => {
      document.body.className = document.body.className
        .replace(/domain-[a-z]{2}/, 'domain-' + newLang)
        .replace(/language-[a-z]{2}/, 'language-' + newLang);
    }
  );
  document.body.className +=
    (document.body.className ? ' ' : '')
    + 'domain-' + initialLang
    + ' language-' + initialLang;

  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div'))
  );
});
