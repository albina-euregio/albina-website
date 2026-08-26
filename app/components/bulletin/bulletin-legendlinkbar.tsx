import React, { useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { warnlevelNumbers } from "../../util/warn-levels";
import { Tooltip } from "../tooltips/tooltip";
import Modal from "../dialogs/albina-modal";
import SubscribeDialog from "../dialogs/subscribe-dialog";
import { $province } from "../../appStore";
import { BulletinCollection } from "../../stores/bulletin";
import { useStore } from "@nanostores/react";
import { EnabledLanguages } from "./bulletin-glossary.js";
const BulletinInternalGlossaryText = React.lazy(
  () => import("./internal-glossary/internal-glossary-text.js")
);

interface Props {
  activeBulletinCollection: BulletinCollection;
}

function BulletinLegendLinkbar({ activeBulletinCollection }: Props) {
  const intl = useIntl();
  const province = useStore($province);
  const [isSubscribeDialogOpen, setSubscribeDialogOpen] = useState(false);

  const caamlXML =
    activeBulletinCollection &&
    config.template(config.apis.bulletin.xml, {
      date: activeBulletinCollection.date.toString(),
      region: `${province || "EUREGIO"}_`,
      lang: intl.locale.slice(0, 2)
    });
  const caamlJSON =
    activeBulletinCollection &&
    config.template(config.apis.bulletin.json, {
      date: activeBulletinCollection.date.toString(),
      region: `${province || "EUREGIO"}_`,
      lang: intl.locale.slice(0, 2)
    });
  return (
    <section
      id="section-bulletin-legendlinkbar"
      className="section-padding section-bulletin-legend section-bulletin-linkbar section-bulletin-legendlinkbar"
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
          <div className="normal-6 grid-item">
            <p>
              <a href="/education/danger-scale">
                <FormattedMessage
                  id="bulletin:legend:danger-levels"
                  html={true}
                  values={{
                    strong: (...msg) => <strong>{msg}</strong>
                  }}
                />
              </a>
            </p>
            <ul className="list-inline list-legend">
              {Object.entries(warnlevelNumbers).map(
                ([id, num]) =>
                  num > 0 && (
                    <li key={id} className={`warning-level-${num}`}>
                      <span>
                        <strong>{num}</strong>{" "}
                        <a href={`/education/danger-scale/#level${num}`}>
                          <BulletinInternalGlossaryText
                            text={intl.formatMessage({
                              id: `caaml:dangerRating.${id}`
                            })}
                            locale={intl.locale.slice(0, 2) as EnabledLanguages}
                            textKey={"danger-scale-" + num}
                          />
                        </a>
                      </span>
                    </li>
                  )
              )}
            </ul>
          </div>
          <div className="normal-6 grid-item">
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
                      {intl.formatMessage({ id: "bulletin:linkbar:subscribe" })}
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
                        rel="noreferrer"
                        href={caamlXML}
                        download={caamlXML.split("/").pop()}
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
                        rel="noreferrer"
                        href={caamlJSON}
                        download={caamlJSON.split("/").pop()}
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

export default BulletinLegendLinkbar;
