import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import TendencyIcon from "../icons/tendency-icon.jsx";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import BulletinProblemItem from "./bulletin-problem-item.jsx";
import BulletinAWMapStatic from "./bulletin-awmap-static.jsx";
import { parseDate, getSuccDate, LONG_DATE_FORMAT } from "../../util/date.js";
import { Tooltip } from "../tooltips/tooltip";

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
    const tendencyDate = this.props.intl.formatDate(
      getSuccDate(parseDate(this.props.date)),
      LONG_DATE_FORMAT
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
            <Tooltip
              label={this.props.intl.formatMessage({
                id: "bulletin:report:selected-region:hover"
              })}
            >
              <a href="#page-main" className="img icon-arrow-up" data-scroll="">
                <BulletinAWMapStatic
                  date={this.props.date}
                  publicationTime={this.props.publicationTime}
                  region={bulletin.id} // possibly contains _PM
                />
              </a>
            </Tooltip>
          </div>
          <ul className="list-plain list-bulletin-report-pictos">
            <li>
              <div className="bulletin-report-picto tooltip">
                <BulletinDangerRating bulletin={bulletin} />
              </div>
              <Tooltip
                label={this.props.intl.formatMessage({
                  id: "bulletin:report:tendency:hover"
                })}
              >
                <div className="bulletin-report-tendency">
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
              </Tooltip>
            </li>
            {splitupProblems.default}
          </ul>
        </div>
      </div>
    );
  }
}
export default injectIntl(BulletinDaytimeReport);
