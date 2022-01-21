import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import { IntlProvider } from "react-intl";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams
} from "react-router-dom";
//import { ScrollContext } from "react-router-scroll";

import { APP_STORE } from "../appStore";

const Bulletin = React.lazy(() => import("./../views/bulletin"));
const BlogOverview = React.lazy(() => import("./../views/blogOverview"));
const BlogPost = React.lazy(() => import("./../views/blogPost"));
const Weather = React.lazy(() => import("./../views/weather"));
const StationMeasurements = React.lazy(() =>
  import("./../views/stationMeasurements")
);
const StationMap = React.lazy(() => import("./../views/stationMap"));
const SnowProfileMap = React.lazy(() => import("./../views/snowProfileMap"));
const Education = React.lazy(() => import("./../views/education"));
const More = React.lazy(() => import("./../views/more"));
const Archive = React.lazy(() => import("./../views/archive"));
const Linktree = React.lazy(() => import("../views/linkTree.jsx"));
const StaticPage = React.lazy(() => import("./../views/staticPage"));
import Page from "./page";
import { scroll_init } from "../js/scroll";
import { orientation_change } from "../js/browser";

import "../css/style.scss"; // CSS overrides

const SwtichLang = () => {
  const params = useParams();
  console.log("SwtichLang", params);
  useEffect(() => {
    if ((lang = params?.lang)) APP_STORE.setLanguage(lang);
  });
  return <Navigate replace to="/" />;
};

const App = () => {
  useEffect(() => {
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
  });

  console.log("App", config);
  return (
    <IntlProvider locale={APP_STORE.language} messages={APP_STORE.messages}>
      <BrowserRouter basename={config.projectRoot}>
        <Suspense fallback={"..."}>
          <Routes>
            <Route path="/">
              <Route index element={<Page></Page>} />
              <Route
                path="/bulletin/:date([0-9]{4}-[0-9]{2}-[0-9]{2})"
                element={
                  <Page>
                    <Bulletin />
                  </Page>
                }
              />
              <Route
                path="/bulletin/latest"
                element={
                  <Page>
                    <Bulletin />
                  </Page>
                }
              />
              <Route
                path="/weather/map/:domain"
                element={
                  <Page>
                    <Weather />
                  </Page>
                }
              />
              <Route
                path="/weather/measurements"
                element={
                  <Page>
                    <StationMeasurements />
                  </Page>
                }
              />
              <Route
                path="/weather/stations"
                element={
                  <Page>
                    <StationMap />
                  </Page>
                }
              />
              <Route
                path="/weather/snow-profiles"
                element={
                  <Page>
                    <SnowProfileMap />
                  </Page>
                }
              />
              <Route
                path="/weather"
                element={<Navigate replace to="/weather/map" />}
              />
              <Route
                path="/education"
                element={
                  <Page>
                    <Education />
                  </Page>
                }
              />
              <Route
                path="/blog/:blogName/:postId"
                element={
                  <Page>
                    <BlogPost />
                  </Page>
                }
              />
              <Route
                path="/blog"
                element={
                  <Page>
                    <BlogOverview />
                  </Page>
                }
              />
              <Route
                path="/more"
                element={
                  <Page>
                    <More />
                  </Page>
                }
              />
              <Route
                path="/more/archive"
                element={
                  <Page>
                    <Archive />
                  </Page>
                }
              />
              <Route
                path="/more/linktree"
                element={
                  <Page>
                    <Linktree />
                  </Page>
                }
              />
              <Route
                path="/archive"
                element={<Navigate replace to="/more/archive" />}
              />
              <Route
                path="/:lang([a-z]{2})"
                element={
                  <Page>
                    <SwtichLang />
                  </Page>
                }
              />
              <Route
                path="/education/*"
                element={
                  <Page>
                    <StaticPage />
                  </Page>
                }
              />
              <Route
                path="/:name"
                element={
                  <Page>
                    <StaticPage />
                  </Page>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </IntlProvider>
  );
};

export default observer(App);
