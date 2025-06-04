import messages from "./i18n/en.json";
import regions from "@eaws/micro-regions_names/en.json";

declare global {
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof messages | `regions:${keyof typeof regions}`;
    }
  }
}

export {};
