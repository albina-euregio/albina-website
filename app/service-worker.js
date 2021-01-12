/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
const sw = self;

sw.addEventListener("push", event => {
  const data = event.data.json();
  const icon = "/assets/logo_mark_en.svg";
  sw.registration.showNotification(data.title, {
    body: data.body,
    icon: icon
  });
});

sw.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(sw.clients.openWindow("https://avalanche.report/"));
});
