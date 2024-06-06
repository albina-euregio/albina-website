import React, { useEffect } from "react";
import { useRoute } from "wouter";
import Jumpnav from "./organisms/jumpnav";
import PageHeader from "./organisms/page-header";
import PageFooter from "./organisms/page-footer";
import ControlBar from "./organisms/control-bar";

const Page = ({ children }: React.PropsWithChildren) => {
  const [match] = useRoute("/bulletin");

  useEffect(() => {
    if (!match) {
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    }
  }, [match]);

  return (
    <>
      <div className="page-loading-screen" />
      <Jumpnav />

      <PageHeader />
      <main id="page-main" className="page-main">
        {import.meta.env.BASE_URL === "/dev/" && (
          <ControlBar
            style="yellow"
            message={
              <>
                This is a development version –{" "}
                <strong>no real data is shown!</strong>
              </>
            }
          />
        )}
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
