import React, { useEffect } from "react";
import { useNavigate, createSearchParams, useLocation } from "react-router-dom";
import Jumpnav from "./organisms/jumpnav.jsx";
import PageHeader from "./organisms/page-header.jsx";
import PageFooter from "./organisms/page-footer.jsx";
import { injectIntl } from "react-intl";

import ModalDialog from "./modal-dialog";
import FollowDialog from "./dialogs/follow-dialog";
import SubscribeDialog from "./dialogs/subscribe-dialog";
import WeatherStationDiagrams from "./dialogs/weather-station-diagrams";
import DownloadPdfDialog from "./dialogs/download-pdf-dialog";
import SubscribeTelegramDialog from "./dialogs/subscribe-telegram-dialog";
import SubscribeAppDialog from "./dialogs/subscribe-app-dialog";
import SubscribeEmailDialog from "./dialogs/subscribe-email-dialog";
import SubscribeBlogDialog from "./dialogs/subscribe-blog-dialog";
// import CookieConsent from "./dialogs/cookie-consent";
// import FeedbackDialog from "./dialogs/feedback-dialog";
import ControlBar from "../components/organisms/control-bar.jsx";

import { modal_init } from "../js/modal";
import { tooltip_init } from "../js/tooltip";
import { navigation_init } from "../js/navigation";

import { scroll_init } from "../js/scroll";

const Page = props => {
  let hash = false;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Page->useEffect", props, location, document.location);
    if (props && location && location.hash) {
      if (hash !== location.hash) {
        hash = location.hash;
      }
    } else {
      hash = false;
    }

    if (location !== location && !location.hash) {
      // do not scroll if bulletin region was clicked
      if (!location.pathname.split("/").includes("bulletin")) {
        window.scrollTo(0, 0);
      }
      // scroll to top on forward page change (if no hash is set)
      // see https://github.com/ReactTraining/react-router/issues/2019
    }

    // if the actual bulletin is active, change path to /latest
    if (
      location.pathname === "" ||
      location.pathname === "/" ||
      location.pathname === "/bulletin"
    ) {
      console.log("Page navigate", location.path);
      navigate({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    }

    modal_init();
    tooltip_init();
    navigation_init();
    scroll_init();
  });
  console.log("page->render", props.children);
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
      <ModalDialog id="weatherStationDiagrams">
        <WeatherStationDiagrams />
      </ModalDialog>
      <ModalDialog id="subscribeDialog">
        <SubscribeDialog />
      </ModalDialog>
      <ModalDialog id="downloadPdfDialog">
        <DownloadPdfDialog />
      </ModalDialog>
      <ModalDialog id="followDialog">
        <FollowDialog />
      </ModalDialog>
      <ModalDialog id="subscribeEmailDialog">
        <SubscribeEmailDialog />
      </ModalDialog>
      <ModalDialog id="subscribeBlogDialog">
        <SubscribeBlogDialog />
      </ModalDialog>
      <ModalDialog id="subscribeTelegramDialog">
        <SubscribeTelegramDialog />
      </ModalDialog>
      <ModalDialog id="subscribeAppDialog">
        <SubscribeAppDialog />
      </ModalDialog>
      {/* {config.dialogs.cookieConsent && <CookieConsent />} */}
      {/* {config.dialogs.feedback && <FeedbackDialog />} */}
    </>
  );
};

export default injectIntl(Page);
