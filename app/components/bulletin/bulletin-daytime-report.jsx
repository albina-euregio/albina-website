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
    this.state = { showMoreProblems: true };
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
                <li className="list-bulletin-report-pictos-trigger">
                  <a
                    onClick={() => {
                      console.log("xxx", this.state);
                      $("body").toggleClass(
                        "js-show-all-bulletin-report-pictos"
                      );
                      self.setState({
                        showMoreProblems: !this.state.showMoreProblems
                      });
                    }}
                    className="tooltip"
                    title={this.props.intl.formatMessage({
                      id: this.state.showMoreProblems
                        ? "bulletin:report:more-problems:open:title"
                        : "bulletin:report:more-problem:hide:title"
                    })}
                  >
                    <span
                      className={
                        this.state.showMoreProblems
                          ? "icon-down-open-big"
                          : "icon-up-open-big"
                      }
                    ></span>
                    <span>
                      {this.props.intl.formatMessage({
                        id: this.state.showMoreProblems
                          ? "bulletin:report:more-problems:open:caption"
                          : "bulletin:report:more-problem:hide:caption"
                      })}
                    </span>
                  </a>
                </li>
                {splitupProblems.optional}
              </>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
export default inject("locale")(injectIntl(BulletinDaytimeReport));
