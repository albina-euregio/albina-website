import React, { useContext, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import Modal from "../dialogs/albina-modal";
import SubscribeDialog from "../dialogs/subscribe-dialog";
import { scrollIntoView } from "../../util/scrollIntoView";
import { HeadlessContext } from "../../contexts/HeadlessContext.tsx";
import { $province } from "../../appStore";
import type { Temporal } from "temporal-polyfill";

interface Props {
  date: Temporal.PlainDate;
}

function BulletinButtonbar({ date }: Props) {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [isSubscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const headless = useContext(HeadlessContext);

  return (
    <section
      id="section-bulletin-linkbar"
      className="section-padding section-linkbar section-bulletin-linkbar top-fix"
    >
      {isSubscribeDialogOpen && (
        <Modal
          isOpen={isSubscribeDialogOpen}
          onClose={() => setSubscribeDialogOpen(false)}
        >
          <SubscribeDialog />
        </Modal>
      )}

      <div className="section-centered">
        <div className="grid linkbar">
          <div className="normal-4 grid-item">
            <a
              href={headless ? "#page-all" : "#page-main"}
              onClick={e => scrollIntoView(e)}
              className="icon-link icon-arrow-up"
            >
              <FormattedMessage id="bulletin:linkbar:back-to-map" />
            </a>
          </div>
          <div className="normal-8 grid-item">
            <ul className="list-inline bulletin-buttonbar">
              {!config.subscribe.buttonHidden && (
                <li>
                  <Tooltip
                    label={intl.formatMessage({
                      id: "bulletin:linkbar:subscribe:hover"
                    })}
                  >
                    <a
                      href="#"
                      onClick={e => {
                        setSubscribeDialogOpen(true);
                        e.preventDefault();
                      }}
                      className="pure-button"
                    >
                      {intl.formatMessage({
                        id: "bulletin:linkbar:subscribe"
                      })}
                    </a>
                  </Tooltip>
                </li>
              )}
              {date && (
                <>
                  <li>
                    <Tooltip
                      label={intl.formatMessage({
                        id: "bulletin:linkbar:caaml:hover"
                      })}
                    >
                      <a
                        target="_blank"
                        href={config.template(config.apis.bulletin.caamlv5, {
                          date: date,
                          region: `${$province.get()}_` || "EUREGIO_",
                          lang: intl.locale.slice(0, 2)
                        })}
                        download="caamlv5.xml"
                        className="pure-button"
                      >
                        {intl.formatMessage({
                          id: "bulletin:linkbar:caaml:v5"
                        })}
                      </a>
                    </Tooltip>
                  </li>
                  <li>
                    <Tooltip
                      label={intl.formatMessage({
                        id: "bulletin:linkbar:caaml:hover"
                      })}
                    >
                      <a
                        target="_blank"
                        href={config.template(config.apis.bulletin.xml, {
                          date: date,
                          region: `${$province.get()}_` || "EUREGIO_",
                          lang: intl.locale.slice(0, 2)
                        })}
                        download="caaml.xml"
                        className="pure-button"
                      >
                        {intl.formatMessage({
                          id: "bulletin:linkbar:caaml:v6"
                        })}
                      </a>
                    </Tooltip>
                  </li>
                </>
              )}
              {config.dialogs.feedback && (
                <li>
                  <Tooltip
                    label={intl.formatMessage({
                      id: "bulletin:feedback:hover"
                    })}
                  >
                    <a
                      href={config.links.feedback[lang]}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="success pure-button"
                    >
                      {intl.formatMessage({
                        id: "bulletin:feedback"
                      })}
                    </a>
                  </Tooltip>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BulletinButtonbar;
