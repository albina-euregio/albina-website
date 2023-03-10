import React from "react";
import { APP_STORE } from "../../appStore";
import Selectric from "../selectric";

type Props = {
  all: JSX.Element;
  title: JSX.Element;
  handleChange(str: string): unknown;
};

export default function LanguageFilter(props: Props) {
  return (
    <div>
      {props.title && <p className="info">{props.title}</p>}
      <Selectric onChange={props.handleChange} {...props}>
        {props.all && <option value="all">{props.all}</option>}
        {APP_STORE.mainLanguages.map(l => (
          <option key={l} value={l}>
            {l.toUpperCase()}
          </option>
        ))}
      </Selectric>
    </div>
  );
}
