import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
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
    this.state = { showMoreProblems: false };
  }

  splitProblems() {
    let problems = this.props.bulletin?.avalancheProblems || [];
    //problems = problems.concat(this.props.bulletin?.avalancheProblems);
    let problemsSplit = { default: [], optional: [] };
    problems.forEach((p, index) =>
      problemsSplit["default"].push(
        <BulletinProblemItem key={index} problem={p} />
      )
    );

    return problemsSplit;
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

    const splitupProblems = this.splitProblems();

    return (
      <div>
        {this.props.ampm && (
          <h2 className="subheader">
            <FormattedMessage
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
                publicationTime={this.props.publicationTime}
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
                <span>
                  <FormattedMessage
                    id="bulletin:report:tendency"
                    values={{
                      strong: (...msg) => (
                        <strong className="heavy">{msg}</strong>
                      ),
                      br: (...msg) => (
                        <>
                          <br />
                          {msg}
                        </>
                      ),
                      tendency: tendencyTitle,
                      daytime: "", // ampmId ? this.props.intl.formatMessage({id: 'bulletin:report:tendency:daytime:' + ampmId}) : '',
                      date: tendencyDate
                    }}
                  />
                </span>
                <TendencyIcon tendency={tendency} />
              </div>
            </li>
            {splitupProblems.default}
          </ul>
        </div>
      </div>
    );
  }
}
export default injectIntl(BulletinDaytimeReport);
