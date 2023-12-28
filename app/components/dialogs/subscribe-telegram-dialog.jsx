import React, { useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import ProvinceFilter from "../filters/province-filter";
import LanguageFilter from "../filters/language-filter";

export default function SubscribeTelegramDialog() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [language, setLanguage] = useState(lang);
  const [region, setRegion] = useState("");
  const [status] = useState(undefined);
  const [errorMessage] = useState(undefined);
  const telegramChannels = config.subscribe.telegram;

  return (
    <div className="modal-subscribe-telegram">
      <div className="modal-header">
        <h2>
          <FormattedMessage id="dialog:subscribe-telegram:subheader" />
        </h2>
      </div>

      {!status && (
        <form
          className="pure-form pure-form-stacked"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            if (region && language)
              window.open(telegramChannels[region + "-" + language]);
          }}
        >
          <label htmlFor="province">
            <FormattedMessage
              id="dialog:subscribe-email:region"
              values={{
                strong: (...msg) => <strong>{msg}</strong>
              }}
            />
          </label>
          <ProvinceFilter
            buttongroup={true}
            title={intl.formatMessage({
              id: "measurements:filter:province"
            })}
            handleChange={r => setRegion(r !== "none" ? r : false)}
            value={region}
            none={intl.formatMessage({
              id: "blog:filter:province:nothing-selected"
            })}
          />
          <label htmlFor="language">
            <FormattedMessage id="dialog:subscribe-email:language" />
          </label>
          <LanguageFilter
            buttongroup={true}
            title={intl.formatMessage({
              id: "measurements:filter:province"
            })}
            handleChange={l => setLanguage(l)}
            value={language}
          />
          <button
            type="submit"
            className="pure-button"
            disabled={region && language ? "" : "disabled"}
          >
            {intl.formatMessage({
              id: "dialog:subscribe-telegram:subscribe:button"
            })}
          </button>
        </form>
      )}
      {errorMessage && (
        <div className="field-2 panel">
          <p className="status-message">
            <strong className="error">
              {intl.formatMessage({
                id: "dialog:subscribe-web-push:error"
              })}
            </strong>
            &nbsp;{errorMessage}
          </p>
        </div>
      )}
    </div>
  );
}
