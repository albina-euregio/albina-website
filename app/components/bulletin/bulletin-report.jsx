import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import DangerPatternItem from './danger-pattern-item';
import BulletinDaytimeReport from './bulletin-daytime-report';
import { dateToLongDateString, parseDate } from '../../util/date';

/*
 * This component shows the detailed bulletin report including all icons and
 * texts.
 */
class BulletinReport extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed
  get daytimeBulletins() {
    const bulletin = this.props.store.activeBulletin;
    const bs = {};
    if(bulletin.hasDaytimeDependency) {
      bs['am'] = bulletin['forenoon'];
      bs['pm'] = bulletin['afternoon'];
    } else {
      bs['fd'] = bulletin['forenoon'];
    }
    return bs;
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


  /*
   * Get Bulletin comment text in the language version the user is using.
   * E.g. load bulletin.avActivityHighlights.de when showing the german version.
   */
  getLocalizedText(elem) {
    if(Array.isArray(elem)) {
      const l = elem.find((e) => (e.languageCode === window['appStore'].language));
      if(l) {
        return l.text;
      }
    }
    return '';
  }

  getMaxWarnlevel(daytimeBulletins) {
    const defaultLevel = {
      number: 0,
      id: 'no_rating'
    };

    const comparator = (acc, w) => {
      if(acc.number < w.number) {
        return w;
      }
      // else prefer no_snow over no_rating
      if(acc.number == 0 && acc.id == 'no_rating' && w.id == 'no_snow') {
        return w;
      }
      return acc;
    };

    return Object.values(daytimeBulletins).map((b) => {
      const warnlevels = [];
      if(b.dangerRatingAbove) {
        warnlevels.push({
          number: window['appStore'].getWarnlevelNumber(b.dangerRatingAbove),
          id: b.dangerRatingAbove
        });
      }
      if(b.dangerRatingBelow) {
        warnlevels.push({
          number: window['appStore'].getWarnlevelNumber(b.dangerRatingBelow),
          id: b.dangerRatingBelow
        });
      }
      // get the maximum for each daytime
      return warnlevels.reduce(comparator, defaultLevel);
    }).reduce(comparator, defaultLevel); // return the total maximum
  }

  render() {
    const bulletin = this.props.store.activeBulletin;
    if(!bulletin) {
      return (<div></div>);
    }

    const daytimeBulletins = this.daytimeBulletins;
    const maxWarnlevel = this.getMaxWarnlevel(daytimeBulletins);
    const classes = 'panel field callout warning-level-' + maxWarnlevel.number;

    return (
      <div>
        <section id="section-bulletin-report" className="section-centered section-bulletin section-bulletin-report">
          <div className={classes}>
            <header className="bulletin-report-header">
              <p>
                <FormattedHTMLMessage id="bulletin:report:headline" values={{
                  date: dateToLongDateString(parseDate(this.props.store.settings.date)),
                  daytime: ''
                }} />
              </p>
              <h1>
                <FormattedHTMLMessage
                  id={(maxWarnlevel.number == 0) ? 'bulletin:report:headline2:level0' : 'bulletin:report:headline2'}
                  values={{
                    number: maxWarnlevel.number,
                    text: this.props.intl.formatMessage({id: 'danger-level:' + maxWarnlevel.id})
                  }}
                />
              </h1>
            </header>
            {
              Object.keys(daytimeBulletins).map((ampm) =>
                <BulletinDaytimeReport
                  key={ampm}
                  bulletin={daytimeBulletins[ampm]}
                  fullBulletin={bulletin}
                  ampm={(ampm == 'fd') ? '' : ampm}
                  store={this.props.store} />
              )
            }
            <h2 className="subheader">{this.getLocalizedText(bulletin.avActivityHighlights)}</h2>
            <p>{this.getLocalizedText(bulletin.avActivityComment)}</p>
          </div>
        </section>
        <section id="section-bulletin-additional" className="section-centered section-bulletin section-bulletin-additional">
          <div className="panel brand">
            { ((this.dangerPatterns.length > 0) || bulletin.snowpackStructureComment) &&
              <div>
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
              </div>
            }
            { bulletin.tendencyComment &&
              <div>
                <h2 className="subheader"><FormattedHTMLMessage id="bulletin:report:tendency:headline" /></h2>
                <p>{this.getLocalizedText(bulletin.tendencyComment)}</p>
              </div>
            }
            <p className="bulletin-author"><FormattedHTMLMessage id="bulletin:report:author" />:&nbsp;
              { (bulletin.author && bulletin.author.name) &&
                  <span>{bulletin.author.name}</span>
              }{ Array.isArray(bulletin.additionalAuthors) &&
                  bulletin.additionalAuthors.map((a, i) =>
                    <span key={i}>, {a}</span>
                  )
              }
            </p>
          </div>
        </section>
      </div>
    );
  }
}

export default inject('locale')(injectIntl(observer(BulletinReport)));
