import React from "react";
import loadable from "@loadable/component";
import { Provider, observer } from "mobx-react";
import { MobxIntlProvider } from "../util/mobx-react-intl.es5.js";

import { Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { ScrollContext } from "react-router-scroll-4";

import Bulletin from "./../views/bulletin";
import BlogOverview from "./../views/blogOverview";
import BlogPost from "./../views/blogPost";
const Weather = loadable(() =>
  import(/* webpackChunkName: "app-weather" */ "./../views/weather")
);
const StationMeasurements = loadable(() =>
  import(
    /* webpackChunkName: "app-stationMeasurements" */ "./../views/stationMeasurements"
  )
);
import OverviewPage from "./../views/overviewPage";
import Archive from "./../views/archive";
import StaticPage from "./../views/staticPage";
import SubscribeConfirmation from "./../views/subscribeConfirmation";
import Page from "./page";
import { scroll_init } from "../js/scroll";
import { orientation_change } from "../js/browser";

require("../css/style.css");
// require("../css/app.scss"); // CSS overrides

class App extends React.Component {
  shouldComponentUpdate() {
    return true;
  }

  componentDidMount() {
    window["page_html"] = $("html");
    window["page_body"] = $("body");
    window["page_loading_screen"] = $(".page-loading-screen");

    let debug_selector = $(
      ".modal-trigger, .modal-gallery-trigger, [data-scroll]"
    );
    for (var i = 0; i < debug_selector.length; i++) {
      debug_selector[i].onclick = null;
    }

    orientation_change();
    scroll_init();

    // remove splash screen
    setTimeout(function() {
      $("html").addClass("page-loaded");
    }, 150);
  }

  shouldUpdateScroll = (prevRouterProps, { location }) => {
    if (!prevRouterProps) {
      return true;
    }

    if (
      location.pathname.match(/weather\/map/) &&
      prevRouterProps.location.pathname.match(/weather\/map/)
    ) {
      return false;
    }

    return location.pathname !== prevRouterProps.location.pathname;
  };

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
          <BrowserRouter basename={config.projectRoot}>
            <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
              {renderRoutes(this.routes())}
            </ScrollContext>
          </BrowserRouter>
        </MobxIntlProvider>
      </Provider>
    );
  }
}

export default observer(App);
