import React, { useMemo } from "react";
import Selectric from "../selectric";
import { useIntl } from "../../i18n";

type Props = {
  handleChange(month: number): unknown;
  all?: string;
  buttongroup?: boolean;
  dateFormat?: Intl.DateTimeFormatOptions;
  length?: number;
  minMonth?: number;
  title: string;
  value: number;
  year?: number;
};

export default function MonthFilter(props: Props) {
  const intl = useIntl();

  const months = useMemo(() => {
    const months = [];
    for (
      let month = props.minMonth ?? 1;
      month < (props.minMonth ?? 1) + (props.length ?? 12);
      month++
    ) {
      const date = new Date(props.year ?? 2000, month - 1, 15);
      const name = intl.formatDate(date, props.dateFormat ?? { month: "long" });
      months.push({ month, date, name });
    }
    return months;
  }, [intl, props.dateFormat, props.length, props.minMonth, props.year]);

  if (props.buttongroup) {
    return (
      <ul className="list-inline list-buttongroup-dense">
        {months.map(({ month, name }) => (
          <li key={month}>
            <button
              className="inverse pure-button"
              onClick={e => {
                e.preventDefault();
                props.handleChange(month);
              }}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric onChange={props.handleChange} {...props}>
        {props.all && <option value="">{props.all}</option>}
        {months.map(({ month, name }) => (
          <option key={month} value={month}>
            {name}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
