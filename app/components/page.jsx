import React from "react";
import { withRouter } from "react-router";
import PageLoadingScreen from "./organisms/page-loading-screen.jsx";
import Jumpnav from "./organisms/jumpnav.jsx";
import PageHeader from "./organisms/page-header.jsx";
import PageFooter from "./organisms/page-footer.jsx";
import MenuStore from "../stores/menuStore";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import { dateToISODateString, latest } from "../util/date.js";

import Base from "./../base";
import ModalDialog from "./modal-dialog";
import FollowDialog from "./dialogs/follow-dialog";
import SubscribeDialog from "./dialogs/subscribe-dialog";
import DonwloadPdfDialog from "./dialogs/dowload-pdf";
import SubscribeSocialMediaDialog from "./dialogs/subscribe-social-media-dialog";
import SubscribeAppDialog from "./dialogs/subscribe-app-dialog";
import SubscribeEmailDialog from "./dialogs/subscribe-email-dialog";
import SubscribeBlogDialog from "./dialogs/subscribe-blog-dialog";
import UnsupportedBrowserDialog from "./../components/dialogs/unsupported-browser-dialog";
import CookieConsent from "./dialogs/cookie-consent";
import FeedbackDialog from "./dialogs/feedback-dialog";

import { renderRoutes } from "react-router-config";
import { modal_init } from "../js/modal";
import { tooltip_init } from "../js/tooltip";
import { navigation_init } from "../js/navigation";
import { video_init } from "../js/video";

import { scroll_init, scroll } from "../js/scroll";

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.menuStore = new MenuStore();
    this.hash = false;
    window["menuStore"] = this.menuStore;
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
      this.props.location.pathname === "/bulletin" ||
      (window.bulletinStore && window.bulletinStore.latest && this.props.location.pathname === "/bulletin/" + window.bulletinStore.latest)
    ) {
      this.props.history.push({
        pathname: "/bulletin/latest",
        search: document.location.search.substring(1)
      });
    }

    //this._setLanguage();

    /*
    if (this.hash && this.hash !== this.props.location.hash) {
      this.props.history.push({ hash: this.hash });
    }
    */

    modal_init();
    tooltip_init();
    navigation_init();
    video_init();
    scroll_init();
  }

  render() {
    return (
      <div>
        <PageLoadingScreen />
        {false && <Jumpnav />}
        <div id="page-all" className="page-all">
          <PageHeader menuStore={this.menuStore} />
          <main id="page-main" className="page-main">
            <div id="global-grid">
              {renderRoutes(this.props.route.routes)}
            </div>
          </main>
          <PageFooter menuStore={this.menuStore} />
        </div>
        {appStore.unsupportedBrowserModal && <UnsupportedBrowserDialog />}
        <ModalDialog id="subscribeDialog">
          <SubscribeDialog />
        </ModalDialog>
        <ModalDialog id="downloadPdfDialog">
          <DonwloadPdfDialog />
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
      </div>
    );
  }
}

export default inject("locale")(injectIntl(withRouter(Page)));
