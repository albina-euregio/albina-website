import React from 'react'
import { Provider, observer } from 'mobx-react'
import { MobxIntlProvider } from '../util/mobx-react-intl.es5.js'

import { Redirect } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import Bulletin from './../views/bulletin'
import BlogOverview from './../views/blogOverview'
import BlogPost from './../views/blogPost'
import WeatherMap from './../views/weatherMap'
import StationMeasurements from './../views/stationMeasurements'
import Education from './../views/education'
import Archive from './../views/archive'
import StaticPage from './../views/staticPage'
import SubscribeConfirmation from './../views/subscribeConfirmation'
import Page from './page'

// FIXME: CSS cannot be parsed right now: require('../css/style.css');
require('../css/style.css')
require('../css/app.css') // CSS overrides
require('./../../node_modules/leaflet/dist/leaflet.css')

// require('./js/custom.js');

class App extends React.Component {
  constructor (props) {
    super(props)
  }

  shouldComponentUpdate (nextProps, nextState) {
    return true
  }

  routes () {
    return [
      {
        path: '/',
        component: Page,
        indexRoute: {
          component: Bulletin
        },
        routes: [
          {
            path: '/bulletin/:date([0-9]{4}-[0-9]{2}-[0-9]{2})?',
            exact: true,
            component: Bulletin
          },
          {
            path: '/weather/map/:domain?',
            exact: true,
            component: WeatherMap
          },
          {
            path: '/weather/measurements',
            exact: true,
            component: StationMeasurements
          },
          {
            path: '/weather',
            exact: true,
            component: () => <Redirect to={'/weather/map'} />
          },
          {
            path: '/education',
            exact: true,
            component: Education
          },
          {
            path: '/blog/:blogName/:postId',
            component: BlogPost
          },
          {
            path: '/blog',
            exact: true,
            component: BlogOverview
          },
          {
            path: '/archive',
            exact: true,
            component: Archive
          },
          {
            path: '/subscribe/:hash',
            component: SubscribeConfirmation
          },
          {
            // NOTE: 404 error will be handled by StaticPage, since we do not
            // know which pages reside on the CMS in this router config
            path: '/:name',
            component: StaticPage
          }
        ]
      }
    ]
  }

  render () {
    const store = window['appStore']
    return (
      <Provider {...store}>
        <MobxIntlProvider>
          <BrowserRouter basename={config.get('projectRoot')}>
            {renderRoutes(this.routes())}
          </BrowserRouter>
        </MobxIntlProvider>
      </Provider>
    )
  }
}

export default observer(App)
