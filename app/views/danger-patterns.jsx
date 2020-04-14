import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";
import { video_init } from "../js/video";

class DangerPatterns extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.state.content != "") video_init();
    return (
      <>
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <section className="section-padding">
            <header className="section-centered">
              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    href="#dp1"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp1:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp1:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp2"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp2:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp2:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp3"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp3:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp3:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp4"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp4:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp4:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp5"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp5:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp5:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp6"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp6:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp6:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp7"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp7:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp7:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp8"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp8:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp8:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp9"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp9:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp9:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#dp10"
                    title={this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp10:button:text"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:danger-patterns:dp10:button:text"
                    })}
                  </a>
                </li>
              </ul>
            </header>
          </section>

          <section className="section-centered">
            <div className="panel">
              <p>
                <FormattedHTMLMessage id="education:danger-patterns:introduction" />
              </p>
            </div>
          </section>

          <section className="section-centered">
            <div id="dp1" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm1.jpg"
                  title="gm1"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp1:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp1:headline"
                  })}
                </h2>
              </div>
              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp1:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/rdYIWWzOWWY"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp2" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm2.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp2:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp2:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp2:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/Pnb-sSwtccc"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp3" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm3.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp3:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp3:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp3:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/Hegy61JcLsQ"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp4" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm4.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp4:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp4:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp4:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/OQWqjRIqf3c"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp5" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm5.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp5:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp5:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp5:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/Eo7BJEVRMqc"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp6" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm6.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp6:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp6:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp6:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/CXnfPRZIIao"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp7" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm7.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp7:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp7:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp7:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/FIZpZvthr84"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp8" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm8.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp8:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp8:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp8:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/AYEEA14IVOk"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp9" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm9.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp9:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp9:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp9:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/X3vNbaO4lCA"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>

            <div id="dp10" className="panel field border">
              <div className="panel-image">
                <img
                  src="/content_files/gm10.jpg"
                  alt={this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp10:image:alt"
                  })}
                />
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:danger-patterns:dp10:headline"
                  })}
                </h2>
              </div>

              <p>
                <FormattedHTMLMessage id="education:danger-patterns:dp10:text" />
              </p>

              <div className="fluidvids" style={{ paddingTop: "55%" }}>
                <iframe
                  src="https://www.youtube.com/embed/MqELgeDEFxY"
                  webkitAllowFullScreen
                  mozallowFullScreen
                  allowFullScreen
                  className="fluidvids-item"
                  data-fluidvids="loaded"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
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
        {this.state.sharable ? (
          <SmShare />
        ) : (
          <div className="section-padding"></div>
        )}
      </>
    );
  }
}
export default inject("locale")(
  injectIntl(withRouter(observer(DangerPatterns)))
);
