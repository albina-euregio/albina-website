import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
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
    //e.preventDefault();
    this.setState({ selectedDialog: selection });
  }

  render() {
    //const self = this;

    //console.log("SubscribeDialog->render", this.state.selectedDialog);
    const dialogTypes = isWebPushSupported()
      ? ["WebPush", "Telegram", "Email", "App"]
      : ["Telegram", "Email", "App"];
    return (
      <>
        <div className="modal-container">
          <div className=" modal-subscribe">
            <div className="modal-subscribe-overview">
              <div className="modal-header">
                <h2 className="subheader">
                  <FormattedMessage id="dialog:subscribe:header" />
                </h2>
                <h2>
                  <FormattedMessage id="dialog:subscribe:subheader" />
                </h2>
                <FormattedMessage id="dialog:subscribe:description" />
              </div>

              <form className="pure-form pure-form-stacked">
                <label htmlFor="input">
                  <FormattedMessage
                    id="dialog:subscribe:select-subscription"
                    values={{
                      span: (...msg) => <span className="normal">{msg}</span>
                    }}
                  />
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
                            type === "WebPush"
                              ? "dialog:subscribe:web-push"
                              : type === "Telegram"
                              ? "dialog:subscribe:telegram"
                              : type === "Email"
                              ? "dialog:subscribe:email"
                              : type === "App"
                              ? "dialog:subscribe:app"
                              : undefined
                        })}
                      </a>
                    </li>
                  ))}
                </ul>
              </form>
            </div>

            {this.state.selectedDialog === "WebPush" && (
              <SubscribeWebPushDialog />
            )}
            {this.state.selectedDialog === "Telegram" && (
              <SubscribeTelegramDialog />
            )}
            {this.state.selectedDialog === "Email" && <SubscribeEmailDialog />}
            {this.state.selectedDialog === "App" && <SubscribeAppDialog />}
          </div>
        </div>
      </>
    );
  }
}
export default injectIntl(SubscribeDialog);
