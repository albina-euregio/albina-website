// polyfill for `new CustomEvent` required by vanilla-tilt
// see https://gitlab.com/albina-euregio/albina-website/issues/329 and https://gitlab.com/albina-euregio/albina-website/issues/329
// taken from https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent

function CustomEvent(event, params) {
  params = params || { bubbles: false, cancelable: false, detail: null };
  var evt = document.createEvent("CustomEvent");
  evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return evt;
}

if (typeof window.CustomEvent !== "function") {
  window.CustomEvent = CustomEvent;
}
