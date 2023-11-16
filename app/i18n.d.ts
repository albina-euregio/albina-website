import messages from "./i18n/en.json";
import regions from "eaws-regions/public/micro-regions_names/en.json";

type addPrefixToObject<T, P extends string> = {
  [K in keyof T as K extends string ? `${P}${K}` : never]: T[K];
};

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof messages | `regions:${keyof typeof regions}`;
    }
  }
}

export {};
