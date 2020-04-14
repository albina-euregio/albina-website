import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class DangerScale extends StaticPage {
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
          <section className="section-centered">
            <div className="panel">
              <p>
                <FormattedHTMLMessage id="education:danger-scale:introduction:1" />
              </p>

              <ul>
                <li>
                  <FormattedHTMLMessage id="education:danger-scale:introduction:parameter:1" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:danger-scale:introduction:parameter:2" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:danger-scale:introduction:parameter:3" />
                </li>
              </ul>

              <p>
                <FormattedHTMLMessage id="education:danger-scale:introduction:2" />
              </p>

              <h2>
                <FormattedHTMLMessage id="education:danger-scale:headline:overview" />
              </h2>
            </div>
          </section>

          <section className="section-centered section-dangerscale">
            <div id="level5" className="panel field border warning-level-5">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/level_5.png"
                    alt={this.props.intl.formatMessage({
                      id: "education:danger-scale:5:image:alt"
                    })}
                    className="warning-level-icon"
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:headline:danger-level"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:5:headline"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:5:description:headline"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:5:description:text" />
                  </p>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:headline:recommendation"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:5:recommendation:text" />
                  </p>
                  <h6>
                    <FormattedHTMLMessage id="education:danger-scale:5:frequency" />
                  </h6>
                </div>
              </div>
            </div>
            <div id="level4" className="panel field border warning-level-4">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/level_4.png"
                    alt={this.props.intl.formatMessage({
                      id: "education:danger-scale:4:image:alt"
                    })}
                    className="warning-level-icon"
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:headline:danger-level"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:4:headline"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:4:description:headline"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:4:description:text" />
                  </p>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:headline:recommendation"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:4:recommendation:text" />
                  </p>
                  <h6>
                    <FormattedHTMLMessage id="education:danger-scale:4:frequency" />
                  </h6>
                </div>
              </div>
            </div>
            <div id="level3" className="panel field border warning-level-3">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/level_3.png"
                    alt={this.props.intl.formatMessage({
                      id: "education:danger-scale:3:image:alt"
                    })}
                    className="warning-level-icon"
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:headline:danger-level"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:3:headline"
                      })}
                    </h2>
                  </div>

                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:3:description:headline"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:3:description:text" />
                  </p>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:headline:recommendation"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:3:recommendation:text" />
                  </p>
                  <h6>
                    <FormattedHTMLMessage id="education:danger-scale:3:frequency" />
                  </h6>
                </div>
              </div>
            </div>
            <div id="level2" className="panel field border warning-level-2">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/level_2.png"
                    alt="Danger Level 2"
                    className="warning-level-icon"
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:headline:danger-level"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:2:headline"
                      })}
                    </h2>
                  </div>

                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:2:description:headline"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:2:description:text" />
                  </p>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:headline:recommendation"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:2:recommendation:text" />
                  </p>
                  <h6>
                    <FormattedHTMLMessage id="education:danger-scale:2:frequency" />
                  </h6>
                </div>
              </div>
            </div>
            <div id="level1" className="panel field border warning-level-1">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/level_1.png"
                    alt={this.props.intl.formatMessage({
                      id: "education:danger-scale:1:image:alt"
                    })}
                    className="warning-level-icon"
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:headline:danger-level"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:danger-scale:1:headline"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:1:description:headline"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:1:description:text" />
                  </p>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:danger-scale:headline:recommendation"
                    })}
                  </h6>
                  <p>
                    <FormattedHTMLMessage id="education:danger-scale:1:recommendation:text" />
                  </p>
                  <h6>
                    <FormattedHTMLMessage id="education:danger-scale:1:frequency" />
                  </h6>
                </div>
              </div>
            </div>
          </section>

          <section className="section-centered">
            <div className="panel">
              <h2>
                {this.props.intl.formatMessage({
                  id: "education:danger-scale:background:headline"
                })}
              </h2>

              <p>
                <FormattedHTMLMessage id="education:danger-scale:background:text" />
              </p>

              <p>
                <a
                  href={this.props.intl.formatMessage({
                    id: "education:danger-scale:background:pdf:url"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "education:danger-scale:background:pdf:text"
                  })}
                </a>
              </p>

              <h6>
                <FormattedHTMLMessage id="education:danger-scale:background:danger-levels:headline" />
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:background:danger-levels:text" />
              </p>

              <h6>
                <FormattedHTMLMessage id="education:danger-scale:background:definitions:headline" />
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:background:definitions:text:1" />
              </p>

              <ul>
                <li>
                  {this.props.intl.formatMessage({
                    id: "education:danger-scale:introduction:parameter:1"
                  })}
                </li>
                <li>
                  {this.props.intl.formatMessage({
                    id: "education:danger-scale:introduction:parameter:2"
                  })}
                </li>
                <li>
                  {this.props.intl.formatMessage({
                    id: "education:danger-scale:introduction:parameter:3"
                  })}
                </li>
              </ul>

              <p>
                <FormattedHTMLMessage id="education:danger-scale:background:definitions:text:2" />
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
                        style={{ align: "middle", height: "50%", width: "50%" }}
                        alt={this.props.intl.formatMessage({
                          id:
                            "education:danger-scale:background:definitions:image:alt"
                        })}
                        data-entity-type="file"
                        data-entity-uuid="374a9b53-8018-40c7-9e8d-6ac15fa05968"
                        src={this.props.intl.formatMessage({
                          id:
                            "education:danger-scale:background:definitions:image:url"
                        })}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <p className="small" style={{ textAlign: "center" }}>
                <FormattedHTMLMessage id="education:danger-scale:background:definitions:image:caption" />
              </p>

              <p>
                <FormattedHTMLMessage id="education:danger-scale:background:definitions:text:3" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:danger-scale:background:frequency:headline"
                })}
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:background:frequency:text" />
              </p>

              <h2>
                {this.props.intl.formatMessage({
                  id: "education:danger-scale:characteristics:headline"
                })}
              </h2>

              <h6>
                {this.props.intl.formatMessage({
                  id:
                    "education:danger-scale:characteristics:wind-slabs:headline"
                })}
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:characteristics:wind-slabs:text" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id:
                    "education:danger-scale:characteristics:persistent-weak-layers:headline"
                })}
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:characteristics:persistent-weak-layers:text" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:danger-scale:characteristics:level-4:headline"
                })}
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:characteristics:level-4:text" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id:
                    "education:danger-scale:characteristics:wet-glide:headline"
                })}
              </h6>
              <p>
                <FormattedHTMLMessage id="education:danger-scale:characteristics:wet-glide:text" />
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
                      id: "button:education:eaws-matrix:link"
                    })}
                    title={this.props.intl.formatMessage({
                      id: "button:education:eaws-matrix:text"
                    })}
                  >
                    {this.props.intl.formatMessage({
                      id: "button:education:eaws-matrix:text"
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
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding"></div>
        )}
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(DangerScale))));
