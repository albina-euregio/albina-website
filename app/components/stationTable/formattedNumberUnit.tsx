import React from "react";
import { useIntl } from "../../i18n";

export function FormattedNumberUnit({
  value,
  unit,
  digits
}: {
  value: number;
  unit?: string;
  digits?: number;
}) {
  const intl = useIntl();
  return typeof value === "number" ? (
    <>
      {intl.formatNumber(value, {
        useGrouping: false,
        minimumFractionDigits: digits ?? 0,
        maximumFractionDigits: digits ?? 0
      })}
      {unit ? "\u202F" + unit : ""}
    </>
  ) : (
    <>–</>
  );
}
