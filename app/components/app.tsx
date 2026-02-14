import React, { Suspense, useEffect } from "react";
import "@iframe-resizer/child";
import { useStore } from "@nanostores/react";
import { redirectPage } from "@nanostores/router";
import { $router } from "./router";

window.iFrameResizer = {
  sizeSelector: "#page-all"
};

import { $headless, $province, setLanguage } from "../appStore";
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
const StaticPageLinkbox = React.lazy(
  () => import("../views/staticPageLinkbox")
);
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

  const router = useStore($router);
  const province = router?.search?.province ?? config.province;
  // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps (run once)
  useEffect(() => $province.set(province), []);
  const headless = router?.search?.headless ?? config.headless;
  // oxlint-disable-next-line eslint-plugin-react-hooks/exhaustive-deps (run once)
  useEffect(() => $headless.set(!!headless), []);

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
      case "conditionsProfiles":
        return <BlogPostList isTechBlog={false} isProfileBlog={true} />;
      case "conditions":
      case "terrain":
      case "education":
      case "more":
        return <StaticPageLinkbox />;
      case "blogNamePost":
        return <BlogPost />;
      case "blogTech":
        return <BlogPostList isTechBlog={true} isProfileBlog={false} />;
      case "blog":
        return <BlogPostList isTechBlog={false} isProfileBlog={false} />;
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
    <Suspense fallback={"..."}>
      <Page>{component()}</Page>
    </Suspense>
  );
};

export default App;
