import React from "react";
import { APP_STORE } from "../../appStore";
import Selectric from "../selectric";

type Props = {
  value: string;
  all: JSX.Element;
  title: JSX.Element;
  handleChange(str: string): unknown;
  buttongroup: boolean;
};

export default function LanguageFilter(props: Props) {
  if (props.buttongroup) {
    return (
      <ul className="list-inline list-buttongroup-dense">
        {APP_STORE.mainLanguages.map(l => (
          <li key={l}>
            <button
              className={
                props.value === l ? "pure-button" : "inverse pure-button"
              }
              onClick={e => {
                e.preventDefault();
                props.handleChange(l);
              }}
            >
              {l.toUpperCase()}
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
