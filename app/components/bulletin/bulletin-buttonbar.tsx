import React, { useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import Modal from "../dialogs/albina-modal";
import SubscribeDialog from "../dialogs/subscribe-dialog";
import { scrollIntoView } from "../../util/scrollIntoView";
import { $province } from "../../appStore";
import { BulletinCollection } from "../../stores/bulletin";
import { useStore } from "@nanostores/react";

interface Props {
  activeBulletinCollection: BulletinCollection;
}

function BulletinButtonbar({ activeBulletinCollection }: Props) {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const province = useStore($province);
  const [isSubscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

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
              href="#page-all"
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
              {activeBulletinCollection?.status === "ok" && (
                <>
                  <li>
                    <Tooltip
                      label={intl.formatMessage({
                        id: "bulletin:linkbar:caaml:hover"
                      })}
                    >
                      <a
                        target="_blank"
                        href={config.template(config.apis.bulletin.xml, {
                          date: activeBulletinCollection.date.toString(),
                          region: `${province || "EUREGIO"}_`,
                          lang: intl.locale.slice(0, 2)
                        })}
                        download="caaml.xml"
                        className="pure-button"
                      >
                        XML
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
                        href={config.template(config.apis.bulletin.json, {
                          date: activeBulletinCollection.date.toString(),
                          region: `${province || "EUREGIO"}_`,
                          lang: intl.locale.slice(0, 2)
                        })}
                        download="caaml.json"
                        className="pure-button"
                      >
                        JSON
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
