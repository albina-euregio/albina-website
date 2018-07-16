import React from 'react';
import { Provider, observer } from 'mobx-react';
import { MobxIntlProvider } from '../util/mobx-react-intl.es5.js';

//import { BrowserHistory } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import Bulletin from './../views/bulletin';
import BlogOverview from './../views/blogOverview';
import BlogPost from './../views/blogPost';
import Weather from './../views/weather';
import StationMeasurements from './../views/stationMeasurements';
import Education from './../views/education';
import Archive from './../views/archive';
import StaticPage from './../views/staticPage';
import Page from './page';

// FIXME: CSS cannot be parsed right now: require('../css/style.css');
require('../css/style.css');
require('../css/app.css'); // CSS overrides
require('./../../node_modules/leaflet/dist/leaflet.css');

//require('./js/custom.js');

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  routes() {
    return [
      {
        path: '/',
        component: Page,
        indexRoute: {
          component: Bulletin
        },
        routes: [
          {
            path: '/bulletin/:date?',
            component: Bulletin
          },
          {
            path: '/weather/measurements',
            component: StationMeasurements
          },
          {
            path: '/weather',
            component: Weather
          },
          {
            path: '/education',
            component: Education
          },
          {
            path: '/blog/:blogName/:postId',
            component: BlogPost
          },
          {
            path: '/blog',
            component: BlogOverview,
          },
          {
            path: '/archive',
            component: Archive,
          },
          {
            path: '/:name',
            component: StaticPage,
          }
        ]
      }
    ];
  }

  render() {
    const store=window['appStore'];
    return (
      <Provider {...store}>
        <MobxIntlProvider>
          <BrowserRouter basename={config.get('projectRoot')}>
            {renderRoutes(this.routes())}
          </BrowserRouter>
        </MobxIntlProvider>
      </Provider>
    );
  }
}

export default observer(App);
