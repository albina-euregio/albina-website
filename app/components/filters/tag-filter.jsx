import React from "react";
import { injectIntl } from "react-intl";
import { avalancheProblems } from "../../util/avalancheProblems";
import Selectric from "../selectric";

function TagFilter(props) {
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric onChange={props.handleChange} {...props}>
        {props.all && <option value="">{props.all}</option>}
        {avalancheProblems.map(d => (
          <option key={d} value={d}>
            {props.intl.formatMessage({ id: "problem:" + d })}
          </option>
        ))}
      </Selectric>
    </div>
  );
}

export default injectIntl(TagFilter);
