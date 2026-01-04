import React, { useEffect } from "react";
import Jumpnav from "./organisms/jumpnav";
import PageHeader from "./organisms/page-header";
import PageFooter from "./organisms/page-footer";
import ControlBar from "./organisms/control-bar";
import { useStore } from "@nanostores/react";
import { $headless } from "../appStore";
import { $router } from "./router";

interface Props {
  children: React.ReactNode;
}

const Page = ({ children }: Props) => {
  const page = useStore($router);
  const headless = useStore($headless);

  useEffect(() => {
    if (!page?.path.split("/").includes("bulletin")) {
      if (!page?.hash) {
        window.scrollTo(0, 0);
      }
    }
  }, [page]);

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
            <a href="/">
              <img src={config.headlessLogo} style={{ margin: 0 }} />
            </a>
          </div>
        </div>
        <main id="page-main" className="page-main">
          {dev}
          {children}
        </main>
      </>
    );
  } else if (headless) {
    return (
      <>
        {dev}
        {children}
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
        {children}
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
