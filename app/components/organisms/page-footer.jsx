import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";
import Menu from "../menu";
import SmFollow from "./sm-follow.jsx";
import FooterLogos from "./footer-logos.jsx";
import {
  parseRawHtml,
  defaultProcessor,
  replaceInternalLinksProcessor
} from "../../util/htmlParser";
import stringInject from "stringinject";

class PageFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { content: "" };
  }

  componentDidMount() {
    window["staticPageStore"].loadBlock("footer_text").then(content => {
      const parsed = JSON.parse(content);
      if (parsed.data && parsed.data.length > 0) {
        const el = parsed.data[0];
        if (
          el &&
          el.attributes &&
          el.attributes.body &&
          el.attributes.body.processed
        ) {
          this.setState({
            content: this._preprocessContent(el.attributes.body.processed)
          });
        }
      }
    });
  }

  _preprocessContent(content) {
    const instructions = [replaceInternalLinksProcessor(), defaultProcessor()];
    return parseRawHtml(content, instructions);
  }

  render() {
    const footerMenuMore = this.props.menuStore.getMenu("footer");
    const footerMenuMain = this.props.menuStore.getMenu("footer-main");

    return (
      <div id="page-footer" className="page-footer">
        <section className="section section-padding page-footer-navigation">
          <div className="grid">
            <div className="grid-item normal-6">
              <Menu
                className="list-inline footer-navigation footer-navigation-more"
                entries={footerMenuMore}
              />
              <Menu
                className="list-plain footer-navigation footer-navigation-main"
                entries={footerMenuMain}
              />
            </div>
            <div className="grid-item normal-6">
              {!config.get("subscribe.buttonHidden") && (
                <p className="page-footer-subscribe">
                  <a
                    href="#subscribeDialog"
                    title={this.props.intl.formatMessage({
                      id: "footer:subscribe:hover"
                    })}
                    className="modal-trigger popup-modal pure-button tooltip"
                  >
                    {this.props.intl.formatMessage({
                      id: "footer:subscribe"
                    })}
                  </a>
                </p>
              )}
              <p className="page-footer-text">{this.state.content}</p>
              <p className="page-footer-interreg">
                <a
                  href={stringInject(config.get("links.interreg"), {
                    lang: window["appStore"].language
                  })}
                  className="logo-interreg tooltip"
                  title={this.props.intl.formatMessage({
                    id: "footer:interreg:hover"
                  })}
                  target="_blank"
                >
                  <span>Interreg</span>
                </a>
              </p>
            </div>
            <div className="grid-item all-12">
              <p className="page-footer-top">
                <a
                  href="#page-main"
                  className="icon-arrow-up tooltip"
                  title={this.props.intl.formatMessage({
                    id: "footer:top:hover"
                  })}
                  data-scroll=""
                >
                  <span>Top</span>
                </a>
              </p>
              {/*
                config.get('developmentMode') && (
                <p className="page-footer-dev-version">
                  <span>
                    Draft version - for internal use: v
                    {config.get('version')}
                  </span>
                </p>
              )
                */}
            </div>
          </div>
        </section>
        {!config.get("footer.iconsHidden") && <FooterLogos />}

        <SmFollow />
      </div>
    );
  }
}
export default inject("locale")(injectIntl(observer(PageFooter)));
