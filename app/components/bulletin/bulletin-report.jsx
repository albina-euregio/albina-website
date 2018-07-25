import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';
import TendencyIcon from '../icons/tendency-icon.jsx';
import BulletinProblemItem from './bulletin-problem-item.jsx';
import DangerPatternItem from './danger-pattern-item.jsx';
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
      'very_high': 5
    };
  }

  @computed
  get daytimeBulletin() {
    const bulletin = this.props.store.activeBulletin;
    const daytime =
      (bulletin.hasDaytimeDependency && this.props.store.settings.ampm == 'pm')
        ? 'afternoon'
        : 'forenoon';
    return bulletin[daytime];
  }

  @computed
  get problems() {
    const problems = [];
    const bulletin = this.daytimeBulletin;
    if(bulletin.avalancheSituation1 && bulletin.avalancheSituation1.avalancheSituation) {
      problems.push(bulletin.avalancheSituation1);
    }
    if(bulletin.avalancheSituation2 && bulletin.avalancheSituation2.avalancheSituation) {
      problems.push(bulletin.avalancheSituation2);
    }
    return problems;
  }

  @computed
  get dangerPatterns() {
    const bulletin = this.props.store.activeBulletin;
    const dangerPatterns = [];
    if(bulletin.dangerPattern1) {
      dangerPatterns.push(bulletin.dangerPattern1);
    }
    if(bulletin.dangerPattern2) {
      dangerPatterns.push(bulletin.dangerPattern2);
    }
    return dangerPatterns;
  }

  render() {
    const bulletin = this.props.store.activeBulletin;
    if(!bulletin) {
      return (<div></div>);
    }

    const bulletinDaytime = this.daytimeBulletin;

    const ampm = (bulletin.hasDaytimeDependency
      ? ((this.props.store.settings.ampm == 'am') ? 'AM' : 'PM')
      : '');
    const date = dateToLongDateString(parseDate(this.props.store.settings.date))
      + (ampm ? (' ' + ampm) : '');

    const warnlevels = {
      'above': bulletinDaytime.dangerRatingAbove ? this.warnlevelNumbers[bulletinDaytime.dangerRatingAbove] : 0,
      'below': bulletinDaytime.dangerRatingBelow ? this.warnlevelNumbers[bulletinDaytime.dangerRatingBelow] : 0
    };
    const warnlevel = Math.max(...Object.values(warnlevels));
    const elevation = (bulletin.hasElevationDependency && !bulletin.treeline) ? bulletin.elevation : null;
    const treeline = bulletin.hasElevationDependency && bulletin.treeline;

    const tendencyTitle = bulletin.tendency ? bulletin.tendency : 'n/a';
    const tendencyText = bulletin.tendency ? bulletin.tendencyCommentTextcat : 'n/a';
    const tendencyDate = dateToLongDateString(getSuccDate(parseDate(this.props.store.settings.date)));

    const snowpackStructureText = bulletin.snowpackStructureCommentTextcat ?
      bulletin.snowpackStructureCommentTextcat : '';

    const classes = 'panel field callout warning-level-' + warnlevel;

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
                  <BulletinAWMapStatic store={this.props.store} bulletin={bulletin} />
                </a>
              </div>
              <ul className="list-plain list-bulletin-report-pictos">
                <li>
                  <WarnLevelIcon below={warnlevels.below} above={warnlevels.above} elevation={elevation} treeline={treeline} />
                  <div className="bulletin-report-tendency tooltip" title="Expectation for the following day">
                    <span><strong className="heavy">Tendency: {tendencyTitle}</strong><br />
                        on {tendencyDate}
                    </span>
                    <TendencyIcon tendency={bulletin.tendency} />
                  </div>
                </li>{
                  this.problems.map((p, index) => <BulletinProblemItem key={index} problem={p} />)
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
            {
              (this.dangerPatterns.length > 0) &&
                <ul className="list-inline list-labels">
                  <li><span className="tiny heavy letterspace">Gefahrenmuster</span></li>
                  {
                    this.dangerPatterns.map((dp, index) => <li key={index}><DangerPatternItem dangerPattern={dp} /></li>)
                  }
                </ul>
            }
            <p>{snowpackStructureText}</p>
            <h2 className="subheader">Weather</h2>
            <ul className="list-inline ">
              <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
              </li>
            </ul> {
              bulletin.tendency &&
              <div>
                <h2 className="subheader">Tendency</h2>
                <p>{tendencyText}</p>
                <p className="bulletin-author">Author: <a href="#" title className>{bulletin.author.name}</a></p>
              </div>
            }
          </div>
        </section>
      </div>
    );
  }
}

export default BulletinReport;
