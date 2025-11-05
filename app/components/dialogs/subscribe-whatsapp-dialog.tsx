import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import ProvinceFilter from "../filters/province-filter";
import LanguageFilter from "../filters/language-filter";
import { eawsRegion } from "../../stores/eawsRegions";
import { $province, Language, mainLanguages } from "../../appStore";
import { useStore } from "@nanostores/react";

export function getWhatsAppUrl(region: string, language: Language) {
  const urls = eawsRegion(region)?.aws[0].url;
  if (!urls) return;
  return urls[`whatsapp:${language}`];
}

export default function SubscribeWhatsappDialog() {
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

  function openWhatsapp() {
    if (!region || !language) return;
    const url = getWhatsAppUrl(region, language);
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
            openWhatsapp();
          }}
        >
          {!province && (
            <>
              <label htmlFor="province">
                <FormattedMessage
                  id="dialog:subscribe-whatsapp:region"
                  html={true}
                  values={{
                    strong: (...msg) => <strong key={msg}>{msg}</strong>
                  }}
                />
              </label>
              <ProvinceFilter
                regionCodes={config.regionCodes.filter(r =>
                  mainLanguages.some(language => getWhatsAppUrl(r, language))
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
            <FormattedMessage id="dialog:subscribe-whatsapp:language" />
          </label>
          <LanguageFilter
            languages={mainLanguages.filter(
              l => !region || getWhatsAppUrl(region, l)
            )}
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
              id: "dialog:subscribe-whatsapp:subscribe:button"
            })}
          </button>
        </form>
      )}
      {errorMessage && (
        <div className="field-2 panel">
          <p className="status-message">
            <strong className="error">
              {intl.formatMessage({
                id: "dialog:subscribe-whatsapp:error"
              })}
            </strong>
            &nbsp;{errorMessage}
          </p>
        </div>
      )}
    </>
  );
}
