import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class FeedbackDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  accept = (flag) => {
    if(flag) {
      window.open(this.url, '_blank');
    }
    window['appStore'].cookieFeedback.active = false;
  }

  get url() {
    return config.get('links.feedback.' + window['appStore'].language);
  }

  render() {
    return ( window['appStore'].cookieFeedback.active &&
      <div className="candybar">
        <h3><FormattedHTMLMessage id="dialog:feedback:header" /></h3>
        <p><FormattedHTMLMessage id="dialog:feedback:text" /></p>
        <p>
          <a href={this.url} target="_blank" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.accept(true)
          }}>{this.url}</a>
        </p>
        <p>
          <button href="#" onClick={() => this.accept(false)}
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
