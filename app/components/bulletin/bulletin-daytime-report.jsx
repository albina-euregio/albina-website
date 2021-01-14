import React from "react";
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
    this.state = { showMoreProblems: false };
  }

  splitProblems() {
    let problems = this.props.bulletin?.avalancheProblems || [];
    //problems = problems.concat(this.props.bulletin?.avalancheProblems);
    let problemsSplit = { default: [], optional: [] };
    problems.forEach((p, index) =>
      problemsSplit[index > 1 ? "optional" : "default"].push(
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
            {splitupProblems.default}
            {splitupProblems.optional.length > 0 && (
              <>
                {!this.state.showMoreProblems && (
                  <li className="list-bulletin-report-pictos-trigger">
                    <a
                      onClick={() => {
                        this.setState({
                          showMoreProblems: true
                        });
                      }}
                      className="tooltip"
                      title={this.props.intl.formatMessage({
                        id: "bulletin:report:more-problems:show:title"
                      })}
                    >
                      <span className={"icon-down-open-big"}></span>
                      <span>
                        {this.props.intl.formatMessage({
                          id: "bulletin:report:more-problems:show:caption"
                        })}
                      </span>
                    </a>
                  </li>
                )}
                {this.state.showMoreProblems && splitupProblems.optional}
                {this.state.showMoreProblems && (
                  <li className="list-bulletin-report-pictos-trigger">
                    <a
                      onClick={() => {
                        this.setState({ showMoreProblems: false });
                      }}
                      className="tooltip"
                      title={this.props.intl.formatMessage({
                        id: "bulletin:report:more-problems:hide:title"
                      })}
                    >
                      <span className={"icon-up-open-big"}></span>
                      <span>
                        {this.props.intl.formatMessage({
                          id: "bulletin:report:more-problems:hide:caption"
                        })}
                      </span>
                    </a>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
export default injectIntl(BulletinDaytimeReport);
