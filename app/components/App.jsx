import React from 'react';
import { BrowserHistory } from 'react-router';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';

import News from '../views/news';
import Weather from '../views/weather';
import Info from '../views/info';
import PageHeadingWrapper from './pageheading/wrapper';
import PageFooterWrapper from './pagefooter/wrapper';
import Page from './page';

require('../css/bulma.css');
require('../css/app.css');

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  routes() {
    return [{
      path: '/',
      component: Page,
      indexRoute: {
        component: News
      },
      routes: [
        {
          path: '/news',
          component: News,
          indexRoute: {
            component: News
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
          path: '/info',
          component: Info,
          childRoutes: [
            {
              path: '/info/:aboutSection',
              component: Info
            }
          ]
        }
      ]
    }]
  }

  render() {
    return (
      <BrowserRouter>
        {
          renderRoutes(this.routes())
        }
      </BrowserRouter>
    );
  }
}
