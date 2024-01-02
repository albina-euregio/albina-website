import React, { useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import Modal from "../dialogs/albina-modal";
import SubscribeDialog from "../dialogs/subscribe-dialog";
import DownloadPdfDialog from "../dialogs/download-pdf-dialog";
import { scrollIntoView } from "../../util/scrollIntoView";
import type { BulletinCollection } from "../../stores/bulletin";

type Props = {
  showPdfDialog: boolean;
  activeBulletinCollection: BulletinCollection;
};

function BulletinButtonbar({ showPdfDialog, activeBulletinCollection }: Props) {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [isSubscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
  const [isPdfDialogOpen, setPdfDialogOpen] = useState(false);

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
      {isPdfDialogOpen && (
        <Modal isOpen={isPdfDialogOpen} onClose={() => setPdfDialogOpen(false)}>
          <DownloadPdfDialog
            activeBulletinCollection={activeBulletinCollection}
          />
        </Modal>
      )}

      <div className="section-centered">
        <div className="grid linkbar">
          <div className="normal-4 grid-item">
            <a
              href="#page-main"
              onClick={e => scrollIntoView(e)}
              className="icon-link icon-arrow-up"
            >
              <FormattedMessage id="bulletin:linkbar:back-to-map" />
            </a>
          </div>
          <div className="normal-8 grid-item">
            <ul className="list-inline bulletin-buttonbar">
              {showPdfDialog && (
                <li>
                  <Tooltip
                    label={intl.formatMessage({
                      id: "bulletin:linkbar:pdf:hover"
                    })}
                  >
                    <a
                      href="#"
                      onClick={e => {
                        setPdfDialogOpen(true);
                        e.preventDefault();
                      }}
                      className="pure-button"
                    >
                      {intl.formatMessage({
                        id: "bulletin:linkbar:pdf"
                      })}
                    </a>
                  </Tooltip>
                </li>
              )}
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
