import React from "react";
import Selectric from "../selectric";

export default function PdfModeFilter(props) {
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric onChange={props.handleChange} {...props}>
        {props.options.map(l => (
          <option key={l.value} value={l.value}>
            {l.label.toUpperCase()}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
