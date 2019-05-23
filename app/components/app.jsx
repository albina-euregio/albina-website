import React from "react";
import { Provider, observer } from "mobx-react";
import { MobxIntlProvider } from "../util/mobx-react-intl.es5.js";

import { Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import Bulletin from "./../views/bulletin";
import BlogOverview from "./../views/blogOverview";
import BlogPost from "./../views/blogPost";
import Weather from "./../views/weather";
import StationMeasurements from "./../views/stationMeasurements";
import OverviewPage from "./../views/overviewPage";
import Archive from "./../views/archive";
import StaticPage from "./../views/staticPage";
import SubscribeConfirmation from "./../views/subscribeConfirmation";
import Page from "./page";

const { detect } = require("detect-browser");
const browser = detect();
import isES5Supported from "is-es5-supported";

// FIXME: CSS cannot be parsed right now: require('../css/style.css');
require("../css/style.css");
require("../css/app.scss"); // CSS overrides
require("./../../node_modules/leaflet/dist/leaflet.css");

// require('./js/custom.js');

class App extends React.Component {
  constructor(props) {
    super(props);

    /* checking if the browser is supported */
    //console.log(isES5Supported)
    if (browser) {
      window["browserVersion"] = browser.name + browser.version;
      //console.log(browserVersion)

      if (!isES5Supported) {
        //console.log('browser not supported')
        appStore.unsupportedBrowserModalOn();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  routes() {
    return [
      {
        path: "/",
        component: Page,
        indexRoute: {
          component: Bulletin
        },
        routes: [
          {
            path: "/bulletin/:date([0-9]{4}-[0-9]{2}-[0-9]{2})?",
            component: Bulletin
          },
          {
            path: "/bulletin/latest?",
            component: Bulletin
          },
          {
            path: "/weather/map/:domain?",
            exact: true,
            component: Weather
          },
          {
            path: "/weather/measurements",
            exact: true,
            component: StationMeasurements
          },
          {
            path: "/weather",
            exact: true,
            component: () => <Redirect to={"/weather/map"} />
          },
          {
            path: "/education",
            exact: true,
            component: OverviewPage
          },
          {
            path: "/blog/:blogName/:postId",
            component: BlogPost
          },
          {
            path: "/blog",
            exact: true,
            component: BlogOverview
          },
          {
            path: "/more",
            exact: true,
            component: OverviewPage
          },
          {
            path: "/archive",
            exact: true,
            component: Archive
          },
          {
            path: "/subscribe/:hash",
            component: SubscribeConfirmation
          },
          {
            // NOTE: 404 error will be handled by StaticPage, since we do not
            // know which pages reside on the CMS in this router config
            path: "/:name",
            component: StaticPage
          }
        ]
      }
    ];
  }

  render() {
    const store = window["appStore"];
    return (
      <Provider {...store}>
        <MobxIntlProvider>
          <BrowserRouter basename={config.get("projectRoot")}>
            {renderRoutes(this.routes())}
          </BrowserRouter>
        </MobxIntlProvider>
      </Provider>
    );
  }
}

export default observer(App);
