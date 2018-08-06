import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SmFollow extends React.Component {
  render() {
    const accounts = config.get('subscribe.socialMedia');
    return (
      <section className="section section-padding sm-share-follow">
        <p><FormattedHTMLMessage id="footer:follow-us" /></p>
        <ul className="list-inline sm-buttons">
          { accounts.map((a, i) =>
            <li key={a.id + i}>
              <a href="#subscribeSocialMediaDialog"
                className={'sm-button icon-sm-' + a.id + ' tooltip modal-trigger'}
                title={this.props.intl.formatMessage({id: 'footer:follow-us:hover'}, {on: a.name})} >
                <span>{a.name}</span>
              </a>
            </li>
          )}
        </ul>
      </section>
    );
  }
}
export default inject('locale')(injectIntl(SmFollow));
