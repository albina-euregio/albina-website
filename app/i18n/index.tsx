import React from "react";
import htmr from "htmr";
import { $locale, $messages } from "../appStore";
import { useStore } from "@nanostores/react";
import { formatter } from "@nanostores/i18n";
import reactStringReplace from "react-string-replace";

const templateRe = /\{ *([\w_ -]+) *\}/g;
export const format = formatter($locale);
type MessageId = keyof (typeof $messages)["value"];

export function useIntl() {
  const locale = useStore($locale);
  const t = useStore($messages);
  const formatter = useStore(format);

  function formatDate(
    date?: Date | number | string,
    opts?: Intl.DateTimeFormatOptions
  ) {
    if (typeof date === "string") date = Date.parse(date);
    return date && isFinite(+date) ? formatter.time(date, opts) : "";
  }
  return {
    locale,
    formatDate,
    formatTime: formatDate,
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
  const intl = useIntl();
  const message = intl.formatMessage({ id }, values);
  if (html) {
    return htmr(message, {
      transform: {
        _: (element, props, children) => {
          return values[element]?.(children) ?? element;
        }
      }
    });
  }
  return <>{message}</>;
};
