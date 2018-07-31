import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';
import TendencyIcon from '../icons/tendency-icon.jsx';
import BulletinProblemItem from './bulletin-problem-item.jsx';
import DangerPatternItem from './danger-pattern-item.jsx';
import BulletinAWMapStatic from './bulletin-awmap-static.jsx';
import {dateToLongDateString,parseDate,getSuccDate} from '../../util/date.js';

class BulletinReport extends React.Component {
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

  getLocalizedText(elem) {
    if(Array.isArray(elem)) {
      const l = elem.find((e) => (e.languageCode === window['appStore'].language));
      if(l) {
        return l.text;
      }
    }
    return '';
  }

  render() {
    const bulletin = this.props.store.activeBulletin;
    if(!bulletin) {
      return (<div></div>);
    }

    const bulletinDaytime = this.daytimeBulletin;

    const ampmId = bulletin.hasDaytimeDependency ? this.props.store.settings.ampm : '';
    const date = dateToLongDateString(parseDate(this.props.store.settings.date));

    const warnlevels = {
      'above': bulletinDaytime.dangerRatingAbove ? this.warnlevelNumbers[bulletinDaytime.dangerRatingAbove] : 0,
      'below': bulletinDaytime.dangerRatingBelow ? this.warnlevelNumbers[bulletinDaytime.dangerRatingBelow] : 0
    };
    const warnlevel = Math.max(...Object.values(warnlevels));
    const elevation = (bulletin.hasElevationDependency && !bulletin.treeline) ? bulletin.elevation : null;
    const treeline = bulletin.hasElevationDependency && bulletin.treeline;

    const tendencyTitle = bulletin.tendency ? this.props.intl.formatMessage({id: 'bulletin:report:tendency:' + bulletin.tendency}) : 'n/a';
    const tendencyDate = dateToLongDateString(getSuccDate(parseDate(this.props.store.settings.date)));

    const classes = 'panel field callout warning-level-' + warnlevel;

    return (
      <div>
        <section id="section-bulletin-report" className="section-centered section-bulletin section-bulletin-report">
          <div className={classes}>
            <header className="bulletin-report-header">
              <p>
                <FormattedHTMLMessage id="bulletin:report:headline" values={{
                  date: date,
                  daytime: (ampmId ? this.props.intl.formatMessage({id: 'bulletin:report:daytime:' + ampmId}) : '')
                }} />
              </p>
              <h1>
                <FormattedHTMLMessage id="bulletin:report:headline2" values={{
                  number: warnlevel,
                  text: this.props.intl.formatMessage({id: 'danger-level:' + warnlevel})
                }} />
              </h1>
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
                  <div className="bulletin-report-tendency tooltip" title={this.props.intl.formatMessage({id: 'bulletin:report:tendency:hover'})}>
                    <FormattedHTMLMessage id="bulletin:report:tendency" values={{
                      tendency: tendencyTitle,
                      daytime:  '', // ampmId ? this.props.intl.formatMessage({id: 'bulletin:report:tendency:daytime:' + ampmId}) : '',
                      date: tendencyDate
                    }} />
                    <TendencyIcon tendency={bulletin.tendency} />
                  </div>
                </li>{
                  this.problems.map((p, index) => <BulletinProblemItem key={index} problem={p} />)
                }
              </ul>
            </div>
            <h2 className="subheader">{this.getLocalizedText(bulletin.avActivityHighlights)}</h2>
            <p>{this.getLocalizedText(bulletin.avActivityComment)}</p>
          </div>
        </section>
        <section id="section-bulletin-additional" className="section-centered section-bulletin section-bulletin-additional">
          <div className="panel brand">
            <h2 className="subheader"><FormattedHTMLMessage id="bulletin:report:snowpack-structure:headline" /></h2>
            {
              (this.dangerPatterns.length > 0) &&
                <ul className="list-inline list-labels">
                  <li><span className="tiny heavy letterspace"><FormattedHTMLMessage id="bulletin:report:danger-patterns" /></span></li>
                  {
                    this.dangerPatterns.map((dp, index) => <li key={index}><DangerPatternItem dangerPattern={dp} /></li>)
                  }
                </ul>
            }
            <p>{this.getLocalizedText(bulletin.snowpackStructureComment)}</p>
            { false &&
              <h2 className="subheader">Weather</h2>
            } { false &&
              <ul className="list-inline ">
                <li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
                </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
                </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
                </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
                </li><li><a href="#" title="The Button" className="secondary pure-button">The Button</a>
                </li>
              </ul>
            }
            { bulletin.tendency &&
              <div>
                <h2 className="subheader"><FormattedHTMLMessage id="bulletin:report:tendency:headline" /></h2>
                <p>{this.getLocalizedText(bulletin.tendencyComment)}</p>
                <p className="bulletin-author"><FormattedHTMLMessage id="bulletin:report:author" />:
                  { (bulletin.author && bulletin.author.name) &&
                    <a href={'mailto:' + bulletin.author.email}>{bulletin.author.name}</a>
                  }{ Array.isArray(bulletin.additionalAuthors) &&
                    bulletin.additionalAuthors.map((a, i) =>
                      <span key={i}>, {a}</span>
                    )
                  }
                </p>
              </div>
            }
          </div>
        </section>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(BulletinReport)));
