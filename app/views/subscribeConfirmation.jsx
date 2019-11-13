import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import Base from "../base";
import PageHeadline from "../components/organisms/page-headline";

class SubscribeConfirmation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmed: false,
      errorMessage: ""
    };
  }
  componentDidMount() {
    Base.doPost(config.get("apis.subscribe") + "/confirm", {
      hash: decodeURIComponent(this.props.match.params.hash)
    }).then(
      () => {
        this.setState({ confirmed: true });
      },
      errorText => {
        this.setState({ errorMessage: errorText });
      }
    );
  }

  render() {
    return (
      <section className="section-centered section-padding">
        <PageHeadline
          title={this.props.intl.formatMessage({
            id: "dialog:subscribe-email:subheader"
          })}
          subtitle={this.props.intl.formatMessage({
            id: "dialog:subscribe-email:header"
          })}
        />
        <div className="field-2 panel">
          {!this.state.confirmed && !this.state.errorMessage && (
            <p className="statusMessage">
              <FormattedHTMLMessage id="dialog:subscribe-email:status:loading" />
            </p>
          )}
          {this.state.confirmed && (
            <p className="statusMessage">
              <FormattedHTMLMessage id="dialog:subscribe-email:status:ok" />
            </p>
          )}
          {this.state.errorMessage && (
            <p className="status-message">
              <strong className="error">
                {this.props.intl.formatMessage({
                  id: "dialog:subscribe-email:error"
                })}
                :
              </strong>
              &nbsp;{this.state.errorMessage}
            </p>
          )}
        </div>
      </section>
    );
  }
}
export default inject("locale")(injectIntl(SubscribeConfirmation));
