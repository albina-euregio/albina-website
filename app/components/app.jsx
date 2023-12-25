import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import { IntlProvider } from "react-intl";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams
} from "react-router-dom";
//import { ScrollContext } from "react-router-scroll";
import { $locale, $messages, setLanguage } from "../appStore";
import { useStore } from "@nanostores/react";
import Page from "./page";

import "../css/style.scss"; // CSS overrides

const Bulletin = React.lazy(() => import("./../views/bulletin"));
const BlogOverview = React.lazy(() => import("./../views/blogOverview"));
const BlogPost = React.lazy(() => import("./../views/blogPost"));
const Weather = React.lazy(() => import("./../views/weather"));
const StationMeasurements = React.lazy(() =>
  import("./../views/stationMeasurements")
);
const StationArchive = React.lazy(() => import("./../views/stationArchive"));
const StationMap = React.lazy(() => import("./../views/stationMap"));
const SnowProfileMap = React.lazy(() => import("./../views/snowProfileMap"));
const Education = React.lazy(() => import("./../views/education"));
const More = React.lazy(() => import("./../views/more"));
const Archive = React.lazy(() => import("./../views/archive"));
const Linktree = React.lazy(() => import("../views/linkTree.jsx"));
const StaticPage = React.lazy(() => import("./../views/staticPage"));

const RouteStaticPage = () => {
  const params = useParams();
  //console.log("SwtichLang", params);

  if (params?.name && /^([a-z]{2})$/.test(params?.name)) {
    setLanguage(params.name);
    return <Navigate replace to="/" />;
  }
  return <StaticPage />;
};

const RouteBulletin = () => {
  const params = useParams();

  if (params?.date && /^([0-9]{4}-[0-9]{2}-[0-9]{2})$/.test(params?.date))
    return <Bulletin />;
  else return <Navigate replace to="/bulletin/latest" />;
};

const App = () => {
  const locale = useStore($locale);
  const messages = useStore($messages);
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
    <IntlProvider locale={locale} messages={messages}>
      <BrowserRouter basename={config.projectRoot}>
        <Suspense fallback={"..."}>
          <Routes>
            <Route path="/">
              <Route index element={<Page></Page>} />
              <Route
                path="/bulletin/:date"
                element={
                  <Page>
                    <RouteBulletin />
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
                path="/weather/map/"
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
                path="/weather/archive"
                element={
                  <Page>
                    <StationArchive />
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
                    <RouteStaticPage />
                  </Page>
                }
              />
              <Route
                path="/:segment/:name"
                element={
                  <Page>
                    <RouteStaticPage />
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
