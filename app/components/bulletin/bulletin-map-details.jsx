import React from "react";
import { observer } from "mobx-react";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";
import { injectIntl } from "react-intl";

/**
 * @typedef {object} Props
 * @prop {Albina.DaytimeBulletin} bulletin
 * @prop {string} region
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
    const problems = bulletin.avalancheProblems || [];
    let key = 0;

    return (
      <>
        <p className="bulletin-report-region-name">
          <span className="bulletin-report-region-name-region">
            {this.props.region}
          </span>
        </p>
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
            <span className="icon-attention bulletin-report-public-alert-icon"></span>
            {bulletin.highlights}
          </p>
        )}
      </>
    );
  }
}

export default injectIntl(BulletinMapDetails);
