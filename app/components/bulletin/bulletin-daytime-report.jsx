import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import TendencyIcon from "../icons/tendency-icon.jsx";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import BulletinAWMapStatic from "./bulletin-awmap-static.jsx";
import {
  dateToLongDateString,
  parseDate,
  getSuccDate
} from "../../util/date.js";

/**
 * @typedef {object} Props
 * @prop {Caaml.Bulletin} bulletin
 * @prop {*} ampm
 * @prop {*} intl
 *
 * @extends {React.Component<Props>}
 */
class BulletinDaytimeReport extends React.Component {
  constructor(props) {
    super(props);
  }

  get problems() {
    return this.props.bulletin?.avalancheProblem || [];
  }

  render() {
    const bulletin = this.props.bulletin;

    const tendency = bulletin?.tendency?.type || "none";
    const tendencyTitle = this.props.intl.formatMessage({
      id: "bulletin:report:tendency:" + tendency
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
                region={bulletin.id} // possibly contains _PM
              />
            </a>
          </div>
          <ul className="list-plain list-bulletin-report-pictos">
            <li>
              <div className="bulletin-report-picto tooltip">
                <BulletinDangerRating bulletin={bulletin} />
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
