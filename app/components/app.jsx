import React, { Suspense } from "react";
import { observer } from "mobx-react";
import { IntlProvider } from "react-intl";

import { Redirect } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { ScrollContext } from "react-router-scroll-4";

import Bulletin from "./../views/bulletin";
import BlogOverview from "./../views/blogOverview";
import BlogPost from "./../views/blogPost";
const Weather = React.lazy(() => import("./../views/weather"));
const StationMeasurements = React.lazy(() =>
  import("./../views/stationMeasurements")
);
const StationMap = React.lazy(() => import("./../views/stationMap"));
import Education from "./../views/education";
import More from "./../views/more";
import Archive from "./../views/archive";
import Linktree from "../views/linkTree.jsx";
import StaticPage from "./../views/staticPage";
import Page from "./page";
import { scroll_init } from "../js/scroll";
import { orientation_change } from "../js/browser";

import "../css/style.scss"; // CSS overrides

class App extends React.Component {
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
    setTimeout(function () {
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
            path: "/weather/stations",
            exact: true,
            component: StationMap
          },
          {
            path: "/weather",
            exact: true,
            component: () => <Redirect to={"/weather/map"} />
          },
          {
            path: "/education",
            exact: true,
            component: Education
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
            component: More
          },
          {
            path: "/more/archive",
            exact: true,
            component: Archive
          },
          {
            path: "/more/linktree",
            exact: true,
            component: Linktree
          },
          {
            path: "/archive",
            exact: true,
            component: () => <Redirect to={"/more/archive"} />
          },
          {
            path: "/:lang([a-z]{2})",
            component: ({ match }) => {
              const lang = match?.params?.lang;
              window["appStore"].setLanguage(lang);
              return <Redirect to={"/"} />;
            }
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
    return (
      <IntlProvider
        locale={window["appStore"].language}
        messages={window["appStore"].messages}
      >
        <BrowserRouter basename={config.projectRoot}>
          <ScrollContext shouldUpdateScroll={this.shouldUpdateScroll}>
            <Suspense fallback={"..."}>{renderRoutes(this.routes())}</Suspense>
          </ScrollContext>
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export default observer(App);
