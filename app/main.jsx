import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.jsx';
import Base from './base.js';
import AppStore from './store.js';
import ConfigStore from './configStore.js';

// TODO: check content API for maintenance mode

window['store'] = new AppStore();

console.log('main', store.lang);

// request config.json before starting the app (do not cache config!)
Base.doRequest('config.json?t=' + Date.now()).then(configData => {
  window['config'] = new ConfigStore(JSON.parse(configData));

  ReactDOM.render(
    <App store={store} />,
    document.body.appendChild(document.createElement('div'))
  );
});
