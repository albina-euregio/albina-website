import React from "react";
import { observer } from "mobx-react";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import BulletinDangerRating from "./bulletin-danger-rating.jsx";

/**
 * @typedef {object} Props
 * @prop {Albina.DaytimeBulletin} bulletin
 *
 * @extends {React.Component<Props>}
 */
@observer
export default class BulletinMapDetails extends React.Component {
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

    return (
      <ul className="list-plain">
        <li className="bulletin-report-picto tooltip">
          <BulletinDangerRating bulletin={bulletin} />
        </li>{" "}
        {problems.map(problem => (
          <li key={problem.type}>
            <ProblemIconLink problem={problem} />
          </li>
        ))}
      </ul>
    );
  }
}
