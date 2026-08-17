import React, { useState } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import Modal from "../dialogs/albina-modal";
import SubscribeDialog from "../dialogs/subscribe-dialog";
import { $province } from "../../appStore";
import { BulletinCollection } from "../../stores/bulletin";
import { useStore } from "@nanostores/react";

interface Props {
  activeBulletinCollection: BulletinCollection;
}

function BulletinButtonbar({ activeBulletinCollection }: Props) {
  const intl = useIntl();
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
          <div className="grid-item">
            <ul className="list-inline list-buttongroup">
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
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BulletinButtonbar;
