import React from "react";
import { useIntl } from "../../i18n";

interface Props {
  dateFrom: string;
  dateTo: string;
  maxDate?: string;
  onChange(dateFrom: string, dateTo: string): void;
}

export default function DateRangeFilter(props: Props) {
  const intl = useIntl();

  return (
    <div className="pure-form date-range-filter">
      <div>
        <p className="info">
          {intl.formatMessage({ id: "snowprofiles:filter:date-from" })}
        </p>
        <input
          type="date"
          value={props.dateFrom}
          max={props.dateTo}
          onChange={e => props.onChange(e.target.value, props.dateTo)}
        />
      </div>
      <div>
        <p className="info">
          {intl.formatMessage({ id: "snowprofiles:filter:date-to" })}
        </p>
        <input
          type="date"
          value={props.dateTo}
          min={props.dateFrom}
          max={props.maxDate}
          onChange={e => props.onChange(props.dateFrom, e.target.value)}
        />
      </div>
    </div>
  );
}
