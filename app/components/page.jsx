import React from "react";
import { withRouter } from "react-router";
import PageLoadingScreen from "./organisms/page-loading-screen.jsx";
import Jumpnav from "./organisms/jumpnav.jsx";
import PageHeader from "./organisms/page-header.jsx";
import PageFooter from "./organisms/page-footer.jsx";
import MenuStore from "../stores/menuStore";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import DocumentMeta from "react-document-meta";

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

import { renderRoutes } from "react-router-config";
import { modal_init } from "../js/modal";
import { tooltip_init } from "../js/tooltip";
import { navigation_init } from "../js/navigation";
import { video_init } from "../js/video";

import { scroll_init, scroll } from "../js/scroll";

@observer
class Page extends React.Component {
  constructor(props) {
    super(props);
    this.menuStore = new MenuStore();
    this.hash = false;
    window["menuStore"] = this.menuStore;
  }

  _setLanguage() {
    // url lang param

    // url parameter
    if (!appStore.setLanguage(Base.searchGet("lang"))) {
      console.log(window.localStorage.getItem("locale"));
      if (!appStore.setLanguage(window.localStorage.getItem("locale"))) {
        // config language
        if (!appStore.setLanguage(config.get("defaults.language"))) {
          // browser setting
          let browserLangSettings = window.navigator.language
            ? window.navigator.language
            : "";
          browserLangSettings = window.navigator.browserLanguage
            ? window.navigator.browserLanguage
            : "";

          browserLangSettings = browserLangSettings.substr(0, 2).toLowerCase();

          if (!appStore.setLanguage(browserLangSettings)) {
            // fallback to en
            appStore.setLanguage("en");
          }
        }
      }
    }

    // change searchLang parameter we are in blog subpage

    // change url if needed
    Base.searchChange(this.props.history, { lang: appStore.language }, true);

    document.title = this.props.intl.formatMessage({
      id: "app:title"
    });
    document.documentElement.lang = appStore.language;
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
    console.log("url changing", this.hash, this.props.location);

    if (
      this.props.location.pathname === "" ||
      this.props.location.pathname === "/" ||
      this.props.location.pathname === "/bulletin"
    ) {
      console.log("applying latest");
      this.props.history.push("bulletin/latest");
    }
    this._setLanguage();

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
    const meta = {
      title: this.props.intl.formatMessage({
        id: "app:title"
      }),
      description: "avalanche forecast",
      canonical: "avalanche.report",
      meta: {
        property: {
          "twitter:card": "avalanche.report"
        }
      }
    };
    return (
      <div>
        <DocumentMeta {...meta}>
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
          {/*
          we do not need cookie anymore
        <CookieConsent />
        */}
        </DocumentMeta>
      </div>
    );
  }
}

export default inject("locale")(injectIntl(withRouter(Page)));
