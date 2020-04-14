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
        <HTMLHeader title={this.state.title} />
        <PageHeadline
          title={this.state.title}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          {this.state.content}
          <div className="clearfix" />
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
export default inject("locale")(injectIntl(withRouter(observer(Handbook))));
