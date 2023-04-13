import React from "react";
import { useIntl } from "react-intl";
import { regionCodes } from "../../util/regions";
import Selectric from "../selectric";

type Props = {
  title: JSX.Element;
  all: JSX.Element;
  none: JSX.Element;
  handleChange(str: string): unknown;
  regionCode?: string;
  regionCodes?: string[];
};

export default function ProvinceFilter(props: Props) {
  const intl = useIntl();
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
        {(props.regionCodes ?? regionCodes).map(r => (
          <option key={r} value={r}>
            {intl.formatMessage({ id: `region:${r}` })}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
