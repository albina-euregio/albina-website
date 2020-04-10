import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class About extends StaticPage {
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
                {this.props.intl.formatMessage({ id: "about:introduction" })}
              </p>

              <h2>
                {this.props.intl.formatMessage({ id: "about:idea:headline" })}
              </h2>
              <p>
                <FormattedHTMLMessage id="about:idea:text" />
              </p>

              <h2>
                {this.props.intl.formatMessage({
                  id: "about:partners:headline"
                })}
              </h2>
              <p>
                {this.props.intl.formatMessage({ id: "about:partners:text" })}
              </p>
            </div>
          </section>

          <section className="section-centered section-dangerscale">
            <div id="evtz" className="panel field border">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/euregio.png"
                    alt={this.props.intl.formatMessage({
                      id: "about:partner:evtz:image:alt"
                    })}
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "about:partner:text"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "about:partner:evtz:name"
                      })}
                    </h2>
                  </div>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "about:partner:evtz:text"
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div id="tirol" className="panel field border">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/land_tirol.png"
                    alt={this.props.intl.formatMessage({
                      id: "about:partner:AT-07:image:alt"
                    })}
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "about:partner:text"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "about:partner:AT-07:name"
                      })}
                    </h2>
                  </div>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "about:partner:AT-07:text"
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div id="south-tyrol" className="panel field border">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/bozen.png"
                    alt={this.props.intl.formatMessage({
                      id: "about:partner:IT-32-BZ:image:alt"
                    })}
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "about:partner:text"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "about:partner:IT-32-BZ:name"
                      })}
                    </h2>
                  </div>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "about:partner:IT-32-BZ:text"
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div id="trentino" className="panel field border">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/meteo_trentino.png"
                    alt={this.props.intl.formatMessage({
                      id: "about:partner:IT-32-TN:image:alt"
                    })}
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "about:partner:text"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "about:partner:IT-32-TN:name"
                      })}
                    </h2>
                  </div>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "about:partner:IT-32-TN:text"
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div id="univie" className="panel field border">
              <div className="grid">
                <div className="grid-item small-3">
                  <img
                    src="/content_files/uniwien.jpg"
                    alt={this.props.intl.formatMessage({
                      id: "about:partner:univie:image:alt"
                    })}
                  />
                </div>

                <div className="grid-item small-9">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "about:partner:text"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "about:partner:univie:name"
                      })}
                    </h2>
                  </div>
                  <p>
                    {this.props.intl.formatMessage({
                      id: "about:partner:univie:text"
                    })}
                  </p>
                </div>
              </div>
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
export default inject("locale")(injectIntl(withRouter(observer(About))));
