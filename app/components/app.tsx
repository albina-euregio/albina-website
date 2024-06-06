import React, { Suspense, useEffect } from "react";

import { Redirect, Route, Router, Switch, useParams } from "wouter";
import { setLanguage } from "../appStore";
import Page from "./page";

import "../css/style.scss"; // CSS overrides

const Bulletin = React.lazy(() => import("../views/bulletin"));
const BlogOverview = React.lazy(() => import("../views/blogOverview"));
const BlogPost = React.lazy(() => import("../views/blogPost"));
const Weather = React.lazy(() => import("../views/weather"));
const StationMeasurements = React.lazy(
  () => import("../views/stationMeasurements")
);
const StationArchive = React.lazy(() => import("../views/stationArchive"));
const StationMap = React.lazy(() => import("../views/stationMap"));
const SnowProfileMap = React.lazy(() => import("../views/snowProfileMap"));
const Education = React.lazy(() => import("../views/education"));
const More = React.lazy(() => import("../views/more"));
const Archive = React.lazy(() => import("../views/archive"));
const Linktree = React.lazy(() => import("../views/linkTree.jsx"));
const StaticPage = React.lazy(() => import("../views/staticPage"));

const App = () => {
  useEffect(() => {
    window.addEventListener("orientationchange", () => {
      document.body.animate(
        [
          { opacity: "0", easing: "ease-out" },
          { opacity: "1", easing: "ease-out" }
        ],
        {
          duration: window["scroll_duration"]
        }
      );
    });
  });

  return (
    <Router base={config.projectRoot}>
      <Suspense fallback={"..."}>
        <Switch>
          <Route path="/headless">
            <Route path="bulletin/:date">
              <Bulletin headless={true} />
            </Route>
            <Route path="bulletin/latest">
              <Bulletin headless={true} />
            </Route>
            <Route>
              <Redirect to="bulletin/latest" />
            </Route>
          </Route>
          <Route path="/">
            <Page>
              <Route path="/bulletin/:date">
                <Bulletin />
              </Route>
              <Route path="/bulletin/latest">
                <Bulletin />
              </Route>
              <Route path="/bulletin">
                <Redirect to="/bulletin/latest" />
              </Route>
              <Route path="/weather/map/:domain">
                <Weather />
              </Route>
              <Route path="/weather/map/">
                <Weather />
              </Route>
              <Route path="/weather/measurements">
                <StationMeasurements />
              </Route>
              <Route path="/weather/archive">
                <StationArchive />
              </Route>
              <Route path="/weather/stations">
                <StationMap />
              </Route>
              <Route path="/weather/snow-profiles">
                <SnowProfileMap />
              </Route>
              <Route path="/weather">
                <Redirect to="/weather/map" />
              </Route>
              <Route path="/education">
                <Education />
              </Route>
              <Route path="/blog/:blogName/:postId">
                <BlogPost />
              </Route>
              <Route path="/blog">
                <BlogOverview />
              </Route>
              <Route path="/more/archive">
                <Archive />
              </Route>
              <Route path="/more/linktree">
                <Linktree />
              </Route>
              <Route path="/more">
                <More />
              </Route>
              <Route path="/archive">
                <Redirect to="/more/archive" />
              </Route>
              <Route>
                <Redirect to="/bulletin/latest" />
              </Route>
              <Route path="/education/*">
                <StaticPage />
              </Route>
              <Route path="/:name">
                <StaticPage />
              </Route>
              <Route path="/:segment/:name">
                <StaticPage />
              </Route>
            </Page>
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
};

export default App;
