import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import ProvinceFilter from "../filters/province-filter";
import LanguageFilter from "../filters/language-filter";
import { eawsRegion } from "../../stores/eawsRegions";
import { $province, Language, mainLanguages } from "../../appStore";
import { useStore } from "@nanostores/react";

export function getTelegramUrl(region: string, language: Language) {
  const urls = eawsRegion(region)?.aws[0].url;
  if (!urls) return;
  return urls[`telegram:${language}`];
}

export default function SubscribeTelegramDialog() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [language, setLanguage] = useState<Language>(lang as Language);
  const [region, setRegion] = useState("");
  const [status] = useState(undefined);
  const [errorMessage] = useState(undefined);

  const province = useStore($province);
  useEffect(() => {
    if (province) {
      setRegion(province);
    }
  }, [province]);

  function openTelegram() {
    if (!region || !language) return;
    const url = getTelegramUrl(region, language);
    if (!url) return;
    window.open(url);
  }

  return (
    <>
      {!status && (
        <form
          className="pure-form pure-form-stacked"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            openTelegram();
          }}
        >
          {!province && (
            <>
              <label htmlFor="province">
                <FormattedMessage
                  id="dialog:subscribe-telegram:region"
                  html={true}
                  values={{
                    strong: (...msg) => <strong key={msg}>{msg}</strong>
                  }}
                />
              </label>
              <ProvinceFilter
                regionCodes={config.regionCodes.filter(r =>
                  mainLanguages.some(language => getTelegramUrl(r, language))
                )}
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
          <label htmlFor="language">
            <FormattedMessage id="dialog:subscribe-telegram:language" />
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
            disabled={!(region && language)}
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
                id: "dialog:subscribe-telegram:error"
              })}
            </strong>
            &nbsp;{errorMessage}
          </p>
        </div>
      )}
    </>
  );
}
