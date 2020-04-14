import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class AvalancheProblems extends StaticPage {
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
          <section className="section-padding">
            <header className="section-centered">
              <ul className="list-inline list-buttongroup-dense">
                <li>
                  <a
                    href="#new_snow"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:new-snow:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-problems:new-snow:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#wind_drifted_snow"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wind-drifted-snow:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-problems:wind-drifted-snow:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#persistent_weak_layers"
                    title={this.props.intl.formatMessage({
                      id:
                        "education:avalanche-problems:persistent-weak-layers:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-problems:persistent-weak-layers:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#wet_snow"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wet-snow:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wet-snow:button:text"
                    })}
                  </a>
                </li>
                <li>
                  <a
                    href="#gliding_snow"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:gliding-snow:title"
                    })}
                    className="secondary pure-button"
                    data-scroll
                  >
                    {this.props.intl.formatMessage({
                      id:
                        "education:avalanche-problems:gliding-snow:button:text"
                    })}
                  </a>
                </li>
              </ul>
            </header>
          </section>

          <section className="section-centered">
            <div className="panel">
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:introduction" />
              </p>
            </div>
          </section>

          <section className="section-centered">
            <div id="new_snow" className="panel field border">
              <div className="panel-image">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="
                      /content_files/schnee_neuschnee_0-640.webp   640w,
                      /content_files/schnee_neuschnee_0-1280.webp 1280w,
                      /content_files/schnee_neuschnee_0-1920.webp 1920w,
                      /content_files/schnee_neuschnee_0-2560.webp 2560w,
                      /content_files/schnee_neuschnee_0-3200.webp 3200w
                    "
                  />
                  <source
                    type="image/jpeg"
                    srcSet="
                      /content_files/schnee_neuschnee_0-640.jpg   640w,
                      /content_files/schnee_neuschnee_0-1280.jpg 1280w,
                      /content_files/schnee_neuschnee_0-1920.jpg 1920w,
                      /content_files/schnee_neuschnee_0-2560.jpg 2560w,
                      /content_files/schnee_neuschnee_0-3200.jpg 3200w,
                      /content_files/schnee_neuschnee_0.jpg      4000w
                    "
                  />
                  <img
                    src="/content_files/schnee_neuschnee_0-1280.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:new-snow:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:new-snow:title"
                    })}
                  />
                </picture>
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:avalanche-problems:new-snow:title"
                  })}
                </h2>
              </div>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:what"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:characteristics" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:expected-avalanche-types"
                })}
              </h5>
              <ul>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:new-snow:expected-avalanche-types:1" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:new-snow:expected-avalanche-types:2" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:new-snow:expected-avalanche-types:3" />
                </li>
              </ul>
              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:where"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:spatial-distribution"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:spatial-distribution" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:weak-layers"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:weak-layers" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:why"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:release-characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:release-characteristics" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:when"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:duration"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:duration" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:how-to-manage"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:identification"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:identification" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:travel-advice"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:new-snow:travel-advice" />
              </p>
            </div>

            <div id="wind_drifted_snow" className="panel field border">
              <div className="panel-image">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="
                      /content_files/schnee_triebschnee_2-640.webp   640w,
                      /content_files/schnee_triebschnee_2-1280.webp 1280w,
                      /content_files/schnee_triebschnee_2-1920.webp 1920w,
                      /content_files/schnee_triebschnee_2-2560.webp 2560w,
                      /content_files/schnee_triebschnee_2-3200.webp 3200w
                    "
                  />
                  <source
                    type="image/jpeg"
                    srcSet="
                      /content_files/schnee_triebschnee_2-640.jpg   640w,
                      /content_files/schnee_triebschnee_2-1280.jpg 1280w,
                      /content_files/schnee_triebschnee_2-1920.jpg 1920w,
                      /content_files/schnee_triebschnee_2-2560.jpg 2560w,
                      /content_files/schnee_triebschnee_2-3200.jpg 3200w,
                      /content_files/schnee_triebschnee_2.jpg      4000w
                    "
                  />
                  <img
                    src="/content_files/schnee_triebschnee_2-1280.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wind-drifted-snow:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wind-drifted-snow:title"
                    })}
                  />
                </picture>
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:avalanche-problems:wind-drifted-snow:title"
                  })}
                </h2>
              </div>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:what"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:characteristics" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:expected-avalanche-types"
                })}
              </h5>
              <ul>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:expected-avalanche-types:1" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:expected-avalanche-types:2" />
                </li>
              </ul>
              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:where"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:spatial-distribution"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:spatial-distribution" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:weak-layers"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:weak-layers" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:why"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:release-characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:release-characteristics" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:when"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:duration"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:duration" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:how-to-manage"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:identification"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:identification" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:travel-advice"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wind-drifted-snow:travel-advice" />
              </p>
            </div>

            <div id="persistent_weak_layers" className="panel field border">
              <div className="panel-image">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="
                      /content_files/schnee_altschnee_3-640.webp   640w,
                      /content_files/schnee_altschnee_3-1280.webp 1280w,
                      /content_files/schnee_altschnee_3-1920.webp 1920w,
                      /content_files/schnee_altschnee_3-2560.webp 2560w,
                      /content_files/schnee_altschnee_3-3200.webp 3200w
                    "
                  />
                  <source
                    type="image/jpeg"
                    srcSet="
                      /content_files/schnee_altschnee_3-640.jpg   640w,
                      /content_files/schnee_altschnee_3-1280.jpg 1280w,
                      /content_files/schnee_altschnee_3-1920.jpg 1920w,
                      /content_files/schnee_altschnee_3-2560.jpg 2560w,
                      /content_files/schnee_altschnee_3-3200.jpg 3200w,
                      /content_files/schnee_altschnee_3.jpg      4000w
                    "
                  />
                  <img
                    src="/content_files/schnee_altschnee_3-1280.jpg"
                    title={this.props.intl.formatMessage({
                      id:
                        "education:avalanche-problems:persistent-weak-layers:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id:
                        "education:avalanche-problems:persistent-weak-layers:title"
                    })}
                  />
                </picture>
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id:
                      "education:avalanche-problems:persistent-weak-layers:title"
                  })}
                </h2>
              </div>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:what"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:characteristics" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:expected-avalanche-types"
                })}
              </h5>
              <ul>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:expected-avalanche-types:1" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:expected-avalanche-types:2" />
                </li>
              </ul>
              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:where"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:spatial-distribution"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:spatial-distribution" />
              </p>
              <h5 className="normal">
                Position of weak layers in the snowpack
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:weak-layers" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:why"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:release-characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:release-characteristics" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:when"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:duration"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:duration" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:how-to-manage"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:identification"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:identification" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:travel-advice"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:persistent-weak-layers:travel-advice" />
              </p>
            </div>

            <div id="wet_snow" className="panel field border">
              <div className="panel-image">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="
                      /content_files/schnee_nassschnee_0-640.webp   640w,
                      /content_files/schnee_nassschnee_0-1280.webp 1280w,
                      /content_files/schnee_nassschnee_0-1920.webp 1920w,
                      /content_files/schnee_nassschnee_0-2560.webp 2560w,
                      /content_files/schnee_nassschnee_0-3200.webp 3200w
                    "
                  />
                  <source
                    type="image/jpeg"
                    srcSet="
                      /content_files/schnee_nassschnee_0-640.jpg   640w,
                      /content_files/schnee_nassschnee_0-1280.jpg 1280w,
                      /content_files/schnee_nassschnee_0-1920.jpg 1920w,
                      /content_files/schnee_nassschnee_0-2560.jpg 2560w,
                      /content_files/schnee_nassschnee_0-3200.jpg 3200w,
                      /content_files/schnee_nassschnee_0.jpg      4000w
                    "
                  />
                  <img
                    src="/content_files/schnee_nassschnee_0-1280.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wet-snow:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:wet-snow:title"
                    })}
                  />
                </picture>
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:avalanche-problems:wet-snow:title"
                  })}
                </h2>
              </div>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:what"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:characteristics" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:expected-avalanche-types"
                })}
              </h5>
              <ul>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:expected-avalanche-types:1" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:expected-avalanche-types:2" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:expected-avalanche-types:3" />
                </li>
              </ul>
              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:where"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:spatial-distribution"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:spatial-distribution" />
              </p>
              <h5 className="normal">
                Position of weak layers in the snowpack
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:weak-layers" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:why"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:release-characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:release-characteristics" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:when"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:duration"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:duration" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:how-to-manage"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:identification"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:identification" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:travel-advice"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:wet-snow:travel-advice" />
              </p>
            </div>

            <div id="gliding_snow" className="panel field border">
              <div className="panel-image">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="
                      /content_files/schnee_gleitschnee_0-640.webp   640w,
                      /content_files/schnee_gleitschnee_0-1280.webp 1280w,
                      /content_files/schnee_gleitschnee_0-1920.webp 1920w,
                      /content_files/schnee_gleitschnee_0-2560.webp 2560w,
                      /content_files/schnee_gleitschnee_0-3200.webp 3200w
                    "
                  />
                  <source
                    type="image/jpeg"
                    srcSet="
                      /content_files/schnee_gleitschnee_0-640.jpg   640w,
                      /content_files/schnee_gleitschnee_0-1280.jpg 1280w,
                      /content_files/schnee_gleitschnee_0-1920.jpg 1920w,
                      /content_files/schnee_gleitschnee_0-2560.jpg 2560w,
                      /content_files/schnee_gleitschnee_0-3200.jpg 3200w,
                      /content_files/schnee_gleitschnee_0.jpg      4000w
                    "
                  />
                  <img
                    src="/content_files/schnee_gleitschnee_0-1280.jpg"
                    title={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:gliding-snow:title"
                    })}
                    alt={this.props.intl.formatMessage({
                      id: "education:avalanche-problems:gliding-snow:title"
                    })}
                  />
                </picture>
              </div>

              <div className="panel-header">
                <h2>
                  {this.props.intl.formatMessage({
                    id: "education:avalanche-problems:gliding-snow:title"
                  })}
                </h2>
              </div>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:what"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:characteristics" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:expected-avalanche-types"
                })}
              </h5>
              <ul>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:expected-avalanche-types:1" />
                </li>
                <li>
                  <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:expected-avalanche-types:2" />
                </li>
              </ul>
              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:where"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:spatial-distribution"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:spatial-distribution" />
              </p>
              <h5 className="normal">
                <FormattedHTMLMessage id="education:avalanche-problems:headline:weak-layers" />
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:weak-layers" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:why"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id:
                    "education:avalanche-problems:headline:release-characteristics"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:release-characteristics" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:when"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:duration"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:duration" />
              </p>

              <h6>
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:how-to-manage"
                })}
              </h6>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:identification"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:identification" />
              </p>
              <h5 className="normal">
                {this.props.intl.formatMessage({
                  id: "education:avalanche-problems:headline:travel-advice"
                })}
              </h5>
              <p>
                <FormattedHTMLMessage id="education:avalanche-problems:gliding-snow:travel-advice" />
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
export default inject("locale")(
  injectIntl(withRouter(observer(AvalancheProblems)))
);
