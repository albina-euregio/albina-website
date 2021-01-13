import React, { useCallback, useEffect, useState } from "react";

/**
 * @param {PushSubscription} subscription
 */
function updatePushSubscription(subscription, url) {
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
      language: window["appStore"].language,
      region: ""
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
  if (APP_ENVIRONMENT !== "dev") {
    // disable for now
    return false;
  }
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
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isWebPushSupported()) {
    return null;
  }

  const handleEnable = useCallback(async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.apiKeys.vapidPublicKey)
    });
    if (!subscription) return;
    await updatePushSubscription(subscription, `${config.apis.push}/subscribe`);
    setIsSubscribed(true);
  }, []);

  const handleDisable = useCallback(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
    await subscription.unsubscribe();
    await updatePushSubscription(
      subscription,
      `${config.apis.push}/unsubscribe`
    );
    setIsSubscribed(false);
  }, []);

  useEffect(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(Boolean(subscription));
  }, [setIsSubscribed]);

  return isSubscribed ? (
    <button className="pure-button" onClick={handleDisable}>
      Disable notifications
    </button>
  ) : (
    <button className="pure-button" onClick={handleEnable}>
      Enable notifications
    </button>
  );
}
