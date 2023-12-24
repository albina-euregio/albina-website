import React from "react";
import { observer } from "mobx-react";
import { FormattedMessage, useIntl } from "react-intl";
import CookieStore from "../../stores/cookieStore";

const cookieFeedback = new CookieStore("feedbackAccepted");

function FeedbackDialog() {
  const intl = useIntl();
  const url = config.links.feedback[document.body.parentElement.lang];
  const accept = flag => {
    if (flag) {
      window.open(url, "_blank");
    }
    cookieFeedback.active = false;
  };

  return (
    cookieFeedback.active && (
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

export default observer(FeedbackDialog);
