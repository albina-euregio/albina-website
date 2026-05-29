import React, { useRef, useState } from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip.tsx";

interface Props {
  value: string;
  title: string;
  handleSearch: (text: string) => void;
}

export default function SearchField({ value, title, handleSearch }: Props) {
  const intl = useIntl();
  const [text, setText] = useState(value || "");
  const inputRef = useRef<HTMLInputElement>(null);
  const placeholder = intl.formatMessage({ id: "filter:search" });
  return (
    <div>
      <p className="info">{title}</p>
      <div className="pure-form pure-form-search">
        <input
          ref={inputRef}
          type="text"
          id="input"
          placeholder={placeholder}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Escape") {
              inputRef.current?.blur();
            } else if (e.key === "Enter") {
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
            onMouseDown={e => {
              // prevent the button click from stealing focus away from the input,
              // so we can reliably read document.activeElement before it changes
              e.preventDefault();
            }}
            onClick={() => {
              if (document.activeElement === inputRef.current) {
                inputRef.current?.blur();
              } else {
                inputRef.current?.focus();
                handleSearch(text);
              }
            }}
          >
            <span>&nbsp;</span>
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
