import React from 'react';
import { computed } from 'mobx';
import { observer, inject } from 'mobx-react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import DangerPatternItem from './danger-pattern-item';
import BulletinDaytimeReport from './bulletin-daytime-report';
import { dateToLongDateString, parseDate } from '../../util/date';

class BulletinReport extends React.Component {
  warnlevelNumbers;

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

    const daytimeBulletins = this.daytimeBulletins;
    console.log('TEST: ' + JSON.stringify(daytimeBulletins));

    return (
      <div>
        <section id="section-bulletin-report" className="section-centered section-bulletin section-bulletin-report">
          {
            Object.keys(daytimeBulletins).map((ampm) =>
              <BulletinDaytimeReport
                key={ampm}
                bulletin={daytimeBulletins[ampm]}
                fullBulletin={bulletin}
                date={dateToLongDateString(parseDate(this.props.store.settings.date))}
                ampm={(ampm == 'fd') ? '' : ampm}
                store={this.props.store} />
            )
          }
        </section>
        <section id="section-bulletin-additional" className="section-centered section-bulletin section-bulletin-additional">
          <div className="panel brand">
            <h2 className="subheader">{this.getLocalizedText(bulletin.avActivityHighlights)}</h2>
            <p>{this.getLocalizedText(bulletin.avActivityComment)}</p>
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
