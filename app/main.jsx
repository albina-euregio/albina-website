import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.jsx';
import Base from './base.js';
import ConfigStore from './configStore.js';

// TODO: check content API for maintenance mode

// request config.json before starting the app (do not cache config!)
Base.doRequest('config.json?t=' + Date.now()).then(configData => {
  window['config'] = new ConfigStore(JSON.parse(configData));

  ReactDOM.render(
    <App />,
    document.body.appendChild(document.createElement('div'))
  ); 
});
