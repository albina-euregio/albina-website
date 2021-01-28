import React from "react";
import { withRouter } from "react-router";
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
import CookieConsent from "./dialogs/cookie-consent";
import FeedbackDialog from "./dialogs/feedback-dialog";

import { renderRoutes } from "react-router-config";
import { modal_init } from "../js/modal";
import { tooltip_init } from "../js/tooltip";
import { navigation_init } from "../js/navigation";

import { scroll_init } from "../js/scroll";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.hash = false;
  }

  componentDidMount() {
    this._didUpdate();
  }

  componentDidUpdate() {
    if (this.props && this.props.location && this.props.location.hash) {
      if (this.hash !== this.props.location.hash) {
        this.hash = this.props.location.hash;
      }
    } else {
      this.hash = false;
    }

    if (
      this.props.location !== this.props.location &&
      this.props.history.action === "PUSH" &&
      !this.props.location.hash
    ) {
      // do not scroll if bulletin region was clicked
      if (!this.props.location.pathname.split("/").includes("bulletin")) {
        window.scrollTo(0, 0);
      }
      // scroll to top on forward page change (if no hash is set)
      // see https://github.com/ReactTraining/react-router/issues/2019
    }
    this._didUpdate();
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
    scroll_init();
  }

  render() {
    return (
      <>
        <div className="page-loading-screen" />
        {false && <Jumpnav />}

        <PageHeader />
        <main id="page-main" className="page-main">
          {APP_ENVIRONMENT === "dev" && (
            <section className="section controlbar controlbar-dev">
              <div className="section-centered">
                <p className="align-center">
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
        <ModalDialog id="subscribeTelegramDialog">
          <SubscribeTelegramDialog />
        </ModalDialog>
        <ModalDialog id="subscribeAppDialog">
          <SubscribeAppDialog />
        </ModalDialog>
        {config.dialogs.cookieConsent && <CookieConsent />}
        {config.dialogs.feedback && <FeedbackDialog />}
      </>
    );
  }
}

export default injectIntl(withRouter(Page));
