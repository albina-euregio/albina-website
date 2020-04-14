import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class AvalancheSizes extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({
            id: "education:avalanche-sizes:title"
          })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "education:avalanche-sizes:headline"
          })}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <section className="section-padding">
            <header className="section-centered">
              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    href="#anchor-1"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-1:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-1:button:title"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#anchor-2"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-2:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-2:button:title"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#anchor-3"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-3:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-3:button:title"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#anchor-4"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-4:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-4:button:title"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#anchor-5"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-5:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:size-5:button:title"
                    })}
                  </a>
                </li>
              </ul>
            </header>
          </section>

          <section className="section-centered">
            <div className="panel">
              <p>
                <FormattedHTMLMessage id="education:avalanche-sizes:introduction" />
              </p>
            </div>
          </section>

          <section className="section-centered section-dangerscale">
            <div id="anchor-1" className="panel field border">
              <div className="grid">
                <div className="grid-item small-6">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="
                        /content_files/ava_size1-640.webp   640w,
                        /content_files/ava_size1-1280.webp 1280w,
                        /content_files/ava_size1-1920.webp 1920w,
                        /content_files/ava_size1-2560.webp 2560w
                      "
                      sizes="30vw"
                    />
                    <source
                      type="image/jpeg"
                      srcSet="
                        /content_files/ava_size1-640.jpg   640w,
                        /content_files/ava_size1-1280.jpg 1280w,
                        /content_files/ava_size1-1920.jpg 1920w,
                        /content_files/ava_size1-2560.jpg 2560w
                      "
                      sizes="30vw"
                    />
                    <img
                      src="/content_files/ava_size1-640.jpg"
                      alt={this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-1:title"
                      })}
                    />
                  </picture>
                </div>

                <div className="grid-item small-6">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:headline"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-1:title"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:potential-damage"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-1:potential-damage:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-1:potential-damage:2" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:run-out"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-1:run-out:1" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-sizes:headline:typical-dimensions"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-1:typical-dimensions:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-1:typical-dimensions:2" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="anchor-2" className="panel field border">
              <div className="grid">
                <div className="grid-item small-6">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="
                        /content_files/ava_size2-640.webp   640w,
                        /content_files/ava_size2-1280.webp 1280w,
                        /content_files/ava_size2-1920.webp 1920w,
                        /content_files/ava_size2-2560.webp 2560w
                      "
                      sizes="30vw"
                    />
                    <source
                      type="image/jpeg"
                      srcSet="
                        /content_files/ava_size2-640.jpg   640w,
                        /content_files/ava_size2-1280.jpg 1280w,
                        /content_files/ava_size2-1920.jpg 1920w,
                        /content_files/ava_size2-2560.jpg 2560w
                      "
                      sizes="30vw"
                    />
                    <img
                      src="/content_files/ava_size2-640.jpg"
                      alt={this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-2:title"
                      })}
                    />
                  </picture>
                </div>

                <div className="grid-item small-6">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:headline"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-2:title"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:potential-damage"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-2:potential-damage:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-1:potential-damage:2" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:run-out"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-2:run-out:1" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-sizes:headline:typical-dimensions"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-2:typical-dimensions:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-2:typical-dimensions:2" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="anchor-3" className="panel field border">
              <div className="grid">
                <div className="grid-item small-6">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="
                        /content_files/ava_size3-640.webp   640w,
                        /content_files/ava_size3-1280.webp 1280w,
                        /content_files/ava_size3-1920.webp 1920w,
                        /content_files/ava_size3-2560.webp 2560w
                      "
                      sizes="30vw"
                    />
                    <source
                      type="image/jpeg"
                      srcSet="
                        /content_files/ava_size3-640.jpg   640w,
                        /content_files/ava_size3-1280.jpg 1280w,
                        /content_files/ava_size3-1920.jpg 1920w,
                        /content_files/ava_size3-2560.jpg 2560w
                      "
                      sizes="30vw"
                    />
                    <img
                      src="/content_files/ava_size3-640.jpg"
                      alt={this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-3:title"
                      })}
                    />
                  </picture>
                </div>

                <div className="grid-item small-6">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:headline"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-3:title"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:potential-damage"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-3:potential-damage:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-3:potential-damage:2" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:run-out"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-3:run-out:1" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-sizes:headline:typical-dimensions"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-3:typical-dimensions:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-3:typical-dimensions:2" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="anchor-4" className="panel field border">
              <div className="grid">
                <div className="grid-item small-6">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="
                        /content_files/ava_size4-640.webp   640w,
                        /content_files/ava_size4-1280.webp 1280w,
                        /content_files/ava_size4-1920.webp 1920w,
                        /content_files/ava_size4-2560.webp 2560w
                      "
                      sizes="30vw"
                    />
                    <source
                      type="image/jpeg"
                      srcSet="
                        /content_files/ava_size4-640.jpg   640w,
                        /content_files/ava_size4-1280.jpg 1280w,
                        /content_files/ava_size4-1920.jpg 1920w,
                        /content_files/ava_size4-2560.jpg 2560w
                      "
                      sizes="30vw"
                    />
                    <img
                      src="/content_files/ava_size4-640.jpg"
                      alt={this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-4:title"
                      })}
                    />
                  </picture>
                </div>

                <div className="grid-item small-6">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:headline"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-4:title"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:potential-damage"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:potential-damage:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:potential-damage:2" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:potential-damage:3" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:run-out"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:run-out:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:run-out:2" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-sizes:headline:typical-dimensions"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:typical-dimensions:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-4:typical-dimensions:2" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div id="anchor-5" className="panel field border">
              <div className="grid">
                <div className="grid-item small-6">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet="
                        /content_files/ava_size5-640.webp   640w,
                        /content_files/ava_size5-1280.webp 1280w,
                        /content_files/ava_size5-1920.webp 1920w,
                        /content_files/ava_size5-2560.webp 2560w
                      "
                      sizes="30vw"
                    />
                    <source
                      type="image/jpeg"
                      srcSet="
                        /content_files/ava_size5-640.jpg   640w,
                        /content_files/ava_size5-1280.jpg 1280w,
                        /content_files/ava_size5-1920.jpg 1920w,
                        /content_files/ava_size5-2560.jpg 2560w
                      "
                      sizes="30vw"
                    />
                    <img
                      src="/content_files/ava_size5-640.jpg"
                      alt={this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-5:title"
                      })}
                    />
                  </picture>
                </div>

                <div className="grid-item small-6">
                  <div className="panel-header">
                    <p>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:headline"
                      })}
                    </p>
                    <h2>
                      {this.props.intl.formatMessage({
                        id: "education:avalanche-sizes:size-5:title"
                      })}
                    </h2>
                  </div>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:potential-damage"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-5:potential-damage:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-5:potential-damage:2" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-sizes:headline:run-out"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-5:run-out:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-5:run-out:2" />
                    </li>
                  </ul>
                  <h6>
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-sizes:headline:typical-dimensions"
                    })}
                  </h6>
                  <ul>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-5:typical-dimensions:1" />
                    </li>
                    <li>
                      <FormattedHTMLMessage id="education:avalanche-sizes:size-5:typical-dimensions:2" />
                    </li>
                  </ul>
                </div>
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
export default inject("locale")(
  injectIntl(withRouter(observer(AvalancheSizes)))
);
