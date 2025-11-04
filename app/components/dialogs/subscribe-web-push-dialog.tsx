import React, { useCallback, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import ProvinceFilter from "../filters/province-filter";
import LanguageFilter from "../filters/language-filter";
import { isWebPushSupported } from "../../util/isWebPushSupported";
import { $province } from "../../appStore";
import { useStore } from "@nanostores/react";

import { z } from "zod/mini";

const PushSubscriptionSchema = z.object({
  endpoint: z.string(),
  auth: z.string(),
  p256dh: z.string(),
  language: z.nullish(z.string().check(z.minLength(2))),
  region: z.nullish(z.string().check(z.minLength(2)))
});

function updatePushSubscription(
  subscription: PushSubscription,
  url: string,
  language: string | undefined = undefined,
  region: string | undefined = undefined
) {
  const { endpoint, keys } = subscription.toJSON();
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(
      PushSubscriptionSchema.parse({
        endpoint: endpoint,
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
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Subscription via Web Push Notifications
 * @see https://developers.google.com/web/fundamentals/push-notifications
 */
export default function SubscribeWebPushDialog() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [language, setLanguage] = useState(lang);
  const [region, setRegion] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const province = useStore($province);
  useEffect(() => {
    if (province) {
      setRegion(province);
    }
  }, [province]);

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
          <FormattedMessage id="dialog:subscribe-web-push:subheader" />
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
          {!province && (
            <>
              <label htmlFor="province">
                <FormattedMessage
                  id="dialog:subscribe-web-push:region"
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
                className={region && "selectric-changed"}
                handleChange={r => setRegion(r)}
                value={region}
                none={intl.formatMessage({
                  id: "blog:filter:province:nothing-selected"
                })}
              />
            </>
          )}
          <label htmlFor="language">
            <FormattedMessage id="dialog:subscribe-web-push:language" />
            <span className="normal" />
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
