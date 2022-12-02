import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from "react-intl";
import CookieStore from "../../stores/cookieStore";

const cookieConsent = new CookieStore("cookieConsentAccepted");

function CookieConsent(props) {
  return (
    cookieConsent.active && (
      <div className="candybar">
        <h3>
          <FormattedMessage id="dialog:cookie-consent:header" />
        </h3>
        <p>
          <FormattedMessage id="dialog:cookie-consent:text" />
        </p>
        <p>
          <button
            href="#"
            onClick={() => (cookieConsent.active = false)}
            title={props.intl.formatMessage({
              id: "dialog:cookie-consent:button"
            })}
            className="pure-button"
          >
            {props.intl.formatMessage({
              id: "dialog:cookie-consent:button"
            })}
          </button>
        </p>
      </div>
    )
  );
}

export default injectIntl(observer(CookieConsent));
