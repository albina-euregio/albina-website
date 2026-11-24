import React from "react";
import { useIntl } from "../../i18n";

interface Props {
  value: string;
  title: JSX.Element;
  all: JSX.Element;
  none?: JSX.Element;
  handleChange(str: string): unknown;
  regionCodes?: string[];
  buttongroup?: boolean;
}

export default function ProvinceFilter(props: Props) {
  const intl = useIntl();
  const regions = (props.regionCodes ?? config.regionCodes)
    .map(region => ({
      region,
      label: intl.formatMessage({ id: `region:${region}` })
    }))
    .sort((a, b) => a.label.localeCompare(b.label, intl.locale));
  if (props.buttongroup) {
    return (
      <ul className="list-inline list-buttongroup-dense">
        {regions.map(({ region, label }) => (
          <li key={region}>
            <button
              className={
                props.value === region ? "pure-button" : "inverse pure-button"
              }
              onClick={e => {
                e.preventDefault();
                props.handleChange(region);
              }}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <select
        className="dropdown selectric"
        onChange={e => props.handleChange(e.target.value)}
        value={props.value}
      >
        {props.all && <option value="">{props.all}</option>}
        {props.none && <option value="none">{props.none}</option>}
        {regions.map(({ region, label }) => (
          <option key={region} value={region}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
