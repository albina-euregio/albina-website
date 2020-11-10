import React from "react";
import { computed } from "mobx";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import DangerPatternItem from "./danger-pattern-item";
import BulletinDaytimeReport from "./bulletin-daytime-report";
import { dateToLongDateString, parseDate } from "../../util/date";
import { preprocessContent } from "../../util/htmlParser";

/**
 * This component shows the detailed bulletin report including all icons and
 * texts.
 *
 * @typedef {object} Props
 * @prop {Albina.DaytimeBulletin} daytimeBulletin
 * @prop {*} date
 * @prop {*} intl
 *
 * @extends {React.Component<Props>}
 */
class BulletinReport extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * @returns {Caaml.Bulletin}
   */
  @computed
  get bulletin() {
    return this.props.daytimeBulletin?.forenoon;
  }

  @computed
  get dangerPatterns() {
    return this.bulletin.dangerPatterns || [];
  }

  getLocalizedText(elem) {
    // bulletins are loaded in correct language
    if (!elem) return "";
    return preprocessContent(elem.replace(/&lt;br\/&gt;/g, "<br/>"));
  }

  render() {
    const daytimeBulletin = this.props.daytimeBulletin;
    const bulletin = this.bulletin;
    if (!daytimeBulletin || !bulletin) {
      return <div />;
    }

    const maxWarnlevel = {
      id: daytimeBulletin.maxWarnlevel,
      number: window["appStore"].getWarnlevelNumber(
        daytimeBulletin.maxWarnlevel
      )
    };
    const classes = "panel field callout warning-level-" + maxWarnlevel.number;

    return (
      <div>
        <section
          id="section-bulletin-report"
          className="section-centered section-bulletin section-bulletin-report"
        >
          <div className={classes}>
            <header className="bulletin-report-header">
              <p className="bulletin-report-header-meta">
                <FormattedHTMLMessage
                  id="bulletin:report:headline"
                  values={{
                    date: dateToLongDateString(parseDate(this.props.date)),
                    daytime: ""
                  }}
                />
              </p>
              <h1 className="bulletin-report-header-danger-level">
                <FormattedHTMLMessage
                  id={
                    maxWarnlevel.number == 0
                      ? "bulletin:report:headline2:level0"
                      : "bulletin:report:headline2"
                  }
                  values={{
                    number: maxWarnlevel.number,
                    text: this.props.intl.formatMessage({
                      id: "danger-level:" + maxWarnlevel.id
                    })
                  }}
                />
              </h1>
            </header>
            {daytimeBulletin.hasDaytimeDependency ? (
              [
                <BulletinDaytimeReport
                  key={"am"}
                  bulletin={daytimeBulletin.forenoon}
                  date={this.props.date}
                  ampm={"am"}
                />,
                <BulletinDaytimeReport
                  key={"pm"}
                  bulletin={daytimeBulletin.afternoon}
                  date={this.props.date}
                  ampm={"pm"}
                />
              ]
            ) : (
              <BulletinDaytimeReport
                bulletin={daytimeBulletin.forenoon}
                date={this.props.date}
              />
            )}
            {bulletin.highlights && (
              <p className="bulletin-report-public-alert">
                <span class="icon-attention bulletin-report-public-alert-icon"></span>
                <span
                  className="bulletin-report-public-alert-text"
                  title={this.props.intl.formatMessage({
                    id: "bulletin:map:details:warning:title"
                  })}
                ></span>
                {bulletin.highlights}
              </p>
            )}
            <h2 className="subheader">
              {this.getLocalizedText(bulletin.avalancheActivityHighlights)}
            </h2>
            <p>{this.getLocalizedText(bulletin.avalancheActivityComment)}</p>
          </div>
        </section>
        {(bulletin.tendencyComment || bulletin.snowpackStructureComment) && (
          <section
            id="section-bulletin-additional"
            className="section-centered section-bulletin section-bulletin-additional"
          >
            <div className="panel brand">
              {(this.dangerPatterns.length > 0 ||
                bulletin.snowpackStructureComment) && (
                <div>
                  <h2 className="subheader">
                    <FormattedHTMLMessage id="bulletin:report:snowpack-structure:headline" />
                  </h2>
                  {this.dangerPatterns.length > 0 && (
                    <ul className="list-inline list-labels">
                      <li>
                        <span className="tiny heavy letterspace">
                          <FormattedHTMLMessage id="bulletin:report:danger-patterns" />
                        </span>
                      </li>
                      {this.dangerPatterns.map((dp, index) => (
                        <li key={index}>
                          <DangerPatternItem dangerPattern={dp} />
                        </li>
                      ))}
                    </ul>
                  )}
                  <p>
                    {this.getLocalizedText(bulletin.snowpackStructureComment)}
                  </p>
                </div>
              )}
              {bulletin.tendencyComment &&
                this.getLocalizedText(bulletin.tendencyComment) && (
                  <div>
                    <h2 className="subheader">
                      <FormattedHTMLMessage id="bulletin:report:tendency:headline" />
                    </h2>
                    <p>{this.getLocalizedText(bulletin.tendencyComment)}</p>
                  </div>
                )}
              {/*
            <p className="bulletin-author">
              <FormattedHTMLMessage id="bulletin:report:author" />
              :&nbsp;
              {bulletin.author &&
                bulletin.author.name && (
                  <span>{bulletin.author.name}</span>
                )}
            </p>
              */}
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinReport)));
