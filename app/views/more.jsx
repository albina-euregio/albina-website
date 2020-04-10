import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class More extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <ul class="list-plain features">
            <li class="feature-item">
              <a
                href="/more/archive"
                title="Archive"
                class="linkbox linkbox-feature"
              >
                <div class="content-image">
                  <img
                    src="/content_files/feature_archive.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:archive:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:archive:image:alt"
                    })}
                    class=""
                  />
                </div>
                <div class="content-text">
                  <p class="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:archive:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:archive:text" })}
                  </p>
                </div>
              </a>
            </li>
            <li class="feature-item">
              <a
                href="/more/about"
                title="About"
                class="linkbox linkbox-feature"
              >
                <div class="content-image">
                  <img
                    src="/content_files/feature_about.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:about:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:about:image:alt"
                    })}
                    class=""
                  />
                </div>
                <div class="content-text">
                  <p class="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:about:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:about:text" })}
                  </p>
                </div>
              </a>
            </li>
            <li class="feature-item">
              <a
                href="/more/contact"
                title="Contact"
                class="linkbox linkbox-feature"
              >
                <div class="content-image">
                  <img
                    src="/content_files/feature_contact.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:contact:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:contact:image:alt"
                    })}
                    class=""
                  />
                </div>
                <div class="content-text">
                  <p class="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:contact:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:contact:text" })}
                  </p>
                </div>
              </a>
            </li>
            <li class="feature-item">
              <a
                href="/more/imprint"
                title="Imprint"
                class="linkbox linkbox-feature"
              >
                <div class="content-image">
                  <img
                    src="/content_files/feature_imprint.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:imprint:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:imprint:image:alt"
                    })}
                    class=""
                  />
                </div>
                <div class="content-text">
                  <p class="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:imprint:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:imprint:text" })}
                  </p>
                </div>
              </a>
            </li>
            <li class="feature-item">
              <a
                href="/more/privacy"
                title="Privacy Policy"
                class="linkbox linkbox-feature"
              >
                <div class="content-image">
                  <img
                    src="/content_files/feature_privacy.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:privacy:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:privacy:image:alt"
                    })}
                    class=""
                  />
                </div>
                <div class="content-text">
                  <p class="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:privacy:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:privacy:text" })}
                  </p>
                </div>
              </a>
            </li>
          </ul>
        </section>
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding"></div>
        )}
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(More))));
