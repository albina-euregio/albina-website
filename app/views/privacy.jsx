import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class Privacy extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "privacy:title" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "privacy:headline" })}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <section className="section-centered">
            <div className="panel">
              <p>
                <FormattedHTMLMessage id="privacy:introduction" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:responsibility:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:responsibility:text" />
                <a
                  href={this.props.intl.formatMessage({
                    id: "privacy:responsibility:email:link"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "privacy:responsibility:email:text"
                  })}
                </a>
                .
              </p>

              <h4>
                {this.props.intl.formatMessage({ id: "privacy:gdpr:headline" })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:gdpr:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({ id: "privacy:ip:headline" })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:ip:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:email:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:email:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:cookies:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:cookies:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:analytics:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:analytics:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:social-media:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:social-media:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:recipient:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:recipient:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:gdpr-request:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:gdpr-request:text:1" />
              </p>
              <ul>
                <li>
                  {this.props.intl.formatMessage({
                    id: "privacy:gdpr-request:email:introduction"
                  })}
                  <a
                    href={this.props.intl.formatMessage({
                      id: "privacy:gdpr-request:email:link"
                    })}
                    target="_blank"
                  >
                    {this.props.intl.formatMessage({
                      id: "privacy:gdpr-request:email:text"
                    })}
                  </a>
                </li>
                <li>
                  <FormattedHTMLMessage id="privacy:gdpr-request:postal:text" />
                </li>
              </ul>
              <p>
                <FormattedHTMLMessage id="privacy:gdpr-request:text:2" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:revoke:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:revoke:text:1" />
                <a
                  href={this.props.intl.formatMessage({
                    id: "privacy:revoke:email:link"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "privacy:revoke:email:text"
                  })}
                </a>
                <FormattedHTMLMessage id="privacy:revoke:text:2" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:appeal:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:appeal:text:1" />
                <a
                  href={this.props.intl.formatMessage({
                    id: "privacy:appeal:dpa:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({ id: "privacy:appeal:dpa" })}
                </a>
                {this.props.intl.formatMessage({ id: "privacy:appeal:dsb" })}
                <FormattedHTMLMessage id="privacy:appeal:text:2" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "privacy:validity:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="privacy:validity:text" />
              </p>
            </div>
          </section>
        </section>
        <div className="section-padding"></div>
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(Privacy))));
