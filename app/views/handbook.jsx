import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { video_init } from "../js/video";

class Handbook extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.state.content != "") video_init();
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({
            id: "education:handbook:title"
          })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "education:handbook:headline"
          })}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <section className="section-padding">
            <header className="section-centered">
              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    href="#general"
                    title={this.props.intl.formatMessage({
                      id: "education:handbook:general-information:headline"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:handbook:general-information:headline"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#contents_and_design"
                    title={this.props.intl.formatMessage({
                      id: "education:handbook:contents-design:headline"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:handbook:contents-design:headline"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#basis"
                    title={this.props.intl.formatMessage({
                      id: "education:handbook:assessment:headline"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:handbook:assessment:headline"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#possibilities_and_limits"
                    title={this.props.intl.formatMessage({
                      id: "education:handbook:possibilities:headline"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:handbook:possibilities:headline"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#products_and_channels"
                    title={this.props.intl.formatMessage({
                      id: "education:handbook:products:headline"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:handbook:products:headline"
                    })}
                  </a>
                </li>
              </ul>
            </header>
          </section>

          <section className="section-centered">
            <div id="general" className="panel field border">
              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:handbook:general-information:headline"
                  })}
                </h2>
              </div>

              <h3 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:handbook:general-information:avalanche-report:headline"
                })}
              </h3>
              <FormattedHTMLMessage id="education:handbook:general-information:avalanche-report:text" />

              <h3 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:handbook:general-information:target-audience:headline"
                })}
              </h3>
              <FormattedHTMLMessage id="education:handbook:general-information:target-audience:text" />

              <h3 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:handbook:general-information:time:headline"
                })}
              </h3>
              <FormattedHTMLMessage id="education:handbook:general-information:time:text" />
            </div>

            <section className="section-centered">
              <div id="contents_and_design" className="panel field border">
                <div className="panel-header">
                  <h2>
                    {this.props.intl.formatMessage({
                      id: "education:handbook:contents-design:headline"
                    })}
                  </h2>
                </div>
                <FormattedHTMLMessage id="education:handbook:contents-design:introduction" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id:
                      "education:handbook:contents-design:avalanche-danger:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:avalanche-danger:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id:
                      "education:handbook:contents-design:avalanche-problem:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:avalanche-problem:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id:
                      "education:handbook:contents-design:avalanche-prone-locations:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:avalanche-prone-locations:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id: "education:handbook:contents-design:assessment:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:assessment:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id: "education:handbook:contents-design:snowpack:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:snowpack:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id: "education:handbook:contents-design:tendency:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:tendency:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id: "education:handbook:contents-design:weather:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:weather:text" />

                <h3 className="normal">
                  {this.props.intl.formatMessage({
                    id:
                      "education:handbook:contents-design:flexible-regions:headline"
                  })}
                </h3>
                <FormattedHTMLMessage id="education:handbook:contents-design:flexible-regions:text" />
              </div>

              <section className="section-centered">
                <div id="basis" className="panel field border">
                  <div className="panel-header">
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:handbook:assessment:headline"
                      })}
                    </h2>
                  </div>
                  <FormattedHTMLMessage id="education:handbook:assessment:introduction" />

                  <h3 className="normal">
                    {this.props.intl.formatMessage({
                      id: "education:handbook:assessment:measurements:headline"
                    })}
                  </h3>
                  <FormattedHTMLMessage id="education:handbook:assessment:measurements:text" />

                  <h3 className="normal">
                    {this.props.intl.formatMessage({
                      id: "education:handbook:assessment:observations:headline"
                    })}
                  </h3>
                  <FormattedHTMLMessage id="education:handbook:assessment:observations:text" />

                  <h3 className="normal">
                    {this.props.intl.formatMessage({
                      id:
                        "education:handbook:assessment:stationary-observers:headline"
                    })}
                  </h3>
                  <FormattedHTMLMessage id="education:handbook:assessment:stationary-observers:text" />

                  <h3 className="normal">
                    {this.props.intl.formatMessage({
                      id:
                        "education:handbook:assessment:mobile-observers:headline"
                    })}
                  </h3>
                  <FormattedHTMLMessage id="education:handbook:assessment:mobile-observers:text" />

                  <h3 className="normal">
                    {this.props.intl.formatMessage({
                      id:
                        "education:handbook:assessment:avalanche-releases:headline"
                    })}
                  </h3>
                  <FormattedHTMLMessage id="education:handbook:assessment:avalanche-releases:text" />
                </div>

                <section className="section-centered">
                  <div
                    id="possibilities_and_limits"
                    className="panel field border"
                  >
                    <div className="panel-header">
                      <h2>
                        {this.props.intl.formatMessage({
                          id: "education:handbook:possibilities:headline"
                        })}
                      </h2>
                    </div>
                    <FormattedHTMLMessage id="education:handbook:possibilities:introduction" />

                    <h3 className="normal">
                      {this.props.intl.formatMessage({
                        id: "education:handbook:possibilities:scope:headline"
                      })}
                    </h3>
                    <FormattedHTMLMessage id="education:handbook:possibilities:scope:text" />

                    <h3 className="normal">
                      {this.props.intl.formatMessage({
                        id:
                          "education:handbook:possibilities:independent-assessment:headline"
                      })}
                    </h3>
                    <FormattedHTMLMessage id="education:handbook:possibilities:independent-assessment:text" />

                    <h3 className="normal">
                      {this.props.intl.formatMessage({
                        id:
                          "education:handbook:possibilities:precision:headline"
                      })}
                    </h3>
                    <FormattedHTMLMessage id="education:handbook:possibilities:precision:text" />
                  </div>

                  <section className="section-centered">
                    <div
                      id="products_and_channels"
                      className="panel field border"
                    >
                      <div className="panel-header">
                        <h2>
                          {this.props.intl.formatMessage({
                            id: "education:handbook:products:headline"
                          })}
                        </h2>
                      </div>
                      <FormattedHTMLMessage id="education:handbook:products:introduction" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id:
                            "education:handbook:products:interactive-website:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:interactive-website:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id:
                            "education:handbook:products:printed-version:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:printed-version:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id: "education:handbook:products:blog:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:blog:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id:
                            "education:handbook:products:additional-products:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:additional-products:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id: "education:handbook:products:email:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:email:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id:
                            "education:handbook:products:messenger-services:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:messenger-services:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id: "education:handbook:products:app:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:app:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id: "education:handbook:products:radio:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:radio:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id: "education:handbook:products:print-media:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:print-media:text" />

                      <h3 className="normal">
                        {this.props.intl.formatMessage({
                          id: "education:handbook:products:tv-programs:headline"
                        })}
                      </h3>
                      <FormattedHTMLMessage id="education:handbook:products:tv-programs:text" />
                    </div>
                  </section>
                </section>
              </section>
            </section>
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
export default inject("locale")(injectIntl(withRouter(observer(Handbook))));
