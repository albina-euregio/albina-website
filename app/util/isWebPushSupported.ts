export function isWebPushSupported(): boolean {
  return (
    "serviceWorker" in navigator &&
    "Notification" in window &&
    "PushManager" in window
  );
}
