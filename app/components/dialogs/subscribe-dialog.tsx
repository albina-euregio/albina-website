import React, { useState } from "react";
import { FormattedMessage } from "../../i18n";
import SubscribeAppDialog from "./subscribe-app-dialog";
import SubscribeEmailDialog from "./subscribe-email-dialog";
import SubscribeTelegramDialog from "./subscribe-telegram-dialog";
import SubscribeWebPushDialog, {
  isWebPushSupported
} from "./subscribe-web-push-dialog";

export default function SubscribeDialog() {
  const dialogTypes = isWebPushSupported()
    ? (["WebPush", "Telegram", "Email", "App"] as const)
    : (["Telegram", "Email", "App"] as const);
  const [selectedDialog, selectDialog] =
    useState<(typeof dialogTypes)[number]>(null);
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
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label htmlFor="input">
                <FormattedMessage
                  id="dialog:subscribe:select-subscription"
                  html={true}
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
                      <FormattedMessage
                        id={
                          type === "WebPush"
                            ? "dialog:subscribe:web-push"
                            : type === "Telegram"
                              ? "dialog:subscribe:telegram"
                              : type === "Email"
                                ? "dialog:subscribe:email"
                                : type === "App"
                                  ? "dialog:subscribe:app"
                                  : undefined
                        }
                      />
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
