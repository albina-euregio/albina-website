/// <reference no-default-lib="true"/>
/// <reference lib="es2015" />
/// <reference lib="webworker" />

/**
 * @type {ServiceWorkerGlobalScope}
 */
const sw = self;

sw.addEventListener("push", event => {
  const data = event.data.json();
  sw.registration.showNotification(data.title, {
    data: data,
    body: data.body,
    image: data.image || data.icon
  });
});

sw.addEventListener("notificationclick", event => {
  event.notification.close();
  const url = event.notification.data.url || "https://avalanche.report/";
  event.waitUntil(sw.clients.openWindow(url));
});
