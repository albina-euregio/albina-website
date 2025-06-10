import React from "react";
import { useIntl } from "../../i18n";
import Selectric from "../selectric";

interface Props {
  value: string;
  title: JSX.Element;
  all: JSX.Element;
  none: JSX.Element;
  handleChange(str: string): unknown;
  regionCode?: string;
  regionCodes?: string[];
  buttongroup: boolean;
}

export default function ProvinceFilter(props: Props) {
  const intl = useIntl();
  if (props.buttongroup) {
    return (
      <ul className="list-inline list-buttongroup-dense">
        {(props.regionCodes ?? config.regionCodes).map(region => (
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
              {intl.formatMessage({ id: `region:${region}` })}
            </button>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric
        onChange={props.handleChange}
        value={props.regionCode}
        {...props}
      >
        {props.all && <option value="">{props.all}</option>}
        {props.none && <option value="none">{props.none}</option>}
        {(props.regionCodes ?? config.regionCodes).map(r => (
          <option key={r} value={r}>
            {intl.formatMessage({ id: `region:${r}` })}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
