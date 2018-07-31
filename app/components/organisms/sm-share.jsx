import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SmShare extends React.Component {
  render() {
    return (
      <section className="section section-padding sm-share-follow">
        <p><FormattedHTMLMessage id="main:share-this" /></p>
        <ul className="list-inline sm-buttons">
          <li>
            <a
              className="sm-button icon-sm-facebook modal-trigger mfp-ajax tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'Facebook'})} >
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a
              className="sm-button icon-sm-twitter modal-trigger mfp-ajax tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'Twitter'})} >
              <span>Twitter</span>
            </a>
          </li>
          <li>
            <a
              className="sm-button icon-sm-instagram modal-trigger mfp-ajax tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'Instagram'})} >
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a
              className="sm-button icon-sm-youtube modal-trigger mfp-ajax tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'YouTube'})} >
              <span>YouTube</span>
            </a>
          </li>
          <li>
            <a className="sm-button icon-sm-whatsapp modal-trigger mfp-ajax tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'WhatsApp'})} >
              <span>WhatsApp</span>
            </a>
          </li>
        </ul>
      </section>
    );
  }
}
export default inject('locale')(injectIntl(SmShare));
