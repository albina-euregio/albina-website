import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class SubscribeBlogDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const blogs = config.get('blogs');

    // TODO: maybe group by region
    return (
      <div className="modal-subscribe">
        <div className="modal-header">
          <h2 className="subheader"><FormattedHTMLMessage id="dialog:subscribe-blog:header" /></h2>
          <h2><FormattedHTMLMessage id="dialog:subscribe-blog:subheader" /></h2>
          <p className="tiny">
            <a href="#subscribeDialog" className="icon-link icon-arrow-left modal-trigger tooltip"
              title={this.props.intl.formatMessage({id: 'dialog:subscribe-blog:back-button:hover'})}>
              <FormattedHTMLMessage id="dialog:subscribe-blog:back-button" />
            </a>
          </p>
        </div>

        {
          blogs.map((b) =>
            <div key={b.name} className="follow-region">
              <h2 className="subheader">
                {
                  b.regions.map((r) =>
                    this.props.intl.formatMessage({id: 'region:' + r})
                  ).reduce((prev, curr) => [prev, ',', curr])
                }
              </h2>
              <div className="blog-details">
                {b.name} - <span className="blog-language">{b.lang.toUpperCase()}</span>
                <ul className="list-inline list-buttongroup">
                  <li>
                    <a href={'http://' + b.name  + '/feeds/posts/default'} className="share-atom">Atom</a>
                  </li>
                  <li>
                    <span className="buttongroup-boolean">
                      {this.props.intl.formatMessage({id: 'dialog:subscribe-app:or' })}
                    </span>
                  </li>
                  <li>
                    <a href={'http://' + b.name  + '/feeds/posts/default?alt=rss'} className="share-atom">RSS</a>
                  </li>
                </ul>
              </div>
            </div>
          )
        }

      </div>
    );
  }
}
export default inject('locale')(injectIntl(SubscribeBlogDialog));
