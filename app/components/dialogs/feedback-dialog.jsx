import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class FeedbackDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  accept = (flag) => {
    if(flag) {
      window.open(config.get('links.feedback'), '_blank');
    }
    window['appStore'].cookieFeedback.active = false;
  }

  render() {
    return ( window['appStore'].cookieFeedback.active &&
      <div className="candybar">
        <h3><FormattedHTMLMessage id="dialog:feedback:header" /></h3>
        <p><FormattedHTMLMessage id="dialog:feedback:text" /></p>
        <p>
          <button href="#" onClick={() => this.accept(true)}
            title={this.props.intl.formatMessage({id: 'dialog:feedback:button:yes'})}
            className="pure-button" >{
              this.props.intl.formatMessage({id: 'dialog:feedback:button:yes'})
            }
          </button>
          <span className="separator">&nbsp;</span>
          <button href="#" onClick={() => this.accept(false)}
            title={this.props.intl.formatMessage({id: 'dialog:feedback:button:no'})}
            className="pure-button" >{
              this.props.intl.formatMessage({id: 'dialog:feedback:button:no'})
            }
          </button>
        </p>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(FeedbackDialog)));
