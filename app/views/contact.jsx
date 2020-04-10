import React from "react"; // eslint-disable-line no-unused-vars
import { withRouter } from "react-router-dom";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import StaticPage from "./staticPage";
import PageHeadline from "../components/organisms/page-headline";
import SmShare from "../components/organisms/sm-share";
import HTMLHeader from "../components/organisms/html-header";

class Contact extends StaticPage {
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
            <div id="tirol" className="panel field border">
              <h1 className="subheader">
                {this.props.intl.formatMessage({ id: "contact:AT-07:name" })}
                <span className="icon-"></span>
              </h1>

              <p>
                <FormattedHTMLMessage id="contact:AT-07:address" />
              </p>
              <p>
                <a
                  className="pure-button"
                  href={this.props.intl.formatMessage({
                    id: "contact:AT-07:email:link"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "contact:AT-07:email:text"
                  })}
                </a>
                <br />
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
                      <a
                        href="https://www.google.com/maps/place/Lawinenwarndienst+Tirol/@47.2642743,11.3939777,17z/data=!3m1!4b1!4m5!3m4!1s0x479d6bf9618f27a1:0xc4f6dc81d0af210b!8m2!3d47.2642743!4d11.3961664?hl=de"
                        target="_blank"
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          alt={this.props.intl.formatMessage({
                            id: "contact:AT-07:image:alt"
                          })}
                          data-entity-type="file"
                          data-entity-uuid="d397a528-6f80-4ea3-afdf-255ab9ae681d"
                          src="/content_files/google_tirol.png"
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="southtyrol" className="panel field border">
              <h1 className="subheader">
                {this.props.intl.formatMessage({ id: "contact:IT-32-BZ:name" })}
                <span className="icon-"></span>
              </h1>
              <p>
                <FormattedHTMLMessage id="contact:IT-32-BZ:address" />
              </p>
              <p>
                <a
                  className="pure-button"
                  href={this.props.intl.formatMessage({
                    id: "contact:IT-32-BZ:email:link"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "contact:IT-32-BZ:email:text"
                  })}
                </a>
                <br />
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
                      <a
                        href="https://www.google.com/maps/place/Landeswetterdienst/@46.49453,11.318514,16z/data=!4m5!3m4!1s0x0:0xa16dec6da87e8ff8!8m2!3d46.4945295!4d11.3185143?hl=de"
                        target="_blank"
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          alt={this.props.intl.formatMessage({
                            id: "contact:IT-32-BZ:image:alt"
                          })}
                          data-entity-type="file"
                          data-entity-uuid="d397a528-6f80-4ea3-afdf-255ab9ae681d"
                          src="/content_files/google_bozen.png"
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div id="trentino" className="panel field border">
              <h1 className="subheader">
                {this.props.intl.formatMessage({ id: "contact:IT-32-TN:name" })}
                <span className="icon-"></span>
              </h1>
              <p>
                <FormattedHTMLMessage id="contact:IT-32-TN:address" />
              </p>
              <p>
                <a
                  className="pure-button"
                  href={this.props.intl.formatMessage({
                    id: "contact:IT-32-TN:email:link"
                  })}
                >
                  {this.props.intl.formatMessage({
                    id: "contact:IT-32-TN:email:text"
                  })}
                </a>
                <br />
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
                      <a
                        href="https://www.google.com/maps/place/MeteoTrentino/@46.072444,11.122012,16z/data=!4m5!3m4!1s0x0:0x657fd54b53664f9d!8m2!3d46.072444!4d11.1220116?hl=de"
                        target="_blank"
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          alt={this.props.intl.formatMessage({
                            id: "contact:IT-32-BZ:image:alt"
                          })}
                          data-entity-type="file"
                          data-entity-uuid="d397a528-6f80-4ea3-afdf-255ab9ae681d"
                          src="/content_files/google_trentino.png"
                        />
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
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
export default inject("locale")(injectIntl(withRouter(observer(Contact))));
