// IMPORTED FROM - mobx-react-intl
// There is an issue with mobx4 - see this issue: https://github.com/Sqooba/mobx-react-intl/issues/19
// use the version here until that issue is fixed.
import { observable } from "mobx";
import { createElement } from "react";
import { inject, observer } from "mobx-react";
import { IntlProvider } from "react-intl";

var _formatMessage = require("format-message");
var LOCALE = "locale";
var LocaleStore = /** @class */ (function() {
  function LocaleStore(defaultLocale, translations) {
    var _this = this;
    this._locale = observable.box(""); // the locale value
    this.formatMessage = function(id, values) {
      if (!(id in _this.messages)) {
        console.warn("Id not found in intl list: " + id);
        return id;
      }
      return _formatMessage(_this.messages[id], values);
    };
    this.translations = translations;
    if (typeof Storage !== "undefined") {
      var storedLocale = localStorage.getItem(LOCALE);
      if (storedLocale && storedLocale in translations) {
        this.value = storedLocale;
      } else {
        this.value = defaultLocale;
      }
    } else {
      this.value = defaultLocale;
    }
  }

  Object.defineProperty(LocaleStore.prototype, "value", {
    get: function() {
      return this._locale.get();
    },
    set: function(value) {
      if (typeof Storage !== "undefined") {
        localStorage.setItem(LOCALE, value);
      }
      this._locale.set(value);
    },
    enumerable: true,
    configurable: true
  });

  Object.defineProperty(LocaleStore.prototype, "messages", {
    get: function() {
      return this.translations[this.value];
    },
    enumerable: true,
    configurable: true
  });
  return LocaleStore;
})();

var __assign =
  (undefined && undefined.__assign) ||
  Object.assign ||
  function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s)
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
var __rest =
  (undefined && undefined.__rest) ||
  function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
        if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
  };
var MobxIntlProviderChild = function(_a) {
  var locale = _a.locale,
    children = _a.children,
    props = __rest(_a, ["locale", "children"]);
  var loc = locale.value;
  var messages = locale.messages;
  return createElement(
    IntlProvider,
    __assign({ key: loc, locale: loc, messages: messages }, props),
    children
  );
};
var MobxIntlProvider = inject("locale")(observer(MobxIntlProviderChild));

export { LocaleStore, MobxIntlProvider };
//# sourceMappingURL=mobx-react-intl.es5.js.map
