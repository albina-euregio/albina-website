import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.jsx';
import Base from './base.js';
import AppStore from './appStore.js';
import ConfigStore from './configStore.js';

// TODO: check content API for maintenance mode

window['appStore'] = new AppStore();

// clean cache
window.caches.delete('./config.json');

// request config.json before starting the app (do not cache config!)
const configData = require('./config.json'); // ?t=' + Date.now()
window['config'] = new ConfigStore(configData);

ReactDOM.render(
  <App />,
  document.body.appendChild(document.createElement('div'))
);
