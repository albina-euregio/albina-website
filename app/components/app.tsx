import React, { Suspense, useEffect } from "react";
import "@iframe-resizer/child";
import { useStore } from "@nanostores/react";
import { $router } from "./router";
import { redirectPage } from "@nanostores/router";

window.iFrameResizer = {
  sizeSelector: "#page-all"
};

import { BrowserRouter } from "react-router-dom";
import { setLanguage, $province, $headless } from "../appStore";
import Page from "./page";

import "../css/style.scss"; // CSS overrides

const Bulletin = React.lazy(() => import("../views/bulletin"));
const BlogPostList = React.lazy(() => import("../views/blogPostList"));
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
  const page = useStore($router);
  //console.log("SwtichLang", params);

  if (
    (page?.route === "staticName" || page?.route === "staticSegmentName") &&
    page?.params?.name &&
    /^([a-z]{2})$/.test(page?.params?.name)
  ) {
    setLanguage(page.params.name);
    redirectPage($router, "home");
    return;
  }
  return <StaticPage />;
};

const App = () => {
  const page = useStore($router);
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

  const search = new URLSearchParams(document.location.search);
  const province = search.get("province") ?? config.province;
  useEffect(() => $province.set(province), [province]);
  const headless = search.get("headless") ?? config.headless;
  useEffect(() => $headless.set(!!headless), [headless]);

  useEffect(() => {
    if (province) {
      document.body.parentElement?.setAttribute("data-province", province);
    } else {
      document.body.parentElement?.removeAttribute("data-province");
    }
  }, [province]);

  useEffect(() => {
    if (headless) {
      document.body.parentElement?.setAttribute("data-headless", "");
    } else {
      document.body.parentElement?.removeAttribute("data-headless");
    }
  }, [headless]);

  function component(): React.ReactNode {
    switch (page?.route) {
      case "home":
        redirectPage($router, "bulletinLatest");
        break;
      case "bulletin":
        redirectPage($router, "bulletinLatest");
        break;
      case "bulletinDate":
      case "bulletinLatest":
        return <Bulletin />;
      case "weather":
        redirectPage($router, "weatherMap");
        break;
      case "weatherMap":
      case "weatherMapDomain":
      case "weatherMapDomainTimestamp":
        return <Weather />;
      case "weatherMeasurements":
        return <StationMeasurements />;
      case "weatherArchive":
        return <StationArchive />;
      case "weatherStations":
        return <StationMap />;
      case "weatherSnowProfiles":
        return <SnowProfileMap />;
      case "education":
        return <Education />;
      case "blogNamePost":
        return <BlogPost />;
      case "blogTech":
        return <BlogPostList isTechBlog={true} />;
      case "blog":
        return <BlogPostList isTechBlog={false} />;
      case "more":
        return <More />;
      case "moreArchive":
        return <Archive />;
      case "moreLinkTree":
        return <Linktree />;
      case "archive":
        redirectPage($router, "moreArchive");
        break;
      case "educationStar":
      case "staticName":
      case "staticSegmentName":
        return <RouteStaticPage />;
    }
  }

  return (
    <BrowserRouter basename={config.projectRoot}>
      {/* FIXME */}
      <Suspense fallback={"..."}>
        <Page>{component()}</Page>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
