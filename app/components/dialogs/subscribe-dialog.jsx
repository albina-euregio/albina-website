import React from "react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import SubscribeAppDialog from "./subscribe-app-dialog";
import SubscribeEmailDialog from "./subscribe-email-dialog";
import SubscribeTelegramDialog from "./subscribe-telegram-dialog";
import SubscribeWebPushDialog, {
  isWebPushSupported
} from "./subscribe-web-push-dialog";

class SubscribeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDialog: null };
  }

  selectDialog(e, selection) {
    //console.log("selectDialog", e, selection);
    e.preventDefault();
    this.setState({ selectedDialog: selection });
  }

  render() {
    //const self = this;

    //console.log("render", this.state.selectedDialog);
    const dialogTypes = isWebPushSupported()
      ? ["Email", "Telegram", "App", "WebPush"]
      : ["Email", "Telegram", "App"];
    return (
      <>
        <div className="modal-container">
          <div className=" modal-subscribe">
            <div className="modal-subscribe-overview">
              <div className="modal-header">
                <h2 className="subheader">
                  <FormattedHTMLMessage id="dialog:subscribe:header" />
                </h2>
                <h2>
                  <FormattedHTMLMessage id="dialog:subscribe:subheader" />
                </h2>
                <FormattedHTMLMessage id="dialog:subscribe:description" />
              </div>

              <form className="pure-form pure-form-stacked">
                <label htmlFor="input">
                  <FormattedHTMLMessage id="dialog:subscribe:select-subscrption" />
                </label>
                <ul className="list-inline list-buttongroup-dense">
                  {dialogTypes.map(type => (
                    <li key={type}>
                      <a
                        href="#"
                        className={
                          this.state.selectedDialog === type
                            ? "pure-button"
                            : "inverse pure-button"
                        }
                        onClick={e => this.selectDialog(e, type)}
                      >
                        {this.props.intl.formatMessage({
                          id:
                            type === "Email"
                              ? "dialog:subscribe:email"
                              : type === "Telegram"
                              ? "dialog:subscribe:telegram"
                              : type === "App"
                              ? "dialog:subscribe:app"
                              : type === "WebPush"
                              ? "dialog:subscribe:web-push"
                              : undefined
                        })}
                      </a>
                    </li>
                  ))}
                </ul>
              </form>
            </div>

            {this.state.selectedDialog === "Email" && <SubscribeEmailDialog />}
            {this.state.selectedDialog === "Telegram" && (
              <SubscribeTelegramDialog />
            )}
            {this.state.selectedDialog === "App" && <SubscribeAppDialog />}
            {this.state.selectedDialog === "WebPush" && (
              <SubscribeWebPushDialog />
            )}
          </div>
        </div>
      </>
    );
  }
}
export default injectIntl(SubscribeDialog);
