import React from 'react';
import { observer } from 'mobx-react';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';
import TendencyIcon from '../icons/tendency-icon.jsx';
import BulletinProblemItem from './bulletin-problem-item.jsx';
import BulletinAWMapStatic from './bulletin-awmap-static.jsx';
import {dateToLongDateString,parseDate,getSuccDate} from '../../util/date.js';

@observer class BulletinReport extends React.Component {
  warnlevelNumbers;

  constructor(props) {
    super(props);
    this.warnlevelNumbers = {
      'low': 1,
      'moderate': 2,
      'considerable': 3,
      'high': 4,
      'very high': 5
    };
  }

  render() {
    const bulletin = this.props.store.activeBulletin;
    if(!bulletin) {
      return (<div></div>);
    }

    const date = dateToLongDateString(parseDate(this.props.store.settings.date)) + ' '
      + (this.props.store.settings.ampm == 'am' ? 'AM' : 'PM');

    const warnlevels = {
      'above': bulletin.forenoon.dangerRatingAbove ? this.warnlevelNumbers[bulletin.forenoon.dangerRatingAbove] : 0,
      'below': bulletin.forenoon.dangerRatingBelow ? this.warnlevelNumbers[bulletin.forenoon.dangerRatingBelow] : 0
    };
    const warnlevel = Math.max(...Object.values(warnlevels));
    const elevation = (bulletin.hasElevationDependency && !bulletin.treeline) ? bulletin.elevation : null;
    const treeline = bulletin.hasElevationDependency && bulletin.treeline;

    const tendencyText = bulletin.tendency ? bulletin.tendencyCommentTextcat : 'unknown';
    const tendencyDate = dateToLongDateString(getSuccDate(parseDate(this.props.store.settings.date)));

    const classes = 'panel field callout warning-level-' + warnlevel;

    const problems = [];
    if(bulletin.forenoon.avalancheSituation1 && bulletin.forenoon.avalancheSituation1.avalancheSituation) {
      problems.push(bulletin.forenoon.avalancheSituation1);
    }
    if(bulletin.forenoon.avalancheSituation2 && bulletin.forenoon.avalancheSituation2.avalancheSituation) {
      problems.push(bulletin.forenoon.avalancheSituation2);
    }

    return (
      <div>
        <section id="section-bulletin-report" className="section-centered section-bulletin section-bulletin-report">
          <div className={classes}>
            <header className="bulletin-report-header">
              <p>Warning Level for <strong>{date}</strong></p>
              <h1><span>Erheblich, Stufe {warnlevel}</span></h1>
            </header>
            <div className="bulletin-report-pictobar">
              <div className="bulletin-report-region">
                <a href="#page-main" className="img icon-arrow-up tooltip" title="This Bulletin is valid for the selected region.<br/>Click to return to Map">
                  <BulletinAWMapStatic date={this.props.store.settings.date} region={this.props.store.settings.region} />
                </a>
              </div>
              <ul className="list-plain list-bulletin-report-pictos">
                <li>
                  <WarnLevelIcon below={warnlevels.below} above={warnlevels.above} elevation={elevation} treeline={treeline} />
                  <div className="bulletin-report-tendency tooltip" title="Expectation for the following day">
                    <span><strong className="heavy">Tendency: {tendencyText}</strong><br />
                        on {tendencyDate}
                    </span>
                    {
                      bulletin.tendency &&
                      <TendencyIcon tendency={bulletin.tendency} />
                    }
                  </div>
                </li>{
                  problems.map((p, index) => <li key={index}><BulletinProblemItem problem={p} /></li>)
                }
              </ul>
            </div>
            <h2 className="subheader">Oberhalb der Waldgrenze weiterhin verbreitet erhebliche Lawinengefahr</h2>
            <p>A fava bean collard greens endive tomatillo lotus root okra winter <a href>purslane</a> zucchini parsley spinach artichoke. Tattooed Williamsburg. Jean shorts proident kogi laboris. Non tote bag pariatur <a href>elit slow-carb</a>, Vice irure eu Echo Park ea aliqua chillwave. Cornhole Etsy quinoa Pinterest cardigan. Excepteur quis forage, Blue Bottle keffiyeh velit hoodie direct trade typewriter Etsy. Fingerstache squid non, sriracha drinking vinegar Shoreditch pork belly. Paleo sartorial mollit 3 wolf moon chambray whatever, sed tote bag small batch freegan. Master cleanse. Wes Anderson typewriter VHS jean shorts yr.</p>
          </div>
        </section>
        <section id="section-bulletin-additional" className="section-centered section-bulletin section-bulletin-additional">
          <div className="panel brand">
            <h2 className="subheader">Snowpack Structure</h2>
            <ul className="list-inline list-labels">
              <li><span className="tiny heavy letterspace">Gefahrenmuster</span></li>
              <li><a href="#" className="label">Lockerer Schnee und Wind</a></li>
              <li><a href="#" className="label">Gleitschnee</a></li>
            </ul>
            <p>Tattooed Williamsburg. Jean shorts proident kogi laboris. Non tote bag pariatur <a href>elit slow-carb</a>, Vice irure eu Echo Park ea aliqua chillwave. Cornhole Etsy quinoa Pinterest cardigan. Excepteur quis forage, Blue Bottle keffiyeh velit hoodie direct trade typewriter Etsy. Fingerstache squid non, sriracha drinking vinegar Shoreditch pork belly. Paleo sartorial mollit 3 wolf moon chambray whatever, sed tote bag small batch freegan. Master cleanse. Wes Anderson typewriter VHS jean shorts yr.</p>
            <h2 className="subheader">Weather</h2>
            <ul className="list-inline ">
              <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li>
            </ul>
            <h2 className="subheader">Tendency</h2>
            <p>A fava bean collard greens endive tomatillo lotus root okra winter <a href>purslane</a> zucchini parsley spinach artichoke.</p>
            <p className="bulletin-author">Author: <a href="#" title className>Rudi Mair</a></p>
          </div>
        </section>
      </div>
    );
  }
}

export default BulletinReport;
