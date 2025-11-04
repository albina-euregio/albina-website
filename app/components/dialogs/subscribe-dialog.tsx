import React, { useState } from "react";
import { FormattedMessage } from "../../i18n";
import SubscribeAppDialog from "./subscribe-app-dialog";
import SubscribeEmailDialog from "./subscribe-email-dialog";
import SubscribeTelegramDialog from "./subscribe-telegram-dialog";
import SubscribeWhatsappDialog from "./subscribe-whatsapp-dialog";
import SubscribeWebPushDialog from "./subscribe-web-push-dialog";
import { isWebPushSupported } from "../../util/isWebPushSupported";

export default function SubscribeDialog() {
  const dialogTypes = isWebPushSupported()
    ? (["WebPush", "Telegram", "Whatsapp", "Email", "App"] as const)
    : (["Telegram", "Whatsapp", "Email", "App"] as const);
  const [selectedDialog, selectDialog] =
    useState<(typeof dialogTypes)[number]>(null);
  return (
    <>
      <div className="modal-container">
        <div className=" modal-subscribe">
          <>
            <div className="modal-header">
              <h2 className="subheader">
                <FormattedMessage id="dialog:subscribe:header" />
              </h2>
              <h2>
                <FormattedMessage id="dialog:subscribe:subheader" />
              </h2>
              <FormattedMessage id="dialog:subscribe:description" />
            </div>

            <div className="pure-form pure-form-stacked">
              <label htmlFor="input">
                <FormattedMessage
                  id="dialog:subscribe:select-subscription"
                  html={true}
                  values={{
                    span: (...msg) => (
                      <span className="normal" key={msg}>
                        {msg}
                      </span>
                    )
                  }}
                />
              </label>
              <ul className="list-inline list-buttongroup-dense">
                {dialogTypes.map(type => (
                  <li key={type}>
                    <button
                      className={
                        selectedDialog === type
                          ? "pure-button"
                          : "inverse pure-button"
                      }
                      onClick={() => selectDialog(type)}
                    >
                      <FormattedMessage
                        id={
                          type === "WebPush"
                            ? "dialog:subscribe:web-push"
                            : type === "Telegram"
                              ? "dialog:subscribe:telegram"
                              : type === "Whatsapp"
                                ? "dialog:subscribe:whatsapp"
                                : type === "Email"
                                  ? "dialog:subscribe:email"
                                  : type === "App"
                                    ? "dialog:subscribe:app"
                                    : undefined
                        }
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>

          {selectedDialog === "WebPush" && <SubscribeWebPushDialog />}
          {selectedDialog === "Telegram" && <SubscribeTelegramDialog />}
          {selectedDialog === "Whatsapp" && <SubscribeWhatsappDialog />}
          {selectedDialog === "Email" && <SubscribeEmailDialog />}
          {selectedDialog === "App" && <SubscribeAppDialog />}
        </div>
      </div>
    </>
  );
}
