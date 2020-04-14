import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class Imprint extends StaticPage {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <HTMLHeader
          title={this.props.intl.formatMessage({ id: "imprint:title" })}
        />
        <PageHeadline
          title={this.props.intl.formatMessage({ id: "imprint:headline" })}
          marginal={this.state.headerText}
        />
        <section className="section section-features">
          <section className="section-centered">
            <div className="panel">
              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:media-owner:headline"
                })}
              </h4>

              <p>
                <b>
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:name"
                  })}
                </b>
                <br />

                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:media-owner:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:description"
                  })}
                </a>
                <br />

                <a
                  href="https://maps.tirol.gv.at/tirisMaps/login_pvp.jsp?user=guest&project=tmap_master&query=q_adresse&keyname=ADRCD&keyvalue=5006194"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:address"
                  })}
                </a>
                <br />

                <a
                  href="http://fahrplan.vvt.at/bin/query.exe/dn?L=vs_vvt&Z=6020 Innsbruck%2C Eduard-Walln%C3%B6fer-Platz 3&ZADR=1&MCX=11428189&MCY=47284626&MZ=9"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:how-to-find-us"
                  })}
                </a>
                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:media-owner:phone:1"
                })}
                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:media-owner:phone:2"
                })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:media-owner:email:link"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:email:text"
                  })}
                </a>
                <a
                  href="https://www.tirol.gv.at/telefonbuch/bww/organisationseinheit/oe/300304/#Kontaktformular"
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:contact-form"
                  })}
                </a>

                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:media-owner:url:text"
                })}
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:media-owner:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:media-owner:url"
                  })}
                </a>
                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:media-owner:editorial"
                })}
                <br />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:technical-responsibility:headline"
                })}
              </h4>
              <p>
                {this.props.intl.formatMessage({
                  id: "imprint:technical-responsibility:name"
                })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:technical-responsibility:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:technical-responsibility:url"
                  })}
                </a>
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:concept:headline"
                })}
              </h4>
              <p>
                {this.props.intl.formatMessage({ id: "imprint:concept:name" })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:concept:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({ id: "imprint:concept:url" })}
                </a>
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:implementation:headline"
                })}
              </h4>
              <p>
                {this.props.intl.formatMessage({
                  id: "imprint:implementation:1:name"
                })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:implementation:1:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:implementation:1:url"
                  })}
                </a>
                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:implementation:2:name"
                })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:implementation:2:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:implementation:2:url"
                  })}
                </a>
                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:implementation:3:name"
                })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:implementation:3:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:implementation:3:url"
                  })}
                </a>
                <br />
                {this.props.intl.formatMessage({
                  id: "imprint:implementation:4:name"
                })}
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:implementation:4:url"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:implementation:4:url"
                  })}
                </a>
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:disclosure:headline"
                })}
              </h4>
              <p>
                {this.props.intl.formatMessage({
                  id: "imprint:disclosure:text"
                })}
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:terms-of-use:headline"
                })}
              </h4>
              <p>
                {this.props.intl.formatMessage({
                  id: "imprint:terms-of-use:text"
                })}
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:disclaimer:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="imprint:disclaimer:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:copyright:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="imprint:copyright:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:personal-data:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="imprint:personal-data:text" />
                <br />
                <a
                  href={this.props.intl.formatMessage({
                    id: "imprint:personal-data:privacy:link"
                  })}
                  target="_blank"
                >
                  {this.props.intl.formatMessage({
                    id: "imprint:personal-data:privacy:text"
                  })}
                </a>
                .
              </p>

              <b>
                {this.props.intl.formatMessage({
                  id: "imprint:emails:headline"
                })}
              </b>
              <p>
                <FormattedHTMLMessage id="imprint:emails:text" />
              </p>

              <b>
                {this.props.intl.formatMessage({
                  id: "imprint:links:headline"
                })}
              </b>
              <p>
                <FormattedHTMLMessage id="imprint:links:text" />
              </p>

              <h4>
                {this.props.intl.formatMessage({
                  id: "imprint:final-provisions:headline"
                })}
              </h4>
              <p>
                <FormattedHTMLMessage id="imprint:final-provisions:text" />
              </p>

              <b>
                {this.props.intl.formatMessage({
                  id: "imprint:youtube:headline"
                })}
              </b>
              <p>
                <FormattedHTMLMessage id="imprint:youtube:text" />
              </p>

              <b>
                {this.props.intl.formatMessage({
                  id: "imprint:gender:headline"
                })}
              </b>
              <p>
                <FormattedHTMLMessage id="imprint:gender:text" />
              </p>
            </div>
          </section>
        </section>
        <div className="section-padding"></div>
      </>
    );
  }
}
export default inject("locale")(injectIntl(withRouter(observer(Imprint))));
