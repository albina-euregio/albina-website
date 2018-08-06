import React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SubscribeSocialMediaDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const socialMediaNames = {};
    config.get('socialMedia').forEach((s) => {
      socialMediaNames[s.id] = s.name;
    });

    const subscriptions = {};
    Object.keys(window['appStore'].regions).forEach((r) => {
      subscriptions[r] = config.get('socialMedia').map((s) => {
        return {id: s.id, url: (s.url[r] ? s.url[r] : null)};
      }).filter((e) => e.url);
    });

    return (
      <div className="modal-follow">
        <div className="modal-header">
          <h2 className="subheader"><FormattedHTMLMessage id="dialog:subscribe-social-media:header" /></h2>
          <h2><FormattedHTMLMessage id="dialog:subscribe-social-media:subheader" /></h2>
          <p className="tiny">
            <a href="#subscribeDialog" className="icon-link icon-arrow-left modal-trigger tooltip" title="Overview">
              <FormattedHTMLMessage id="dialog:subscribe-social-media:back-button" />
            </a>
          </p>
        </div>

        {
          Object.keys(subscriptions).map((r) =>
            <div key={r} className="followRegion">
              <h2 className="subheader">{this.props.intl.formatMessage({id: 'region:' + r})}</h2>
              <ul className="list-inline sm-buttons">
                {
                  subscriptions[r].map((e) =>
                    <li key={e.id}>
                      <a className={'sm-button icon-sm-' + e.id + ' tooltip'}
                        href={e.url}
                        target="_blank"
                        title={this.props.intl.formatMessage({id: 'footer:follow-us:hover'}, {on: socialMediaNames[e.id]})} >
                        <span>{socialMediaNames[e.id]}</span>
                      </a>
                    </li>
                  )
                }
              </ul>
            </div>
          )
        }

        <p>
          <Link to="/contact" title={this.props.intl.formatMessage({id: 'dialog:subscribe-social-media:contact-button'})} className="secondary pure-button">
            {this.props.intl.formatMessage({id: 'dialog:subscribe-social-media:contact-button'})}
          </Link>
        </p>
      </div>
    );
  }
}
export default inject('locale')(injectIntl(SubscribeSocialMediaDialog));
