import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from "react-intl";
import CookieStore from "../../stores/cookieStore";

const cookieFeedback = new CookieStore("feedbackAccepted");

class FeedbackDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  accept = flag => {
    if (flag) {
      window.open(this.url, "_blank");
    }
    cookieFeedback.active = false;
  };

  get url() {
    const language = language;
    return config.links.feedback[language];
  }

  render() {
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
              href={this.url}
              rel="noopener noreferrer"
              target="_blank"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                this.accept(true);
              }}
            >
              {this.url}
            </a>
          </p>
          <p>
            <button
              href="#"
              onClick={() => this.accept(false)}
              title={this.props.intl.formatMessage({
                id: "dialog:feedback:button"
              })}
              className="pure-button"
            >
              {this.props.intl.formatMessage({ id: "dialog:feedback:button" })}
            </button>
          </p>
        </div>
      )
    );
  }
}

export default injectIntl(observer(FeedbackDialog));
