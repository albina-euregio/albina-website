import React from "react";
import { observer } from "mobx-react";
import { FormattedMessage, injectIntl } from "react-intl";

import LanguageFilter from "../filters/language-filter";
import ProvinceFilter from "../filters/province-filter";

class SubscribeTelegramDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.telegramChannels = config.subscribe.telegram;
  }

  resetState() {
    this.setState({
      language: document.body.parentElement.lang,
      region: false,
      status: "",
      errorMessage: ""
    });
  }

  componentDidMount() {
    this.resetState();
  }

  componentDidUpdate() {
    // reset on dialog close after form has been submitted
    if (this.state.status !== "" && !window["modalStateStore"].isOpen) {
      this.resetState();
    }
  }

  handleChangeLanguage = language => {
    this.setState({ language: language });
  };

  handleChangeRegion = newRegion => {
    this.setState({ region: newRegion !== "none" ? newRegion : false });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    if (this.state.region && this.state.language)
      window.open(
        this.telegramChannels[this.state.region + "-" + this.state.language]
      );
  };

  validate() {
    return this.state.language !== "" && this.state.region !== false;
  }

  render() {
    // add a dummy class to react to close events
    return (
      <div className="modal-subscribe-telegram">
        <div className="modal-header">
          <h2>
            <FormattedMessage id="dialog:subscribe-telegram:subheader" />
          </h2>
        </div>

        {!this.state.status && (
          <form
            className="pure-form pure-form-stacked"
            onSubmit={this.handleSubmit}
          >
            <label htmlFor="province">
              <FormattedMessage
                id="dialog:subscribe-email:region"
                values={{
                  strong: (...msg) => <strong>{msg}</strong>
                }}
              />
            </label>
            <ProvinceFilter
              buttongroup={true}
              title={this.props.intl.formatMessage({
                id: "measurements:filter:province"
              })}
              handleChange={r => this.handleChangeRegion(r)}
              value={this.state.region}
              none={this.props.intl.formatMessage({
                id: "blog:filter:province:nothing-selected"
              })}
            />

            <label htmlFor="language">
              <FormattedMessage id="dialog:subscribe-email:language" />
            </label>
            <LanguageFilter
              buttongroup={true}
              title={this.props.intl.formatMessage({
                id: "measurements:filter:province"
              })}
              handleChange={l => this.handleChangeLanguage(l)}
              value={this.state.language}
            />

            <button
              type="submit"
              className="pure-button"
              disabled={this.validate() ? "" : "disabled"}
            >
              {this.props.intl.formatMessage({
                id: "dialog:subscribe-telegram:subscribe:button"
              })}
            </button>
          </form>
        )}

        {(this.state.status || this.state.errorMessage) && this.state.agree && (
          <div className="field-2 panel">
            {this.state.status && (
              <p className="status-message">
                <FormattedMessage
                  id={"dialog:subscribe-telegram:status:" + this.state.status}
                />
              </p>
            )}
            {this.state.errorMessage && (
              <p className="status-message">
                <strong className="error">
                  {this.props.intl.formatMessage({
                    id: "dialog:subscribe-telegram:error"
                  })}
                  :
                </strong>
                &nbsp;{this.state.errorMessage}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
}
export default injectIntl(observer(SubscribeTelegramDialog));
