import { FormattedNumber } from "react-intl";
import React from "react";

export function FormattedNumberUnit({
  value,
  unit,
  digits
}: {
  value: number;
  unit?: string;
  digits?: number;
}) {
  return typeof value === "number" ? (
    <>
      <FormattedNumber
        value={value}
        useGrouping={false}
        minimumFractionDigits={digits ?? 0}
        maximumFractionDigits={digits ?? 0}
      />
      {unit ? "\u202F" + unit : ""}
    </>
  ) : (
    <>–</>
  );
}
