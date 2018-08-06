import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SubscribeDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="modal-subscribe">
        <div className="modal-header">
          <h2 className="subheader"><FormattedHTMLMessage id="dialog:subscribe:header" /></h2>
          <h2><FormattedHTMLMessage id="dialog:subscribe:subheader" /></h2>
        </div>

        <form className="pure-form pure-form-stacked">
          <label htmlFor="input"><FormattedHTMLMessage id="dialog:subscribe:select-subscrption" /></label>
          <ul className="list-inline list-buttongroup">
            <li><button href="" title="" className="modal-trigger mfp-ajax inverse pure-button">{this.props.intl.formatMessage({id: 'dialog:subscribe:bulletin'})}</button></li>
            <li><button href="" title="" className="modal-trigger mfp-ajax pure-button">{this.props.intl.formatMessage({id: 'dialog:subscribe:blog'})}</button></li>
            <li>
              <a href="#subscribeSociaMediaDialog">
                <button title="" className="inverse pure-button modal-trigger mfp-ajax inverse pure-button">{this.props.intl.formatMessage({id: 'dialog:subscribe:social-media'})}</button>
              </a>
            </li>
            <li><button href="" title="" className="inverse pure-button modal-trigger mfp-ajax inverse pure-button">{this.props.intl.formatMessage({id: 'dialog:subscribe:app'})}</button></li>
          </ul>
        </form>
      </div>
    );
  }
}
export default inject('locale')(injectIntl(SubscribeDialog));