import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class Education extends StaticPage {
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
          <ul className="list-plain features">
            <li className="feature-item">
              <a
                href="/education/dangerscale"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_danger-scale.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-scale:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:danger-scale:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:text"
                    })}
                  </p>
                </div>
              </a>
            </li>

            <li className="feature-item">
              <a href="/education/avp" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_avalanche-problem.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-problems:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-problems:text"
                    })}
                  </p>
                </div>
              </a>
            </li>

            <li className="feature-item">
              <a href="/education/matrix" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_matrix.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:eaws-matrix:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:eaws-matrix:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:eaws-matrix:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:eaws-matrix:text"
                    })}
                  </p>
                </div>
              </a>
            </li>

            <li className="feature-item">
              <a
                href="/education/avalanche-sizes"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_avalanche-size.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:text"
                    })}
                  </p>
                </div>
              </a>
            </li>

            <li className="feature-item">
              <a
                href="/education/danger-patterns"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_danger-pattern.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:danger-patterns:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:text"
                    })}
                  </p>
                </div>
              </a>
            </li>

            <li className="feature-item">
              <a
                href={this.props.intl.formatMessage({
                  id: "education:glossary:link"
                })}
                target="_blank"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_glossary.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:glossary:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:glossary:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:glossary:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:glossary:text"
                    })}
                  </p>
                </div>
              </a>
            </li>

            <li className="feature-item">
              <a
                href="/education/handbook"
                title="Handbook"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_handbook.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:handbook:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:handbook:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:handbook:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:handbook:text"
                    })}
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
export default inject("locale")(injectIntl(withRouter(observer(Education))));
