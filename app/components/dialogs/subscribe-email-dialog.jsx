import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import { Link } from "react-router-dom";

import ProvinceFilter from "../filters/province-filter";
import Base from "../../base";

class SubscribeEmailDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      language: window["appStore"].language,
      region: Object.keys(window["appStore"].regions)[0],
      status: "",
      errorMessage: "",
      agree: false
    };
  }

  handleChangeEmail = e => {
    const target = e.target;
    if (!target.matches(":invalid")) {
      this.setState({ email: target.value });
    } else if (this.state.email) {
      this.setState({ email: "" });
    }
  };

  handleChangeAgree = e => {
    this.setState({ agree: !this.state.agree });
  };

  handleChangeLanguage = e => {
    this.setState({ language: e.target.value });
  };

  handleChangeRegion = newRegion => {
    this.setState({ region: newRegion });
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
    Base.doPost(config.get("apis.subscribe") + "/subscribe", data).then(
      () => {
        this.setState({ status: "submitted" });
      },
      (errorText, statusCode) => {
        this.setState({ errorMessage: errorText });
      }
    );
  };

  validate() {
    return (
      this.state.email != "" &&
      this.state.language != "" &&
      this.state.region &&
      this.state.agree
    );
  }

  render() {
    return (
      <div className="modal-subscribe">
        <div className="modal-header">
          <h2 className="subheader">
            <FormattedHTMLMessage id="dialog:subscribe-email:header" />
          </h2>
          <h2>
            <FormattedHTMLMessage id="dialog:subscribe-email:subheader" />
          </h2>
          <p className="tiny">
            <a
              href="#subscribeDialog"
              className="icon-link icon-arrow-left modal-trigger tooltip"
              title={this.props.intl.formatMessage({
                id: "dialog:subscribe-email:back-button:hover"
              })}
            >
              <FormattedHTMLMessage id="dialog:subscribe-email:back-button" />
            </a>
          </p>
        </div>

        {!this.state.status && (
          <form
            className="pure-form pure-form-stacked"
            onSubmit={this.handleSubmit}
          >
            <label htmlFor="province">
              <FormattedHTMLMessage id="dialog:subscribe-email:region" />
            </label>
            <ul className="list-inline list-buttongroup">
              <li>
                <ProvinceFilter
                  className="selectric-changed"
                  handleChange={r => this.handleChangeRegion(r)}
                  value={this.state.region}
                />
              </li>
            </ul>

            <hr />

            <p>
              <label htmlFor="email">
                <FormattedHTMLMessage id="dialog:subscribe-email:email" />
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
              <FormattedHTMLMessage id="dialog:subscribe-email:language" />
              <span className="normal" />
            </label>
            <ul className="list-inline list-subscribe-language">
              {window["appStore"].languages.map(l => (
                <li key={l}>
                  <label
                    className="pure-checkbox"
                    htmlFor={"subscribe-language-" + l}
                  >
                    <input
                      id={"subscribe-language-" + l}
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

            <div className="">
              <label htmlFor="agree">
                <input
                  id="agree"
                  type="checkbox"
                  onChange={e => this.handleChangeAgree(e)}
                  checked={this.state.agree}
                />
                {this.props.intl.formatMessage({
                  id: "dialog:subscribe-email:subscribe:agree-before-link"
                })}
                <Link
                  title={this.props.intl.formatMessage({
                    id: "dialog:subscribe-email:subscribe:agree-link"
                  })}
                  to="/declaration/"
                >
                  {this.props.intl.formatMessage({
                    id: "dialog:subscribe-email:subscribe:agree-link"
                  })}
                </Link>
                {this.props.intl.formatMessage({
                  id: "dialog:subscribe-email:subscribe:agree-after-link"
                })}
              </label>
            </div>

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
                <FormattedHTMLMessage
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
export default inject("locale")(injectIntl(SubscribeEmailDialog));
