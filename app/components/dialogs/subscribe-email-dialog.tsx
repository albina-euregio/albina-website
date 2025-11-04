import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Link } from "react-router-dom";

import ProvinceFilter from "../filters/province-filter";
import LanguageFilter from "../filters/language-filter";
import { fetchText } from "../../util/fetch";
import { $province } from "../../appStore";
import { useStore } from "@nanostores/react";

export default function SubscribeEmailDialog() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [language, setLanguage] = useState(lang);
  const [region, setRegion] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState("");

  const province = useStore($province);
  useEffect(() => {
    if (province) {
      setRegion(province);
    }
  }, [province]);

  const handleSubmit = useCallback(async () => {
    const data = {
      language: language,
      regions: region,
      email: email
    };

    setStatus("loading");
    try {
      await fetchText(config.apis.subscribe + "/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      setStatus("submitted");
    } catch (reason) {
      setErrorMessage(String(reason));
      throw reason;
    }
  }, [setErrorMessage, email, language, region]);

  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  return (
    <>
      {!status && (
        <form
          className="pure-form pure-form-stacked"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            handleSubmit();
          }}
        >
          {!province && (
            <>
              <label htmlFor="province">
                <FormattedMessage
                  id="dialog:subscribe-email:region"
                  html={true}
                  values={{
                    strong: (...msg) => <strong key={msg}>{msg}</strong>
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
            </>
          )}

          {}
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

          <p>
            {}
            <label htmlFor="email">
              <FormattedMessage id="dialog:subscribe-email:email" />
              <span className="normal" />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="full-width"
              onChange={e => {
                const value = e.target.value;
                if (validateEmail(value)) {
                  setEmail(value);
                } else if (email) {
                  setEmail("");
                }
              }}
              placeholder={intl.formatMessage({
                id: "dialog:subscribe-email:email"
              })}
            />
          </p>

          <p className="">
            <label htmlFor="agree">
              <input
                id="agree"
                type="checkbox"
                onChange={e => setAgree(e.target.checked)}
                checked={!!agree}
              />
              &nbsp; &nbsp;
              {intl.formatMessage({
                id: "dialog:subscribe-email:subscribe:agree-before-link"
              })}
              <Link
                title={intl.formatMessage({
                  id: "dialog:subscribe-email:subscribe:agree-link"
                })}
                to="/more/privacy/"
                target="_blank"
              >
                {intl.formatMessage({
                  id: "dialog:subscribe-email:subscribe:agree-link"
                })}
              </Link>
              {intl.formatMessage({
                id: "dialog:subscribe-email:subscribe:agree-after-link"
              })}
            </label>
          </p>

          <button
            type="submit"
            className="pure-button"
            disabled={!(email && region && language && agree)}
          >
            {intl.formatMessage({
              id: "dialog:subscribe-email:subscribe:button"
            })}
          </button>
        </form>
      )}

      {(status || errorMessage) && agree && (
        <div className="field-2 panel">
          {status && (
            <p className="status-message">
              <FormattedMessage
                id={"dialog:subscribe-email:status:" + status}
                html={true}
                values={{
                  strong: (...msg) => <strong key={msg}>{msg}</strong>
                }}
              />
            </p>
          )}
          {errorMessage && (
            <p className="status-message">
              <strong className="error">
                {intl.formatMessage({
                  id: "dialog:subscribe-email:error"
                })}
              </strong>
              &nbsp;{errorMessage}
            </p>
          )}
        </div>
      )}
    </>
  );
}
