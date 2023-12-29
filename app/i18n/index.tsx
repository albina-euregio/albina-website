import React from "react";
import htmr from "htmr";
import { $locale, $messages } from "../appStore";
import { computed } from "nanostores";
import { useStore } from "@nanostores/react";
import reactStringReplace from "react-string-replace";

const templateRe = /\{ *([\w_ -]+) *\}/g;
type MessageId = keyof (typeof $messages)["value"];

const format = computed($locale, code => ({
  number(num: number, opts: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat(code, opts).format(num);
  },
  relativeTime(
    num: number,
    unit: Intl.RelativeTimeFormatUnit,
    opts: Intl.RelativeTimeFormatOptions
  ) {
    return new Intl.RelativeTimeFormat(code, opts).format(num, unit);
  },
  time(date: Date | number | string, opts: Intl.DateTimeFormatOptions) {
    if (typeof date === "string") date = Date.parse(date);
    if (!isFinite(+date)) return "";
    return new Intl.DateTimeFormat(code, opts).format(date);
  }
}));

export function useIntl() {
  const locale = useStore($locale);
  const t = useStore($messages);
  const formatter = useStore(format);

  return {
    locale,
    formatDate: formatter.time,
    formatNumber: formatter.number,
    formatMessage: (
      { id }: { id: MessageId },
      values: Record<string, string> = undefined
    ) =>
      typeof values !== "object"
        ? t[id]
        : reactStringReplace(t[id], templateRe, match => values[match])
  };
}

type FormattedMessageProps =
  | {
      id: MessageId;
      values?: Record<string, string>;
      html?: undefined;
    }
  | {
      id: MessageId;
      values?: Record<
        string,
        string | ((children: React.ReactElement) => React.ReactElement)
      >;
      html: true;
    };

export const FormattedMessage = ({
  id,
  values,
  html
}: FormattedMessageProps) => {
  const t = useStore($messages);
  let message = t[id] ?? id;
  if (typeof values !== "object") {
    return <>{message}</>;
  } else if (html) {
    message = message.replace(templateRe, (str, match) => values[match]);
    return htmr(message, {
      transform: {
        _: (element, props, children) => {
          return values[element]?.(children) ?? element;
        }
      }
    });
  } else {
    return reactStringReplace(t[id], templateRe, match => values[match]);
  }
};

/**
 * @deprecated
 */
export function newLegacyIntl() {
  return Object.freeze({
    locale: $locale.get(),
    formatDate: format.get().time,
    formatNumber: format.get().number,
    formatMessage: ({ id }: { id: MessageId }) => $messages.get()[id]
  });
}
