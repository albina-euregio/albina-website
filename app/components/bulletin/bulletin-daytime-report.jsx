import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import WarnLevelIcon from "../icons/warn-level-icon.jsx";
import TendencyIcon from "../icons/tendency-icon.jsx";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import BulletinAWMapStatic from "./bulletin-awmap-static.jsx";
import {
  dateToLongDateString,
  parseDate,
  getSuccDate
} from "../../util/date.js";

class BulletinDaytimeReport extends React.Component {
  constructor(props) {
    super(props);
  }

  get problems() {
    const problems = [];
    const bulletin = this.props.bulletin;
    if (
      bulletin.avalancheSituation1 &&
      bulletin.avalancheSituation1.avalancheSituation
    ) {
      problems.push(bulletin.avalancheSituation1);
    }
    if (
      bulletin.avalancheSituation2 &&
      bulletin.avalancheSituation2.avalancheSituation
    ) {
      problems.push(bulletin.avalancheSituation2);
    }
    return problems;
  }

  render() {
    const elevation =
      this.props.fullBulletin.hasElevationDependency &&
      !this.props.fullBulletin.treeline
        ? this.props.fullBulletin.elevation
        : null;

    const treeline =
      this.props.fullBulletin.hasElevationDependency &&
      this.props.fullBulletin.treeline;

    const tendency = this.props.fullBulletin.tendency;
    const tendencyTitle = tendency
      ? this.props.intl.formatMessage({
          id: "bulletin:report:tendency:" + tendency
        })
      : this.props.intl.formatMessage({
          id: "bulletin:report:tendency:none"
        });
    const tendencyDate = dateToLongDateString(
      getSuccDate(parseDate(this.props.date))
    );

    return (
      <div>
        {this.props.ampm && (
          <h2 className="subheader">
            <FormattedHTMLMessage
              id={"bulletin:report:daytime:" + this.props.ampm}
            />
          </h2>
        )}
        <div className="bulletin-report-pictobar">
          <div className="bulletin-report-region">
            <a
              href="#page-main"
              className="img icon-arrow-up tooltip"
              title={this.props.intl.formatMessage({
                id: "bulletin:report:selected-region:hover"
              })}
              data-scroll=""
            >
              <BulletinAWMapStatic
                date={this.props.date}
                region={this.props.fullBulletin.id}
                bulletin={this.props.fullBulletin}
                ampm={this.props.ampm}
              />
            </a>
          </div>
          <ul className="list-plain list-bulletin-report-pictos">
            <li>
              <div className="bulletin-report-picto tooltip">
                <WarnLevelIcon
                  below={this.props.bulletin.dangerRatingBelow}
                  above={this.props.bulletin.dangerRatingAbove}
                  elevation={elevation}
                  treeline={treeline}
                />
              </div>
              <div
                className="bulletin-report-tendency tooltip"
                title={this.props.intl.formatMessage({
                  id: "bulletin:report:tendency:hover"
                })}
              >
                <FormattedHTMLMessage
                  id="bulletin:report:tendency"
                  values={{
                    tendency: tendencyTitle,
                    daytime: "", // ampmId ? this.props.intl.formatMessage({id: 'bulletin:report:tendency:daytime:' + ampmId}) : '',
                    date: tendencyDate
                  }}
                />
                <TendencyIcon tendency={tendency} />
              </div>
            </li>
            {this.problems.map((p, index) => (
              <BulletinProblemItem key={index} problem={p} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
export default inject("locale")(injectIntl(BulletinDaytimeReport));
