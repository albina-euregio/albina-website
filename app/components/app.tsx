import React, { Suspense, useEffect } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useParams
} from "react-router-dom";
//import { ScrollContext } from "react-router-scroll";
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

const RouteStaticPage = () => {
  const params = useParams();
  //console.log("SwtichLang", params);

  if (params?.name && /^([a-z]{2})$/.test(params?.name)) {
    setLanguage(params.name);
    return <Navigate replace to="/" />;
  }
  return <StaticPage />;
};

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
    <BrowserRouter basename={config.projectRoot}>
      <Suspense fallback={"..."}>
        <Routes>
          {/* prettier-ignore */}
          <Route path="/headless">
            <Route index element={<Navigate replace to="bulletin/latest" />} />
            <Route path="bulletin/:date" element={<Bulletin headless={true} />} />
            <Route path="bulletin/latest" element={<Bulletin headless={true} />} />
          </Route>
          <Route path="/" element={<Page />}>
            <Route index element={<Navigate replace to="/bulletin/latest" />} />
            <Route
              path="/bulletin"
              element={<Navigate replace to="/bulletin/latest" />}
            />
            <Route path="/bulletin/:date" element={<Bulletin />} />
            <Route path="/bulletin/latest" element={<Bulletin />} />
            <Route path="/weather/map/:domain" element={<Weather />} />
            <Route path="/weather/map/" element={<Weather />} />
            <Route
              path="/weather/measurements"
              element={<StationMeasurements />}
            />
            <Route path="/weather/archive" element={<StationArchive />} />
            <Route path="/weather/stations" element={<StationMap />} />
            <Route path="/weather/snow-profiles" element={<SnowProfileMap />} />
            <Route
              path="/weather"
              element={<Navigate replace to="/weather/map" />}
            />
            <Route path="/education" element={<Education />} />
            <Route path="/blog/:blogName/:postId" element={<BlogPost />} />
            <Route path="/blog" element={<BlogOverview />} />
            <Route path="/more" element={<More />} />
            <Route path="/more/archive" element={<Archive />} />
            <Route path="/more/linktree" element={<Linktree />} />
            <Route
              path="/archive"
              element={<Navigate replace to="/more/archive" />}
            />
            <Route path="/education/*" element={<StaticPage />} />
            <Route path="/:name" element={<RouteStaticPage />} />
            <Route path="/:segment/:name" element={<RouteStaticPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
