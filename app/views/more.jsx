import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter, Link } from "react-router-dom";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class More extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "more:title" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "more:headline" })}
        />
        <section className="section section-features">
          <ul className="list-plain features">
            <li className="feature-item">
              <Link
                to="/more/archive"
                title={this.props.intl.formatMessage({
                  id: "more:archive:headline"
                })}
                className="linkbox linkbox-feature tooltip"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_archive.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:archive:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:archive:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:archive:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:archive:text" })}
                  </p>
                </div>
                }
              </Link>
            </li>
            <li className="feature-item">
              <Link
                to="/more/about"
                title={this.props.intl.formatMessage({
                  id: "more:about:headline"
                })}
                className="linkbox linkbox-feature tooltip"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_about.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:about:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:about:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:about:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:about:text" })}
                  </p>
                </div>
              </Link>
            </li>
            <li className="feature-item">
              <Link
                to="/more/contact"
                title={this.props.intl.formatMessage({
                  id: "more:contact:headline"
                })}
                className="linkbox linkbox-feature tooltip"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_contact.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:contact:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:contact:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:contact:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:contact:text" })}
                  </p>
                </div>
              </Link>
            </li>
            <li className="feature-item">
              <Link
                to="/more/imprint"
                title={this.props.intl.formatMessage({
                  id: "more:imprint:headline"
                })}
                className="linkbox linkbox-feature tooltip"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_imprint.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:imprint:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:imprint:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:imprint:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:imprint:text" })}
                  </p>
                </div>
              </Link>
            </li>
            <li className="feature-item">
              <Link
                to="/more/privacy"
                title={this.props.intl.formatMessage({
                  id: "more:privacy:headline"
                })}
                className="linkbox linkbox-feature tooltip"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_privacy.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:privacy:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:privacy:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:privacy:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({ id: "more:privacy:text" })}
                  </p>
                </div>
              </Link>
            </li>
            <li className="feature-item">
              <Link
                to="/more/open-data"
                title={this.props.intl.formatMessage({
                  id: "more:open-data:headline"
                })}
                className="linkbox linkbox-feature tooltip"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_open_data.jpg"
                    title={this.props.intl.formatMessage({
                      id: "more:open-data:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "more:open-data:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "more:open-data:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "more:open-data:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>
          </ul>
        </section>
        <SmShare />
      </>
    );
  }
}
export default injectIntl(withRouter(observer(More)));
