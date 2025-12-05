import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Jumpnav from "./organisms/jumpnav";
import PageHeader from "./organisms/page-header";
import PageFooter from "./organisms/page-footer";
import ControlBar from "./organisms/control-bar";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";

const Page = () => {
  const location = useLocation();
  const headless = useStore($headless);

  useEffect(() => {
    if (!location.pathname.split("/").includes("bulletin")) {
      if (!location.hash) {
        window.scrollTo(0, 0);
      }
    }
  }, [location.hash, location.pathname]);

  const dev = import.meta.env.BASE_URL === "/dev/" && (
    <ControlBar
      style="yellow"
      message={
        <>
          This is a development version –{" "}
          <strong>no real data is shown!</strong>
        </>
      }
    />
  );

  if (headless && config.headlessLogo) {
    return (
      <>
        <div id="page-header" className="page-header">
          <div className="page-header-logo">
            <Link to="/">
              <img src={config.headlessLogo} style={{ margin: 0 }} />
            </Link>
          </div>
        </div>
        <main id="page-main" className="page-main">
          {dev}
          <Outlet />
        </main>
      </>
    );
  } else if (headless) {
    return (
      <>
        {dev}
        <Outlet />
      </>
    );
  }

  return (
    <>
      <div className="page-loading-screen" />
      <Jumpnav />
      <PageHeader />
      <main id="page-main" className="page-main">
        {dev}
        <Outlet />
      </main>
      <PageFooter />
      <div
        id="tooltip-container"
        className="tooltip-container"
        style={{ display: "none" }}
      >
        <div className="tooltip-inner">
          <div className="tooltip-content"></div>
        </div>
      </div>
    </>
  );
};

export default Page;
