import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class FeedbackDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  accept = () => {
    window['appStore'].cookieFeedback.active = false;
  }

  render() {
    return ( window['appStore'].cookieFeedback.active &&
      <div className="candybar">
        <h3><FormattedHTMLMessage id="dialog:feedback:header" /></h3>
        <p><FormattedHTMLMessage id="dialog:feedback:text" /></p>
        <p>
          <button href="#" onClick={() => this.accept()}
            title={this.props.intl.formatMessage({id: 'dialog:feedback:button'})}
            className="pure-button" >{
              this.props.intl.formatMessage({id: 'dialog:feedback:button'})
            }
          </button>
        </p>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(FeedbackDialog)));
