import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class EawsMatrix extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({
            id: "education:eaws-matrix:title"
          })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "education:eaws-matrix:headline"
          })}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <section className="section-centered">
            <div className="panel">
              <p>
                <FormattedHTMLMessage id="education:eaws-matrix:introduction" />
              </p>
              <table
                style={{
                  width: "100%",
                  border: "0px solid #000",
                  textAlign: "center"
                }}
              >
                <tbody>
                  <tr>
                    <td>
                      <img
                        alt={this.props.intl.formatMessage({
                          id: "education:eaws-matrix:image:alt"
                        })}
                        data-entity-type="file"
                        data-entity-uuid="d397a528-6f80-4ea3-afdf-255ab9ae681d"
                        src={this.props.intl.formatMessage({
                          id: "education:eaws-matrix:image:url"
                        })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="small" style={{ textAlign: "center" }}>
                <FormattedHTMLMessage id="education:eaws-matrix:image:caption" />
              </p>
              <h2>
                <FormattedHTMLMessage id="education:eaws-matrix:subheadline" />
              </h2>
              <p>
                <FormattedHTMLMessage id="education:eaws-matrix:text:1" />
              </p>
              <p>
                <FormattedHTMLMessage id="education:eaws-matrix:text:2" />
              </p>
              <p>
                <FormattedHTMLMessage id="education:eaws-matrix:text:3" />
              </p>
              <p>
                <FormattedHTMLMessage id="education:eaws-matrix:text:4" />
              </p>
            </div>
          </section>
          <section className="section-centered section-context">
            <div className="panel">
              <h2 className="subheader">
                {this.props.intl.formatMessage({
                  id: "button:education:headline"
                })}
              </h2>
              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:education:danger-scale:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:education:danger-scale:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:education:danger-scale:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:education:avalanche-problems:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:education:avalanche-problems:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:education:avalanche-problems:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:education:avalanche-sizes:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:education:avalanche-sizes:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:education:avalanche-sizes:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:education:danger-patterns:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:education:danger-patterns:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:education:danger-patterns:text"
                    })}
                  </a>
                </li>
              </ul>
              <h2 className="subheader">
                {this.props.intl.formatMessage({ id: "button:snow:headline" })}
              </h2>

              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:snow:hn:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:snow:hn:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:snow:hn:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:snow:hs:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:snow:hs:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:snow:hs:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:snow:ff:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:snow:ff:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:snow:ff:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    className="secondary pure-button"
                    href={this.props.intl.formatMessage({
                      id: "button:snow:stations:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:snow:stations:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:snow:stations:text"
                    })}
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </section>
        <SmShare />
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(EawsMatrix))));
