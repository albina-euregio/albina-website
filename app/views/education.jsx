import React from "react"; // eslint-disable-line no-unused-vars

import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { Link } from "react-router-dom";

class Education extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({
            id: "education:overview:title"
          })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "education:overview:headline"
          })}
        />
        <section className="section section-features">
          <ul className="list-plain features">
            <li className="feature-item">
              <Link
                to="/education/danger-scale"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_danger-scale.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:danger-scale:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:danger-scale:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:danger-scale:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:danger-scale:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link
                to="/education/avalanche-problems"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_avalanche-problem.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:avalanche-problems:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:avalanche-problems:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:avalanche-problems:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:avalanche-problems:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link to="/education/matrix" className="linkbox linkbox-feature">
                <div className="content-image">
                  <img
                    src="/content_files/feature_matrix.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:eaws-matrix:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:eaws-matrix:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:eaws-matrix:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:eaws-matrix:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link
                to="/education/avalanche-sizes"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_avalanche-size.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:avalanche-sizes:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:avalanche-sizes:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:avalanche-sizes:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:avalanche-sizes:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link
                to="/education/danger-patterns"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_danger-pattern.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:danger-patterns:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:danger-patterns:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:danger-patterns:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:danger-patterns:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link
                to="/education/community"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_community.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:community:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:community:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:community:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:community:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link
                to={this.props.intl.formatMessage({
                  id: "education:overview:glossary:link"
                })}
                rel="noopener noreferrer"
                target="_blank"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_glossary.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:glossary:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:glossary:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:glossary:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:glossary:text"
                    })}
                  </p>
                </div>
              </Link>
            </li>

            <li className="feature-item">
              <Link
                to="/education/handbook"
                title="Handbook"
                className="linkbox linkbox-feature"
              >
                <div className="content-image">
                  <img
                    src="/content_files/feature_handbook.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:overview:handbook:image:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:overview:handbook:image:alt"
                    })}
                    className=""
                  />
                </div>
                <div className="content-text">
                  <p className="h1 subheader">
                    {this.props.intl.formatMessage({
                      id: "education:overview:handbook:headline"
                    })}
                  </p>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "education:overview:handbook:text"
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
export default injectIntl(observer(Education));
