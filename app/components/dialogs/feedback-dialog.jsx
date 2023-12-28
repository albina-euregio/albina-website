import React, { useState } from "react";
import { FormattedMessage, useIntl } from "../../i18n";

function FeedbackDialog() {
  const intl = useIntl();
  const lang = intl.locale.slice(0, 2);
  const [active, setActive] = useState(true);
  const url = config.links.feedback[lang];
  const accept = flag => {
    if (flag) {
      window.open(url, "_blank");
    }
    setActive(false);
  };

  return (
    active && (
      <div className="candybar">
        <h3>
          <FormattedMessage id="dialog:feedback:header" />
        </h3>
        <p>
          <FormattedMessage id="dialog:feedback:text" />
        </p>
        <p>
          <a
            href={url}
            rel="noopener noreferrer"
            target="_blank"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              accept(true);
            }}
          >
            {url}
          </a>
        </p>
        <p>
          <button
            href="#"
            onClick={() => accept(false)}
            title={intl.formatMessage({
              id: "dialog:feedback:button"
            })}
            className="pure-button"
          >
            {intl.formatMessage({ id: "dialog:feedback:button" })}
          </button>
        </p>
      </div>
    )
  );
}

export default FeedbackDialog;
