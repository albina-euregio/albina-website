import React from 'react';
import { observer } from 'mobx-react';
//import { BrowserHistory } from 'react-router';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';

import Bulletin from './../views/bulletin.jsx';
import Blog from './../views/blog.jsx';
import Weather from './../views/weather.jsx';
import Education from './../views/education.jsx';
import StaticPage from './../views/staticPage.jsx';
import Page from './page.jsx';

// FIXME: CSS cannot be parsed right now: require('../css/style.css');
require('../css/style.css');
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
            path: '/bulletin',
            component: Bulletin,
            indexRoute: {
              component: Bulletin
            }
          },
          {
            path: '/weather',
            component: Weather,
            indexRoute: {
              component: Weather
            }
          },
          {
            path: '/education',
            component: Education,
            indexRoute: {
              component: Education
            }
          },
          {
            path: '/info',
            component: StaticPage,
            childRoutes: [
              {
                path: '/info/:site',
                component: StaticPage
              }
            ]
          },
          {
            path: '/blog',
            component: Blog,
            indexRoute: {
              component: Blog
            }
          },
          {
            path: '/:name',
            component: StaticPage,
            indexRoute: {
              component: StaticPage
            }
          }
        ]
      }
    ];
  }

  render() {
    return (
      <BrowserRouter basename={config.get('projectRoot')}>
        {renderRoutes(this.routes())}
      </BrowserRouter>
    );
  }
}

export default observer(App);
