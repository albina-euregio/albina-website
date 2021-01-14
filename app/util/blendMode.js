export function isBlendingSupported() {
  const bodyEl = document.getElementsByTagName("body")[0];
  const bodyElStyle = window.getComputedStyle(bodyEl);
  const blendMode = bodyElStyle.getPropertyValue("mix-blend-mode");
  return !!blendMode;
}
