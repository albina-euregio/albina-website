import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SmShare extends React.Component {
  getShareUrl(type) {
    const currentUrl = String(window.location);
    if(type == 'facebook') {
      return 'https://www.facebook.com/sharer.php?u='
        + encodeURIComponent(currentUrl);
    }
    if(type == 'twitter') {
      return 'https://www.twitter.com/share?url='
        + encodeURIComponent(currentUrl);
    }
    return '#';
  }

  render() {
    return (
      <section className="section section-padding sm-share-follow">
        <p><FormattedHTMLMessage id="main:share-this" /></p>
        <ul className="list-inline sm-buttons">
          <li>
            <a
              href={this.getShareUrl('facebook')}
              className="sm-button icon-sm-facebook tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'Facebook'})}
              target="_blank" >
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a
              href={this.getShareUrl('twitter')}
              className="sm-button icon-sm-twitter tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'Twitter'})}
              target="_blank" >
              <span>Twitter</span>
            </a>
          </li>
          <li>
            <a
              className="sm-button icon-sm-instagram tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'Instagram'})}
              target="_blank" >
              <span>Instagram</span>
            </a>
          </li>
          <li>
            <a
              className="sm-button icon-sm-youtube tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'YouTube'})}
              target="_blank" >
              <span>YouTube</span>
            </a>
          </li>
          <li>
            <a className="sm-button icon-sm-whatsapp tooltip"
              title={this.props.intl.formatMessage({id: 'main:share-this:hover'}, {on: 'WhatsApp'})}
              target="_blank" >
              <span>WhatsApp</span>
            </a>
          </li>
        </ul>
      </section>
    );
  }
}
export default inject('locale')(injectIntl(SmShare));
