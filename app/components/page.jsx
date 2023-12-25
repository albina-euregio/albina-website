import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Jumpnav from "./organisms/jumpnav.jsx";
import PageHeader from "./organisms/page-header.jsx";
import PageFooter from "./organisms/page-footer.jsx";
import ControlBar from "../components/organisms/control-bar.jsx";
import { scroll_init, scroll } from "../js/scroll";

const Page = props => {
  const location = useLocation();
  const navigate = useNavigate();
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
    }
  });

  useEffect(() => {
    if (
      location.pathname === "" ||
      location.pathname === "/" ||
      location.pathname === "/bulletin"
    ) {
      //console.log("Page->useEffect[location.pathname]", location.path);
      navigate({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    } else {
      //console.log("Page->useEffect[location.pathname]", location.path);
      scroll_init();
      //tooltip_init();
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  useEffect(() => {
    //console.log("Page->useEffect hash #1", location.hash, location.pathname);
    if (!location.pathname.split("/").includes("bulletin")) {
      if (!location.hash) {
        //console.log("Page->useEffect hash #2", location.hash);
        window.scrollTo(0, 0);
      } else {
        //console.log("Page->useEffect hash #3", location.hash);
        setTimeout(() => scroll(location.hash, 2000), 1000);
      }
    }
  }, [location.hash]);

  //console.log("page->render", props.children);
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
        {props.children}
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
