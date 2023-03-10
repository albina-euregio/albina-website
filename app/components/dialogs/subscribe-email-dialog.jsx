import React from "react";
import { observer } from "mobx-react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import ProvinceFilter from "../filters/province-filter";
import { fetchText } from "../../util/fetch";
import { APP_STORE } from "../../appStore";

class SubscribeEmailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  resetState() {
    this.setState({
      email: "",
      language: APP_STORE.language,
      region: false,
      status: "",
      errorMessage: "",
      agree: false
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

  handleChangeEmail = e => {
    const value = e.target.value;

    if (this.validateEmail(value)) {
      this.setState({ email: value });
    } else if (this.state.email) {
      this.setState({ email: "" });
    }
  };

  handleChangeAgree = e => {
    this.setState({ agree: e.target.checked });
  };

  handleChangeLanguage = e => {
    this.setState({ language: e.target.value });
  };

  handleChangeRegion = newRegion => {
    this.setState({ region: newRegion !== "none" ? newRegion : false });
  };

  handleSubmit = e => {
    e.preventDefault();
    e.stopPropagation();

    const data = {
      language: this.state.language,
      regions: this.state.region,
      email: this.state.email
    };

    this.setState({ status: "loading" });
    fetchText(config.apis.subscribe + "/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(
      () => {
        this.setState({ status: "submitted" });
      },
      error => {
        this.setState({ errorMessage: error });
      }
    );
  };

  validate() {
    return (
      this.state.email !== "" &&
      this.state.language !== "" &&
      this.state.region !== false &&
      this.state.agree
    );
  }

  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  render() {
    // add a dummy class to react to close events
    //const isOpen = window["modalStateStore"].isOpen ? "" : " closed";
    return (
      <div className="modal-subscribe-email">
        <div className="modal-header">
          <h2>
            <FormattedMessage id="dialog:subscribe-email:subheader" />
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
            <ul className="list-inline list-buttongroup">
              <li>
                <ProvinceFilter
                  title={this.props.intl.formatMessage({
                    id: "measurements:filter:province"
                  })}
                  className={this.state.region && "selectric-changed"}
                  handleChange={r => this.handleChangeRegion(r)}
                  value={this.state.region}
                  none={this.props.intl.formatMessage({
                    id: "blog:filter:province:nothing-selected"
                  })}
                />
              </li>
            </ul>

            <hr />

            <p>
              <label htmlFor="email">
                <FormattedMessage id="dialog:subscribe-email:email" />
                <span className="normal" />
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="full-width"
                onChange={this.handleChangeEmail}
                placeholder={this.props.intl.formatMessage({
                  id: "dialog:subscribe-email:email"
                })}
              />
            </p>
            <label htmlFor="language">
              <FormattedMessage id="dialog:subscribe-email:language" />
              <span className="normal" />
            </label>
            <ul className="list-inline list-subscribe-language">
              {APP_STORE.mainLanguages.map(l => (
                <li key={l}>
                  <label className="pure-checkbox">
                    <input
                      name="language"
                      onChange={this.handleChangeLanguage}
                      value={l}
                      type="radio"
                      checked={this.state.language == l ? "checked" : ""}
                    />
                    &nbsp;
                    <span className="normal">{l.toUpperCase()}</span>
                  </label>
                </li>
              ))}
            </ul>

            <hr />

            <p className="">
              <label htmlFor="agree">
                <input
                  id="agree"
                  type="checkbox"
                  onChange={e => this.handleChangeAgree(e)}
                  checked={!!this.state.agree}
                />
                {this.props.intl.formatMessage({
                  id: "dialog:subscribe-email:subscribe:agree-before-link"
                })}
                <Link
                  title={this.props.intl.formatMessage({
                    id: "dialog:subscribe-email:subscribe:agree-link"
                  })}
                  to="/more/privacy/"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "dialog:subscribe-email:subscribe:agree-link"
                  })}
                </Link>
                {this.props.intl.formatMessage({
                  id: "dialog:subscribe-email:subscribe:agree-after-link"
                })}
              </label>
            </p>

            <button
              type="submit"
              className="pure-button"
              disabled={this.validate() ? "" : "disabled"}
            >
              {this.props.intl.formatMessage({
                id: "dialog:subscribe-email:subscribe:button"
              })}
            </button>
          </form>
        )}

        {(this.state.status || this.state.errorMessage) && this.state.agree && (
          <div className="field-2 panel">
            {this.state.status && (
              <p className="status-message">
                <FormattedMessage
                  id={"dialog:subscribe-email:status:" + this.state.status}
                />
              </p>
            )}
            {this.state.errorMessage && (
              <p className="status-message">
                <strong className="error">
                  {this.props.intl.formatMessage({
                    id: "dialog:subscribe-email:error"
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
export default injectIntl(observer(SubscribeEmailDialog));
