import React, { useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import SubscribeAppDialog from "./subscribe-app-dialog";
import SubscribeEmailDialog from "./subscribe-email-dialog";
import SubscribeTelegramDialog from "./subscribe-telegram-dialog";
import SubscribeWebPushDialog, {
  isWebPushSupported
} from "./subscribe-web-push-dialog";

export default function SubscribeDialog() {
  const intl = useIntl();
  const [selectedDialog, selectDialog] = useState(null);
  const dialogTypes = isWebPushSupported()
    ? ["WebPush", "Telegram", "Email", "App"]
    : ["Telegram", "Email", "App"];
  return (
    <>
      <div className="modal-container">
        <div className=" modal-subscribe">
          <div className="modal-subscribe-overview">
            <div className="modal-header">
              <h2 className="subheader">
                <FormattedMessage id="dialog:subscribe:header" />
              </h2>
              <h2>
                <FormattedMessage id="dialog:subscribe:subheader" />
              </h2>
              <FormattedMessage id="dialog:subscribe:description" />
            </div>

            <form className="pure-form pure-form-stacked">
              <label htmlFor="input">
                <FormattedMessage
                  id="dialog:subscribe:select-subscription"
                  values={{
                    span: (...msg) => <span className="normal">{msg}</span>
                  }}
                />
              </label>
              <ul className="list-inline list-buttongroup-dense">
                {dialogTypes.map(type => (
                  <li key={type}>
                    <a
                      href="#"
                      className={
                        selectedDialog === type
                          ? "pure-button"
                          : "inverse pure-button"
                      }
                      onClick={e => {
                        e.preventDefault();
                        selectDialog(type);
                      }}
                    >
                      {intl.formatMessage({
                        id:
                          type === "WebPush"
                            ? "dialog:subscribe:web-push"
                            : type === "Telegram"
                            ? "dialog:subscribe:telegram"
                            : type === "Email"
                            ? "dialog:subscribe:email"
                            : type === "App"
                            ? "dialog:subscribe:app"
                            : undefined
                      })}
                    </a>
                  </li>
                ))}
              </ul>
            </form>
          </div>

          {selectedDialog === "WebPush" && <SubscribeWebPushDialog />}
          {selectedDialog === "Telegram" && <SubscribeTelegramDialog />}
          {selectedDialog === "Email" && <SubscribeEmailDialog />}
          {selectedDialog === "App" && <SubscribeAppDialog />}
        </div>
      </div>
    </>
  );
}
