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
// import CookieConsent from "./dialogs/cookie-consent";
// import FeedbackDialog from "./dialogs/feedback-dialog";
import ControlBar from "../components/organisms/control-bar.jsx";

import { renderRoutes } from "react-router-config";
import { modal_init } from "../js/modal";
import { tooltip_init } from "../js/tooltip";
import { navigation_init } from "../js/navigation";

import { scroll_init } from "../js/scroll";

class Page extends React.Component {
  componentDidMount() {
    this._didUpdate();
  }

  componentDidUpdate() {
    this._didUpdate();
  }

  _didUpdate() {
    modal_init();
    tooltip_init();
    navigation_init();
    scroll_init();
  }

  render() {
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
        {/* {config.dialogs.cookieConsent && <CookieConsent />} */}
        {/* {config.dialogs.feedback && <FeedbackDialog />} */}
      </>
    );
  }
}

export default injectIntl(withRouter(Page));
