import React from "react";
import { observer } from "mobx-react";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

/**
 * @typedef {object} Props
 * @prop {Albina.DaytimeBulletin} bulletin
 *
 * @extends {React.Component<Props>}
 */
@observer
class BulletinMapDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // TODO: create common component with bulletin-report

    const daytime =
      this.props.bulletin.hasDaytimeDependency && this.props.ampm == "pm"
        ? "afternoon"
        : "forenoon";
    const bulletin = this.props.bulletin[daytime];
    function sortByMainValue(a, b) {
      return (
        window["appStore"].getWarnlevelNumber(a.dangerRating.mainValue) >
        window["appStore"].getWarnlevelNumber(b.dangerRating.mainValue)
      );
    }
    const problems = bulletin.avalancheProblems.sort(sortByMainValue) || [];
    let key = 0;

    return (
      <>
        <ul className="list-plain">
          <li className="bulletin-report-picto tooltip">
            <BulletinDangerRating bulletin={bulletin} />
          </li>{" "}
          {problems.map(problem => {
            if (key < 2)
              return (
                <li key={key++}>
                  <ProblemIconLink problem={problem} />
                </li>
              );
          })}
        </ul>

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
      </>
    );
  }
}

export default inject("locale")(injectIntl(BulletinMapDetails));
