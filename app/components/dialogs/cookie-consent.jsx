import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class CookieConsent extends React.Component {
  constructor(props) {
    super(props);
  }

  accept = () => {
    window['cookieConsentStore'].active = false;
  }

  render() {
    return ( window['cookieConsentStore'].active &&
      <div className="candybar">
        <h3><FormattedHTMLMessage id="dialog:cookie-consent:header" /></h3>
        <p><FormattedHTMLMessage id="dialog:cookie-consent:text" /></p>
        <p>
          <button href="#" onClick={() => this.accept()}
            title={this.props.intl.formatMessage({id: 'dialog:cookie-consent:button'})}
            className="pure-button" >{
              this.props.intl.formatMessage({id: 'dialog:cookie-consent:button'})
            }
          </button>
        </p>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(CookieConsent)));
