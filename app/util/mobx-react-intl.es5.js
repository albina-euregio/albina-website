// IMPORTED FROM - mobx-react-intl
// https://github.com/Sqooba/mobx-react-intl/pull/20/files
// -    this._locale = observable(""); // the locale value
// +    this._locale = observable.box(""); // the locale value
// Also, for the storage detection, our storageAvailable() is used.

import { observable } from "mobx";
import * as React from "react";
import { inject, observer } from "mobx-react";
import { IntlProvider } from "react-intl";
import { storageAvailable } from "./storage";
const _formatMessage = require("format-message");
const LOCALE = "locale";
export class LocaleStore {
  constructor(defaultLocale, translations) {
    this.storageAvailable = storageAvailable();
    this._locale = observable.box(""); // the locale value
    this.formatMessage = (id, values) => {
      if (!(id in this.messages)) {
        console.warn("Id not found in intl list: " + id);
        return id;
      }
      return _formatMessage(this.messages[id], values);
    };
    this.translations = translations;
    if (this.storageAvailable) {
      const storedLocale = localStorage.getItem(LOCALE);
      if (storedLocale && storedLocale in translations) {
        this.value = storedLocale;
      } else {
        this.value = defaultLocale;
      }
    } else {
      this.value = defaultLocale;
    }
  }
  get value() {
    return this._locale.get();
  }
  set value(value) {
    if (this.storageAvailable) {
      localStorage.setItem(LOCALE, value);
    }
    this._locale.set(value);
  }
  get messages() {
    return this.translations[this.value];
  }
}

const MobxIntlProviderChild = ({ locale, children, ...props }) => {
  const loc = locale.value;
  const messages = locale.messages;
  return React.createElement(
    IntlProvider,
    Object.assign({ key: loc, locale: loc, messages: messages }, props),
    children
  );
};
export const MobxIntlProvider = inject("locale")(
  observer(MobxIntlProviderChild)
);
