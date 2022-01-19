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

// const App = props => {
//   const params = useParams();
//   let routes = useRoutes([
//     {
//       path: "/",
//       element: <Bulletin />,
//       indexRoute: {
//         element: <Bulletin />
//       },
//       routes: [
//         {
//           path: "/bulletin/:date([0-9]{4}-[0-9]{2}-[0-9]{2})?",
//           element: <Bulletin />
//         },
//         {
//           path: "/bulletin/latest?",
//           element: <Bulletin />
//         },
//         {
//           path: "/weather/map/:domain?",
//           exact: true,
//           element: <Weather />
//         },
//         {
//           path: "/weather/measurements",
//           exact: true,
//           element: <StationMeasurements />
//         },
//         {
//           path: "/weather/stations",
//           exact: true,
//           element: <StationMap />
//         },
//         {
//           path: "/weather/snow-profiles",
//           exact: true,
//           element: <SnowProfileMap />
//         },
//         {
//           path: "/weather/incidents",
//           exact: true,
//           element: <SnowProfileMap />
//         },
//         {
//           path: "/weather",
//           exact: true,
//           element: <Navigate replace to="/weather/map" />
//         },
//         {
//           path: "/education",
//           exact: true,
//           element: <Education />
//         },
//         {
//           path: "/blog/:blogName/:postId",
//           element: <BlogPost />
//         },
//         {
//           path: "/blog",
//           exact: true,
//           element: <BlogOverview />
//         },
//         {
//           path: "/more",
//           exact: true,
//           element: <More />
//         },
//         {
//           path: "/more/archive",
//           exact: true,
//           element: <Archive />
//         },
//         {
//           path: "/more/linktree",
//           exact: true,
//           element: <Linktree />
//         },
//         {
//           path: "/archive",
//           exact: true,
//           element: <Navigate replace to="/more/archive" />
//         },
//         {
//           path: "/:lang([a-z]{2})",
//           component: ({ match }) => {
//             const lang = params?.lang;
//             APP_STORE.setLanguage(lang);
//             return <Navigate replace to="/" />;
//           }
//         },
//         {
//           // NOTE: 404 error will be handled by StaticPage, since we do not
//           // know which pages reside on the CMS in this router config
//           path: "/:name",
//           element: <StaticPage />
//         }
//       ]
//     }
//   ]);

//   return routes;
// };

const SwtichLang = () => {
  const params = useParams();
  console.log("SwtichLang", params);
  useEffect(() => {
    if ((lang = params?.lang)) APP_STORE.setLanguage(lang);
  });
  return <Navigate replace to="/" />;
};

const AppWrapper = () => {
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

  console.log("Appwrapper", config);
  return (
    <IntlProvider locale={APP_STORE.language} messages={APP_STORE.messages}>
      <BrowserRouter basename={config.projectRoot}>
        <Suspense fallback={"..."}>
          <Routes>
            <Route path="/" element={<Page></Page>}>
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
              <Route path="/weather" element={<Navigate to="/weather/map" />} />
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
                element={<Navigate to="/more/archive" />}
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

export default observer(AppWrapper);
