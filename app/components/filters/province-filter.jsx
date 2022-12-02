import React from "react";
import { injectIntl } from "react-intl";
import { regionCodes } from "../../util/regions";
import Selectric from "../selectric";

function ProvinceFilter(props) {
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric onChange={props.handleChange} {...props}>
        {props.all && <option value="">{props.all}</option>}
        {props.none && <option value="none">{props.none}</option>}
        {regionCodes.map(r => (
          <option key={r} value={r}>
            {props.intl.formatMessage({ id: `region:${r}` })}
          </option>
        ))}
      </Selectric>
    </div>
  );
}

export default injectIntl(ProvinceFilter);
