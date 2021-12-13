import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import CookieStore from "../../stores/cookieStore";

const cookieConsent = new CookieStore("cookieConsentAccepted");

class CookieConsent extends React.Component {
  constructor(props) {
    super(props);
  }

  accept = () => {
    cookieConsent.active = false;
  };

  render() {
    return (
      cookieConsent.active && (
        <div className="candybar">
          <h3>
            <FormattedHTMLMessage id="dialog:cookie-consent:header" />
          </h3>
          <p>
            <FormattedHTMLMessage id="dialog:cookie-consent:text" />
          </p>
          <p>
            <button
              href="#"
              onClick={() => this.accept()}
              title={this.props.intl.formatMessage({
                id: "dialog:cookie-consent:button"
              })}
              className="pure-button"
            >
              {this.props.intl.formatMessage({
                id: "dialog:cookie-consent:button"
              })}
            </button>
          </p>
        </div>
      )
    );
  }
}

export default injectIntl(observer(CookieConsent));
