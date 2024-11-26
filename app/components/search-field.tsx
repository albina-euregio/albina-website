import React, { useState } from "react";
import { useIntl } from "../i18n";
import { Tooltip } from "./tooltips/tooltip";

interface Props {
  value: string;
  title: string;
  handleSearch: (text: string) => void;
}

export default function SearchField({ value, title, handleSearch }: Props) {
  const intl = useIntl();
  const [text, setText] = useState(value || "");
  const placeholder = intl.formatMessage({ id: "filter:search" });
  return (
    <div>
      <p className="info">{title}</p>
      <div className="pure-form pure-form-search">
        <input
          type="text"
          id="input"
          placeholder={placeholder}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => {
            if (e.key == "Enter") {
              handleSearch(text);
            }
          }}
          value={text}
        />
        <Tooltip label={placeholder}>
          <button
            href="#"
            aria-label={placeholder}
            className="pure-button pure-button-icon icon-search"
            onClick={() => handleSearch(text)}
          >
            <span>&nbsp;</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
