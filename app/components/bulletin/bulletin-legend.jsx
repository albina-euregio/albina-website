import React from 'react';
import { Link } from 'react-router-dom';
import { inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Parser } from 'html-to-react';
import BulletinProblemFilter from './bulletin-problem-filter.jsx';

class BulletinLegend extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // replace the <a> element in bulletin:legend:highlight-regions with a
    // Link component
    const msg = this.props.intl.formatHTMLMessage({id: 'bulletin:legend:highlight-regions'});

    // split the string at <a> and </a>
    const parts = msg.match(/^(.*)<a[^>]*>([^<]*)<\/a>(.*)$/);

    return (
      <section id="section-bulletin-legend" className="section-padding section-bulletin-legend">
        <div className="section-centered">
          <div className="grid">
            <div className="normal-6 grid-item">
              <p>
                { (parts.length > 1) && (new Parser).parse(parts[1])}
                { (parts.length > 2) &&
                  <Link to="/education/avalanche-problems" className="tooltip" title={this.props.intl.formatMessage({id: 'bulletin:legend:highlight-regions:hover'})}>
                    <strong>{parts[2]}</strong>
                  </Link>
                }
                {(parts.length > 3) && (new Parser).parse(parts[3])}
              </p>
              <BulletinProblemFilter problems={this.props.problems} />
            </div>
            <div className="normal-6 grid-item">
              <p>
                <Link to="/education/dangerscale" className="tooltip" title={this.props.intl.formatMessage({id: 'bulletin:legend:danger-levels:hover'})}>
                  <strong>{this.props.intl.formatMessage({id: 'bulletin:legend:danger-levels'})}</strong>
                </Link>
              </p>
              <ul className="list-inline list-legend">
                {[1,2,3,4,5].map((l) =>
                  <li key={l} className={'warning-level-' + l}>
                    <span><strong>{l}</strong> {this.props.intl.formatMessage({id: 'danger-level:' + l})}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default inject('locale')(injectIntl(BulletinLegend));
