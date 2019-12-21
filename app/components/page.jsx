import React from "react";
import { withRouter } from "react-router";
import Jumpnav from "./organisms/jumpnav.jsx";
import PageHeader from "./organisms/page-header.jsx";
import PageFooter from "./organisms/page-footer.jsx";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

import ModalDialog from "./modal-dialog";
import FollowDialog from "./dialogs/follow-dialog";
import SubscribeDialog from "./dialogs/subscribe-dialog";
import WeatherStationDiagrams from "./dialogs/weather-station-diagrams";
import DownloadPdfDialog from "./dialogs/download-pdf-dialog";
import SubscribeSocialMediaDialog from "./dialogs/subscribe-social-media-dialog";
import SubscribeAppDialog from "./dialogs/subscribe-app-dialog";
import SubscribeEmailDialog from "./dialogs/subscribe-email-dialog";
import SubscribeBlogDialog from "./dialogs/subscribe-blog-dialog";
import CookieConsent from "./dialogs/cookie-consent";
import FeedbackDialog from "./dialogs/feedback-dialog";

import { renderRoutes } from "react-router-config";
import { modal_init } from "../js/modal";
import { tooltip_init } from "../js/tooltip";
import { navigation_init } from "../js/navigation";
import { video_init } from "../js/video";

import { scroll_init } from "../js/scroll";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.hash = false;
  }

  componentDidUpdate() {
    this._didUpdate();
  }

  componentDidMount() {
    this._didUpdate();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.location && nextProps.location.hash) {
      if (this.hash !== nextProps.location.hash) {
        this.hash = nextProps.location.hash;
      }
    } else {
      this.hash = false;
    }

    if (
      nextProps.location !== this.props.location &&
      nextProps.history.action === "PUSH" &&
      !nextProps.location.hash
    ) {
      // do not scroll if bulletin region was clicked
      if (!nextProps.location.pathname.split("/").includes("bulletin")) {
        window.scrollTo(0, 0);
      }
      // scroll to top on forward page change (if no hash is set)
      // see https://github.com/ReactTraining/react-router/issues/2019
    }
  }

  _didUpdate() {
    // if the actual bulletin is active, change path to /latest
    if (
      this.props.location.pathname === "" ||
      this.props.location.pathname === "/" ||
      this.props.location.pathname === "/bulletin"
    ) {
      this.props.history.replace({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    }

    modal_init();
    tooltip_init();
    navigation_init();
    video_init();
    scroll_init();
  }

  render() {
    return (
      <>
        <PageLoadingScreen />
        {false && <Jumpnav />}

        <PageHeader />
        <main id="page-main" className="page-main">
          {APP_ENVIRONMENT === "dev" && (
            <section class="section controlbar controlbar-notice">
              <div class="section-centered">
                <p class="align-center">
                  This is a development version –{" "}
                  <strong>no real data is shown!</strong>
                </p>
              </div>
            </section>
          )}
          {renderRoutes(this.props.route.routes)}
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
        <ModalDialog id="subscribeSocialMediaDialog">
          <SubscribeSocialMediaDialog />
        </ModalDialog>
        <ModalDialog id="subscribeAppDialog">
          <SubscribeAppDialog />
        </ModalDialog>
        {config.get("dialogs.cookieConsent") && <CookieConsent />}
        {config.get("dialogs.feedback") && <FeedbackDialog />}
      </>
    );
  }
}

export default inject("locale")(injectIntl(withRouter(Page)));
