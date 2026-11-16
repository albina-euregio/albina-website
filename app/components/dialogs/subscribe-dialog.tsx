import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { useStore } from "@nanostores/react";
import * as v from "valibot";
import { $province, Language } from "../../appStore";
import { $router } from "../router";
import { eawsRegion } from "../../stores/eawsRegions";
import { vPushSubscription } from "../../api/valibot.gen";
import { fetchText } from "../../util/fetch";
import { isWebPushSupported } from "../../util/isWebPushSupported";
import { Tooltip } from "../tooltips/tooltip";
import ProvinceFilter from "../filters/province-filter";
import LanguageFilter from "../filters/language-filter";

const channels = [
  "web-push",
  "telegram",
  "whatsapp",
  "email",
  "app",
  "facebook",
  "instagram",
  "youtube"
] as const;
type Channel = (typeof channels)[number];

function messengerUrl(
  channel: "telegram" | "whatsapp",
  region: string,
  language: Language
): string | undefined {
  return eawsRegion(region)?.aws[0].url?.[`${channel}:${language}`];
}

function apps(region: string) {
  return config.subscribe.apps.filter(
    a => !a.regions || a.regions.includes(region)
  );
}

const socialMedia: Partial<Record<Channel, string>> = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube"
};

function socialMediaUrl(channel: Channel, region: string): string | undefined {
  return eawsRegion(region)?.aws[0].url?.[channel];
}

function languagesFor(channel: Channel, region: string): Language[] {
  switch (channel) {
    case "telegram":
    case "whatsapp":
      return config.mainLanguages.filter(l => messengerUrl(channel, region, l));
    case "web-push":
    case "email":
      return config.mainLanguages;
    default:
      return [];
  }
}

function isAvailable(channel: Channel, region: string) {
  switch (channel) {
    case "web-push":
      return isWebPushSupported();
    case "app":
      return apps(region).length > 0;
    case "facebook":
    case "instagram":
    case "youtube":
      return !!socialMediaUrl(channel, region);
    default:
      return languagesFor(channel, region).length > 0;
  }
}

export default function SubscribeDialog() {
  const intl = useIntl();
  const province = useStore($province);
  const router = useStore($router);
  const mapRegion = String(router?.search?.region ?? "");
  const [region, setRegion] = useState(
    () =>
      config.regionCodes.find(r => mapRegion.startsWith(r)) ||
      province ||
      (config.regionCodes.length === 1 ? config.regionCodes[0] : "")
  );
  const [channel, setChannel] = useState<Channel>();
  const [language, setLanguage] = useState<Language | undefined>(
    intl.locale.slice(0, 2) as Language
  );

  const available = region ? channels.filter(c => isAvailable(c, region)) : [];
  const activeChannel =
    channel && available.includes(channel) ? channel : undefined;
  const languages = activeChannel ? languagesFor(activeChannel, region) : [];
  const activeLanguage =
    language && languages.includes(language) ? language : undefined;

  return (
    <div className="modal-container">
      <div className="modal-subscribe">
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
          {config.regionCodes.length > 1 && (
            <>
              <label>
                <FormattedMessage
                  id="dialog:subscribe:region"
                  html={true}
                  values={{
                    strong: (...msg) => <strong key="strong">{msg}</strong>
                  }}
                />
              </label>
              <ProvinceFilter
                buttongroup={true}
                handleChange={setRegion}
                value={region}
              />
            </>
          )}

          {region && (
            <>
              <label>
                <FormattedMessage
                  id="dialog:subscribe:select-subscription"
                  html={true}
                  values={{
                    span: (...msg) => (
                      <span className="normal" key="span">
                        {msg}
                      </span>
                    )
                  }}
                />
              </label>
              <ul className="list-inline list-buttongroup-dense">
                {available.map(c => (
                  <li key={c}>
                    <button
                      className={
                        activeChannel === c
                          ? "pure-button"
                          : "inverse pure-button"
                      }
                      onClick={() => setChannel(c)}
                    >
                      {socialMedia[c] ?? (
                        <FormattedMessage id={`dialog:subscribe:${c}`} />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {languages.length > 0 && (
            <>
              <label>
                <FormattedMessage id="dialog:subscribe:language" />
              </label>
              <LanguageFilter
                buttongroup={true}
                languages={languages}
                handleChange={l => setLanguage(l as Language)}
                value={activeLanguage ?? ""}
              />
            </>
          )}
        </div>

        {activeLanguage &&
          (activeChannel === "telegram" || activeChannel === "whatsapp") && (
            <a
              className="pure-button"
              href={messengerUrl(activeChannel, region, activeLanguage)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <FormattedMessage
                id={`dialog:subscribe-${activeChannel}:subscribe:button`}
              />
            </a>
          )}
        {activeChannel === "web-push" && activeLanguage && (
          <WebPush region={region} language={activeLanguage} />
        )}
        {activeChannel === "email" && activeLanguage && (
          <Email region={region} language={activeLanguage} />
        )}
        {activeChannel === "app" && <Apps region={region} />}
        {activeChannel && socialMedia[activeChannel] && (
          <a
            className="pure-button"
            href={socialMediaUrl(activeChannel, region)}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FormattedMessage
              id="footer:follow-us:hover"
              values={{ on: socialMedia[activeChannel] }}
            />
          </a>
        )}
      </div>
    </div>
  );
}

interface ChannelProps {
  region: string;
  language: Language;
}

function ErrorMessage({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <div className="field-2 panel">
      <p className="status-message">
        <strong className="error">
          <FormattedMessage id={id} />
        </strong>
        &nbsp;{message}
      </p>
    </div>
  );
}

function Apps({ region }: { region: string }) {
  const intl = useIntl();
  return (
    <>
      {apps(region).map(a => (
        <div className="app-dl" key={a.name}>
          <img
            className="app-logo"
            src={"/images/pro/apps/" + a.logo}
            title={a.name}
            alt={a.name}
          />
          <h2 className="subheader">{a.name}</h2>
          <ul className="list-inline list-buttongroup">
            {(Object.keys(a.url) as ("android" | "ios")[])
              .map(t => (
                <li key={t}>
                  <Tooltip
                    label={intl.formatMessage({
                      id: `dialog:subscribe-app:${t}:hover`
                    })}
                  >
                    <a
                      className="pure-button"
                      href={a.url[t]}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <FormattedMessage
                        id={`dialog:subscribe-app:${t}:button`}
                      />
                    </a>
                  </Tooltip>
                </li>
              ))
              .reduce((prev, curr) => [
                prev,
                <li key="or">
                  <span className="buttongroup-boolean">
                    <FormattedMessage id="dialog:subscribe-app:or" />
                  </span>
                </li>,
                curr
              ])}
          </ul>
        </div>
      ))}
    </>
  );
}

function Email({ region, language }: ChannelProps) {
  const intl = useIntl();
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = useCallback(async () => {
    setStatus("loading");
    try {
      await fetchText(config.apis.subscribe + "/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, regions: region, email })
      });
      setStatus("submitted");
    } catch (reason) {
      setErrorMessage(String(reason));
      throw reason;
    }
  }, [email, language, region]);

  return (
    <>
      {!status && (
        <form
          className="pure-form pure-form-stacked"
          onSubmit={event => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <p>
            <label htmlFor="email">
              <FormattedMessage id="dialog:subscribe-email:email" />
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="full-width"
              onChange={e =>
                setEmail(
                  /\S+@\S+\.\S+/.test(e.target.value) ? e.target.value : ""
                )
              }
              placeholder={intl.formatMessage({
                id: "dialog:subscribe-email:email"
              })}
            />
          </p>
          <p>
            <label htmlFor="agree">
              <input
                id="agree"
                type="checkbox"
                onChange={e => setAgree(e.target.checked)}
                checked={agree}
              />
              &nbsp; &nbsp;
              <FormattedMessage id="dialog:subscribe-email:subscribe:agree-before-link" />
              <a href="/more/privacy/" target="_blank">
                <FormattedMessage id="dialog:subscribe-email:subscribe:agree-link" />
              </a>
              <FormattedMessage id="dialog:subscribe-email:subscribe:agree-after-link" />
            </label>
          </p>
          <button
            type="submit"
            className="pure-button"
            disabled={!(email && region && language && agree)}
          >
            <FormattedMessage id="dialog:subscribe-email:subscribe:button" />
          </button>
        </form>
      )}
      {status && (
        <div className="field-2 panel">
          <p className="status-message">
            <FormattedMessage
              id={"dialog:subscribe-email:status:" + status}
              html={true}
              values={{
                strong: (...msg) => <strong key="strong">{msg}</strong>
              }}
            />
          </p>
        </div>
      )}
      <ErrorMessage id="dialog:subscribe-email:error" message={errorMessage} />
    </>
  );
}

function updatePushSubscription(
  subscription: PushSubscription,
  url: string,
  language?: string,
  region?: string
) {
  const { endpoint, keys } = subscription.toJSON();
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      v.parse(vPushSubscription, {
        endpoint,
        auth: keys.auth,
        p256dh: keys.p256dh,
        language,
        region
      })
    )
  });
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

/**
 * @see https://developers.google.com/web/fundamentals/push-notifications
 */
function WebPush({ region, language }: ChannelProps) {
  const intl = useIntl();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isSubscribed, setIsSubscribed] = useState(false);

  const run = (action: () => Promise<void>) => async () => {
    setErrorMessage(undefined);
    try {
      await action();
    } catch (reason) {
      setErrorMessage(String(reason));
      throw reason;
    }
  };

  const handleEnable = run(async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw intl.formatMessage({
        id: "dialog:subscribe-web-push:error:no-permission"
      });
    }
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.apiKeys.vapidPublicKey)
    });
    if (!subscription) {
      throw intl.formatMessage({
        id: "dialog:subscribe-web-push:error:no-subscription"
      });
    }
    await updatePushSubscription(
      subscription,
      `${config.apis.push}/subscribe`,
      language,
      region
    );
    setIsSubscribed(true);
  });

  const handleDisable = run(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
    await subscription.unsubscribe();
    await updatePushSubscription(
      subscription,
      `${config.apis.push}/unsubscribe`
    );
    setIsSubscribed(false);
  });

  useEffect(() => {
    run(async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(Boolean(subscription));
    })();
  }, []);

  return (
    <>
      <button
        className="pure-button"
        onClick={isSubscribed ? handleDisable : handleEnable}
        disabled={!isSubscribed && !(region && language)}
      >
        <FormattedMessage
          id={
            isSubscribed
              ? "dialog:subscribe-web-push:disable"
              : "dialog:subscribe-web-push:enable"
          }
        />
      </button>
      <ErrorMessage
        id="dialog:subscribe-web-push:error"
        message={errorMessage}
      />
    </>
  );
}
