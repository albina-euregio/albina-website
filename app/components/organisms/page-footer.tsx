import React, { useState } from "react";
import { useIntl } from "../../i18n";
import Menu from "../menu";
// import SmFollow from "./sm-follow.jsx";
import FooterLogos from "./footer-logos.jsx";

import { Tooltip } from "../tooltips/tooltip";
import Modal from "../dialogs/albina-modal";
import SubscribeDialog from "../dialogs/subscribe-dialog";
import { scrollIntoView } from "../../util/scrollIntoView";

const license = import.meta.env.APP_LICENSE; // included via vite.config.js
const repository = import.meta.env.APP_REPOSITORY; // included via vite.config.js
const version = import.meta.env.APP_VERSION; // included via vite.config.js
const versionDate = import.meta.env.APP_VERSION_DATE; // included via vite.config.js

const PageFooter = () => {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [isSubscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  return (
    <div id="page-footer" className="page-footer">
      {isSubscribeDialogOpen && (
        <Modal
          isOpen={isSubscribeDialogOpen}
          onClose={() => setSubscribeDialogOpen(false)}
        >
          <SubscribeDialog />
        </Modal>
      )}
      <section className="section section-padding page-footer-navigation">
        <div className="grid">
          <div className="grid-item normal-6">
            <Menu
              className="list-inline footer-navigation footer-navigation-more"
              entries={config.menuFooter}
            />
            <Menu
              className="list-plain footer-navigation footer-navigation-main"
              entries={config.menuFooterMain}
            />
          </div>
          <div className="grid-item normal-6">
            {!config.subscribe.buttonHidden && (
              <p className="page-footer-subscribe">
                <Tooltip
                  label={intl.formatMessage({
                    id: "footer:subscribe:hover"
                  })}
                  html={true}
                >
                  <a
                    href="#"
                    onClick={e => {
                      setSubscribeDialogOpen(true);
                      e.preventDefault();
                    }}
                    title={intl.formatMessage({
                      id: "footer:subscribe:hover"
                    })}
                    className="pure-button"
                  >
                    {intl.formatMessage({
                      id: "footer:subscribe"
                    })}
                  </a>
                </Tooltip>
              </p>
            )}
            <p className="page-footer-text">
              <a href={repository} rel="noopener noreferrer" target="_blank">
                albina-website {version}
              </a>
              , {versionDate}, {license}
            </p>

            <p className="page-footer-logo-tertiary">
              <Tooltip
                label={intl.formatMessage({
                  id: "footer:eaws:hover"
                })}
              >
                <a
                  href={config.links.eaws}
                  className="footer-logo-tertiary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>EAWS</span>
                </a>
              </Tooltip>
            </p>

            <p className="page-footer-logo-secondary">
              <Tooltip
                label={intl.formatMessage({
                  id: "footer:euregio:hover"
                })}
              >
                <a
                  href={config.template(config.links.euregio, { lang })}
                  className="header-footer-logo-secondary"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Euregio</span>
                </a>
              </Tooltip>
            </p>
          </div>
          <div className="grid-item all-12">
            <p className="page-footer-top">
              <Tooltip
                label={intl.formatMessage({
                  id: "footer:top:hover"
                })}
              >
                <a
                  href="#page-main"
                  onClick={e => scrollIntoView(e)}
                  className="icon-arrow-up"
                  aria-label={intl.formatMessage({
                    id: "footer:top:hover"
                  })}
                >
                  <span>Top</span>
                </a>
              </Tooltip>
            </p>
          </div>
        </div>
      </section>
      {!config.footer.iconsHidden && <FooterLogos />}

      {/* <SmFollow /> */}
    </div>
  );
};

export default PageFooter;
