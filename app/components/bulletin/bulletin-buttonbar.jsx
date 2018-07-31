import React from 'react';
import { inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';

class BulletinButtonbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="section-bulletin-buttonbar" className="section-padding section-bulletin-buttonbar">
        <div className="section-centered">
          <div className="grid linkbar">
            <div className="normal-4 grid-item">
              <a href="#page-main" title="Top" className="icon-link icon-arrow-up"><FormattedHTMLMessage id="bulletin:linkbar:back-to-map" /></a>
            </div>
            <div className="normal-8 grid-item">
              <ul className="list-inline bulletin-buttonbar">
                <li>
                  <a href="xy.pdf"
                    title={this.props.intl.formatMessage({id: 'bulletin:linkbar:pdf:hover'})}
                    className="pure-button tooltip">
                    { this.props.intl.formatMessage({id: 'bulletin:linkbar:pdf'}) }
                  </a>
                </li>
                <li>
                  <a href="#"
                    title={this.props.intl.formatMessage({id: 'bulletin:linkbar:subscribe:hover'})}
                    className="modal-trigger mfp-ajax pure-button tooltip">
                    { this.props.intl.formatMessage({id: 'bulletin:linkbar:subscribe'}) }
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default inject('locale')(injectIntl(BulletinButtonbar));
