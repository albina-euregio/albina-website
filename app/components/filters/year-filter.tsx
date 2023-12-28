import React, { useMemo } from "react";
import { useIntl } from "../../i18n";
import Selectric from "../selectric";

type Props = {
  buttongroup?: boolean;
  handleChange(year: number): unknown;
  all?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  formatter?(year: number): string;
  minYear: number;
  maxYear?: number;
  title: string;
  value: number;
};

export default function YearFilter(props: Props) {
  const intl = useIntl();
  const years = useMemo(() => {
    const years = [];
    const maxYear = props.maxYear ?? new Date().getFullYear();

    for (let year = maxYear; year >= props.minYear; year--) {
      const date = new Date(year, 0, 15);
      const name = props.formatter
        ? props.formatter(year)
        : intl.formatDate(date, props.dateFormat ?? { year: "numeric" });
      years.push({ year, date, name });
    }
    return years;
  }, [intl, props]);

  if (props.buttongroup) {
    return (
      <ul className="list-inline list-buttongroup-dense">
        {years.map(({ year, name }) => (
          <li key={year}>
            <button
              className="inverse pure-button"
              onClick={e => {
                e.preventDefault();
                props.handleChange(year);
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
        {years.map(({ year, name }) => (
          <option key={year} value={year}>
            {name}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
