var Base = {
  clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
  },

  checkBlendingSupport() {
    const bodyEl = document.getElementsByTagName("body")[0];
    const bodyElStyle = window.getComputedStyle(bodyEl);
    const blendMode = bodyElStyle.getPropertyValue("mix-blend-mode");
    return !!blendMode;
  }
};

module.exports = Base;
