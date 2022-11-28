import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import Selectric from "../selectric";

type Props = {
  buttongroup?: boolean;
  handleChange(year: number): unknown;
  all?: string;
  dateFormat?: Intl.DateTimeFormatOptions;
  formatter?(year: number): string;
  minYear: number;
  title: string;
  value: number;
};

export default function YearFilter(props: Props) {
  const intl = useIntl();
  const years = useMemo(() => {
    const years = [];
    const maxYear = new Date().getFullYear();

    for (var year = props.minYear; year <= maxYear; year++) {
      const date = new Date(year, 0, 15);
      const name = props.formatter
        ? props.formatter(year)
        : intl.formatDate(date, props.dateFormat ?? { year: "numeric" });
      years.push({ year, date, name });
    }
    return years;
  }, [intl, props.dateFormat, props.minYear]);

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
              {props.value === year ? "☑ " : "☐ "}
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
