import React, { useState } from "react";
import { FormattedMessage } from "../../i18n";
import SubscribeAppDialog from "./subscribe-app-dialog";
import SubscribeEmailDialog from "./subscribe-email-dialog";
import SubscribeTelegramDialog, {
  getTelegramUrl
} from "./subscribe-telegram-dialog";
import SubscribeWhatsappDialog, {
  getWhatsAppUrl
} from "./subscribe-whatsapp-dialog";
import SubscribeWebPushDialog from "./subscribe-web-push-dialog";
import { isWebPushSupported } from "../../util/isWebPushSupported";
import { useStore } from "@nanostores/react";
import { $province, mainLanguages } from "../../appStore.ts";

export default function SubscribeDialog() {
  const province = useStore($province);
  let dialogTypes = [
    "WebPush" as const,
    "Telegram" as const,
    "WhatsApp" as const,
    "Email" as const,
    "App" as const
  ];
  const [selectedDialog, selectDialog] = useState<
    (typeof dialogTypes)[number] | null
  >(null);
  if (!isWebPushSupported()) {
    dialogTypes = dialogTypes.filter(t => t !== "WebPush");
  }
  if (province && !mainLanguages.some(l => getTelegramUrl(province, l))) {
    dialogTypes = dialogTypes.filter(t => t !== "Telegram");
  }
  if (province && !mainLanguages.some(l => getWhatsAppUrl(province, l))) {
    dialogTypes = dialogTypes.filter(t => t !== "WhatsApp");
  }

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
                              : type === "WhatsApp"
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
          {selectedDialog === "WhatsApp" && <SubscribeWhatsappDialog />}
          {selectedDialog === "Email" && <SubscribeEmailDialog />}
          {selectedDialog === "App" && <SubscribeAppDialog />}
        </div>
      </div>
    </>
  );
}
