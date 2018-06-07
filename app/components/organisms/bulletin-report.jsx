import React from 'react';
import ProblemIconLink from '../icons/problem-icon-link.jsx';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';
import ElevationIcon from '../icons/elevation-icon.jsx';
import ExpositionIcon from '../icons/exposition-icon.jsx';
import TendencyIcon from '../icons/tendency-icon.jsx';
import BulletinAWMapStatic from './bulletin-awmap-static.jsx';

export default class BulletinReport extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section id="section-bulletin-report" className="section-centered section-bulletin section-bulletin-report">
        <div className="panel field callout warning-level-3">
          <header className="bulletin-report-header">
            <p>Warning Level for <strong>Saturday 09.12.2017 PM</strong></p>
            <h1><span>Erheblich, Stufe 3</span></h1>
          </header>
          <div className="bulletin-report-pictobar">
            <div className="bulletin-report-region">
              <a href="#page-main" className="img icon-arrow-up tooltip" title="This Bulletin is valid for the selected region.<br/>Click to return to Map">
                <BulletinAWMapStatic date={this.props.store.settings.date} region={this.props.store.settings.region} />
              </a>
            </div>
            <ul className="list-plain list-bulletin-report-pictos">
              <li>
                <WarnLevelIcon below={2} above={3} elevation={1800} treeline={false} />
                <div className="bulletin-report-tendency tooltip" title="Expectation for the following day">
                  <span><strong className="heavy">Tendency: Much Worse</strong><br />
                    on Sunday 10.12.2017 PM
                  </span>
                  <TendencyIcon tendency="increase" />
                </div>
              </li><li>
                <ProblemIconLink problem={'wind_drifted_snow'} />
                <ExpositionIcon expositions={['n', 'nw', 'w']} />
                <ElevationIcon elevation={2200} where="above" />
              </li>
              <li>
                <ProblemIconLink problem={'old_snow'} />
                <ExpositionIcon expositions={['e', 'se', 's', 'sw']} />
                <ElevationIcon elevation={1900} where="below" />
              </li>
            </ul>
          </div>
          <h2 className="subheader">Oberhalb der Waldgrenze weiterhin verbreitet erhebliche Lawinengefahr</h2>
          <p>A fava bean collard greens endive tomatillo lotus root okra winter <a href>purslane</a> zucchini parsley spinach artichoke. Tattooed Williamsburg. Jean shorts proident kogi laboris. Non tote bag pariatur <a href>elit slow-carb</a>, Vice irure eu Echo Park ea aliqua chillwave. Cornhole Etsy quinoa Pinterest cardigan. Excepteur quis forage, Blue Bottle keffiyeh velit hoodie direct trade typewriter Etsy. Fingerstache squid non, sriracha drinking vinegar Shoreditch pork belly. Paleo sartorial mollit 3 wolf moon chambray whatever, sed tote bag small batch freegan. Master cleanse. Wes Anderson typewriter VHS jean shorts yr.</p>
        </div>
      </section>
    );
  }
}
