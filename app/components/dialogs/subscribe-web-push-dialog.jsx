import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { APP_STORE } from "../../appStore";
import ProvinceFilter from "../filters/province-filter";

/**
 * @param {PushSubscription} subscription
 */
function updatePushSubscription(subscription, url, language = "", region = "") {
  const { endpoint, keys } = subscription.toJSON();
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      endpoint: endpoint,
      auth: keys.auth,
      p256dh: keys.p256dh,
      language,
      region
    })
  });
}

/**
 * @param {string} base64String
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isWebPushSupported() {
  return (
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "PushManager" in window
  );
}

/**
 * Subscription via Web Push Notifications
 * @see https://developers.google.com/web/fundamentals/push-notifications
 */
export default function SubscribeWebPushDialog() {
  const [language, setLanguage] = useState(APP_STORE.language);
  const [region, setRegion] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const intl = useIntl();

  const handleEnable = useCallback(async () => {
    setErrorMessage(undefined);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw intl.formatMessage({
          id: "dialog:subscribe-web-push:error:no-permission"
        });
      }
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          config.apiKeys.vapidPublicKey
        )
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
    } catch (reason) {
      setErrorMessage(String(reason));
      throw reason;
    }
  }, [setErrorMessage, language, region, intl]);

  const handleDisable = useCallback(async () => {
    setErrorMessage(undefined);
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration.pushManager.getSubscription();
      if (!subscription) return;
      await subscription.unsubscribe();
      await updatePushSubscription(
        subscription,
        `${config.apis.push}/unsubscribe`
      );
      setIsSubscribed(false);
    } catch (reason) {
      setErrorMessage(String(reason));
      throw reason;
    }
  }, [setErrorMessage, setIsSubscribed]);

  useEffect(() => {
    (async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(Boolean(subscription));
      } catch (reason) {
        setErrorMessage(String(reason));
        throw reason;
      }
    })();
  }, [setErrorMessage, setIsSubscribed]);

  if (!isWebPushSupported()) {
    return null;
  }

  return (
    <div className="modal-subscribe-telegram">
      <div className="modal-header">
        <h2>
          <FormattedMessage id="dialog:subscribe-telegram:subheader" />
        </h2>
      </div>

      {isSubscribed && (
        <button
          type="submit"
          className="pure-button"
          onClick={() => handleDisable()}
        >
          {intl.formatMessage({
            id: "dialog:subscribe-web-push:disable"
          })}
        </button>
      )}

      {!isSubscribed && (
        <form
          className="pure-form pure-form-stacked"
          onSubmit={event => {
            event.preventDefault();
            event.stopPropagation();
            handleEnable();
          }}
        >
          <label htmlFor="province">
            <FormattedMessage
              id="dialog:subscribe-telegram:region"
              values={{
                strong: (...msg) => <strong>{msg}</strong>
              }}
            />
          </label>
          <ul className="list-inline list-buttongroup">
            <li>
              <ProvinceFilter
                title={intl.formatMessage({
                  id: "measurements:filter:province"
                })}
                className={region && "selectric-changed"}
                handleChange={r => setRegion(r)}
                value={region}
                none={intl.formatMessage({
                  id: "blog:filter:province:nothing-selected"
                })}
              />
            </li>
          </ul>
          <label htmlFor="language">
            <FormattedMessage id="dialog:subscribe-telegram:language" />
            <span className="normal" />
          </label>
          <ul className="list-inline list-subscribe-language">
            {APP_STORE.mainLanguages.map(l => (
              <li key={l}>
                <label className="pure-checkbox">
                  <input
                    name="language"
                    onChange={() => setLanguage(l)}
                    value={l}
                    type="radio"
                    checked={language === l ? "checked" : ""}
                  />
                  &nbsp;
                  <span className="normal">{l.toUpperCase()}</span>
                </label>
              </li>
            ))}
          </ul>
          <button
            type="submit"
            className="pure-button"
            disabled={region && language ? "" : "disabled"}
          >
            {intl.formatMessage({
              id: "dialog:subscribe-web-push:enable"
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
