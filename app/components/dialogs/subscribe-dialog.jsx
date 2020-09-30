import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import SubscribeAppDialog from "./subscribe-app-dialog";
import SubscribeEmailDialog from "./subscribe-email-dialog";
import SubscribeSMDialog from "./subscribe-social-media-dialog";

class SubscribeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedDialog: null };
    this.selectDialog = this.selectDialog.bind(this);
  }

  selectDialog(e, selection) {
    console.log("selectDialog", e, selection);
    e.preventDefault();
    this.setState({ selectedDialog: selection });
  }

  render() {
    const self = this;
    return (
      <>
        <div className="modal-container">
          <div className=" modal-subscribe">
            <div className="modal-header">
              <h2 className="subheader">
                <FormattedHTMLMessage id="dialog:subscribe:header" />
              </h2>
              <h2>
                <FormattedHTMLMessage id="dialog:subscribe:subheader" />
              </h2>
            </div>

            <form className="pure-form pure-form-stacked">
              <label htmlFor="input">
                <FormattedHTMLMessage id="dialog:subscribe:select-subscrption" />
              </label>
              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    onClick={e => {
                      this.selectDialog(e, "Email");
                    }}
                  >
                    <button
                      className={
                        this.state.selectedDialog === "Email"
                          ? "pure-button"
                          : "inverse pure-button"
                      }
                    >
                      {this.props.intl.formatMessage({
                        id: "dialog:subscribe:email"
                      })}
                    </button>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={e => {
                      this.selectDialog(e, "SM");
                    }}
                  >
                    <button
                      className={
                        this.state.selectedDialog === "SM"
                          ? "pure-button"
                          : "inverse pure-button"
                      }
                    >
                      {this.props.intl.formatMessage({
                        id: "dialog:subscribe:social-media"
                      })}
                    </button>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={e => {
                      this.selectDialog(e, "App");
                    }}
                  >
                    <button
                      className={
                        this.state.selectedDialog === "App"
                          ? "pure-button"
                          : "inverse pure-button"
                      }
                    >
                      {this.props.intl.formatMessage({
                        id: "dialog:subscribe:app"
                      })}
                    </button>
                  </a>
                </li>
              </ul>
            </form>
          </div>
        </div>
        {this.state.selectedDialog === "Email" && <SubscribeEmailDialog />}
        {this.state.selectedDialog === "SM" && <SubscribeSMDialog />}
        {this.state.selectedDialog === "App" && <SubscribeAppDialog />}
      </>
    );
  }
}
export default inject("locale")(injectIntl(SubscribeDialog));
