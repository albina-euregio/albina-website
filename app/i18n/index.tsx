import React from "react";
import { Temporal } from "temporal-polyfill";
import htmr from "htmr";
import { $locale, $messages } from "../appStore";
import { computed, StoreValue } from "nanostores";
import { useStore } from "@nanostores/react";
import reactStringReplace from "react-string-replace";

const templateRe = /\{ *([\w_ -]+) *\}/g;
type MessageId = keyof StoreValue<typeof $messages>;

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
  time(
    date: Date | number | string | Temporal.PlainDate | Temporal.ZonedDateTime,
    opts?: Intl.DateTimeFormatOptions
  ) {
    if (
      date instanceof Temporal.PlainDate ||
      date instanceof Temporal.ZonedDateTime
    ) {
      return date.toLocaleString(code, opts);
    }
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
    formatNumberUnit: (value: number, unit?: string, digits?: number) =>
      typeof value === "number"
        ? formatter.number(value, {
            useGrouping: false,
            minimumFractionDigits: digits ?? 0,
            maximumFractionDigits: digits ?? 0
          }) + (unit ? "\u202F" + unit : "")
        : "–",
    formatMessage: (
      { id }: { id: MessageId },
      values: Record<string, string | React.ReactElement> = undefined
    ) =>
      typeof values !== "object"
        ? t[id]
        : Object.values(values).some(v => typeof v === "object")
          ? reactStringReplace(t[id], templateRe, match => values[match])
          : t[id].replace(templateRe, (str, match) => values[match])
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
        | string
        | React.ReactElement
        | ((children: React.ReactElement) => React.ReactElement)
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

export const FormattedDate = ({
  date,
  options
}: {
  date: Date | number | string | Temporal.PlainDate | Temporal.ZonedDateTime;
  options: Intl.DateTimeFormatOptions;
}) => {
  const formatter = useStore(format);
  return <>{formatter.time(date, options)}</>;
};
