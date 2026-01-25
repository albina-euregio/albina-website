import React, { ReactNode } from "react";
import htmr from "htmr";
import { $locale, $messages } from "../appStore";
import { computed, StoreValue } from "nanostores";
import { useStore } from "@nanostores/react";
import reactStringReplace from "react-string-replace";
import {
  DATE_TIME_FORMAT,
  DATE_TIME_FORMAT_SHORT,
  DATE_TIME_ZONE_FORMAT,
  LONG_DATE_FORMAT
} from "../util/date";

const templateRe = /\{ *([\w_ -]+) *\}/g;
type MessageId = keyof StoreValue<typeof $messages>;

const format = computed($locale, code => ({
  intlCache: new (class IntlCache {
    #numberFormatCache: Intl.NumberFormat[] = [];
    numberFormat(digits: number): Intl.NumberFormat {
      return (this.#numberFormatCache[digits] ??= new Intl.NumberFormat(code, {
        useGrouping: false,
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      }));
    }
    #default: Intl.DateTimeFormat | undefined;
    #longDate: Intl.DateTimeFormat | undefined;
    #dateTime: Intl.DateTimeFormat | undefined;
    #dateTimeShort: Intl.DateTimeFormat | undefined;
    #dateTimeZone: Intl.DateTimeFormat | undefined;
    dateTimeFormat(opts?: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
      switch (opts) {
        case undefined:
          return (this.#default ??= new Intl.DateTimeFormat(code, opts));
        case LONG_DATE_FORMAT:
          return (this.#longDate ??= new Intl.DateTimeFormat(code, opts));
        case DATE_TIME_FORMAT:
          return (this.#dateTime ??= new Intl.DateTimeFormat(code, opts));
        case DATE_TIME_FORMAT_SHORT:
          return (this.#dateTimeShort ??= new Intl.DateTimeFormat(code, opts));
        case DATE_TIME_ZONE_FORMAT:
          return (this.#dateTimeZone ??= new Intl.DateTimeFormat(code, opts));
        default:
          return new Intl.DateTimeFormat(code, opts);
      }
    }
  })(),
  number(num: number, digits?: number) {
    return this.intlCache.numberFormat(digits ?? 0).format(num);
  },
  relativeTime(date: Date, opts: Intl.RelativeTimeFormatOptions = {}) {
    const format = new Intl.RelativeTimeFormat(code, opts);
    const delta = +date - Date.now();
    const hour = 3600e3;
    if (delta > -48 * hour) {
      return format.format(Math.round(delta / hour), "hours");
    } else {
      return format.format(Math.round(delta / hour / 24), "days");
    }
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
    return this.intlCache.dateTimeFormat(opts).format(date);
  }
}));

export function useIntl() {
  const locale = useStore($locale);
  const t = useStore($messages);
  const formatter = useStore(format);

  function formatNumberUnit(
    value: number | undefined | null,
    unit?: string,
    digits?: number
  ): string {
    return typeof value === "number"
      ? formatter.number(value, digits) + (unit ? "\u202F" + unit : "")
      : "–";
  }

  function formatMessage({ id }: { id: MessageId }): string;
  function formatMessage(
    { id }: { id: MessageId },
    values: Record<string, string>
  ): string;
  function formatMessage(
    { id }: { id: MessageId },
    values: Record<string, React.ReactElement>
  ): ReactNode[];
  function formatMessage(
    { id }: { id: MessageId },
    values:
      | Record<string, string>
      | Record<string, React.ReactElement>
      | undefined = undefined
  ): string | ReactNode[] {
    return typeof values !== "object"
      ? t[id]
      : Object.values(values).some(v => typeof v === "object")
        ? reactStringReplace(t[id], templateRe, match => values[match])
        : t[id].replace(templateRe, (_, match) => values[match]);
  }

  return {
    locale,
    formatDate: formatter.time.bind(formatter),
    formatRelativeTime: formatter.relativeTime.bind(formatter),
    formatNumber: formatter.number.bind(formatter),
    formatNumberUnit,
    formatMessage
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
