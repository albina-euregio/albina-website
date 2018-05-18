import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.jsx';
import Base from './base.js';
import AppStore from './appStore.js';
import ConfigStore from './configStore.js';

/* bower components */
window['jQuery'] = window['$'] = require('jquery');
require('./bower_components/jquery-selectric/public/jquery.selectric.min.js');
require('./bower_components/tilt_1.1.19/dest/tilt.jquery.min.js');
require('./bower_components/animejs_2.2.0/anime.min.js');
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
window.onkeydown = e => appStore.SetKeyDown(e.keyCode);
window.onkeyup = () => appStore.SetKeyDown(false);

// clean cache
Base.cleanCache('./config.json');

// request config.json before starting the app (do not cache config!)
const configData = require('./config.json'); // ?t=' + Date.now()
window['config'] = new ConfigStore(configData);

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
);
