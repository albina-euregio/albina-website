import React from "react";
import { observer } from "mobx-react";
import ProblemIconLink from "../icons/problem-icon-link.jsx";
import WarnLevelIcon from "../icons/warn-level-icon.jsx";

/**
 * @typedef {object} Props
 * @prop {Bulletin.Bulletin} bulletin
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
      this.props.bulletin.hasDaytimeDependency &&
      this.props.ampm == "pm"
        ? "afternoon"
        : "forenoon";
    const b = this.props.bulletin[daytime];

    const elevation =
      this.props.bulletin.hasElevationDependency &&
      !this.props.bulletin.treeline
        ? this.props.bulletin.elevation
        : null;
    const treeline =
      this.props.bulletin.hasElevationDependency &&
      this.props.bulletin.treeline;

    const problems = [];
    if (b.avalancheSituation1 && b.avalancheSituation1.avalancheSituation) {
      problems.push(b.avalancheSituation1.avalancheSituation);
    }
    if (b.avalancheSituation2 && b.avalancheSituation2.avalancheSituation) {
      if (
        problems.length > 0 &&
        b.avalancheSituation2.avalancheSituation != problems[0]
      ) {
        problems.push(b.avalancheSituation2.avalancheSituation);
      }
    }

    return (
      <ul className="list-plain">
        <li className="bulletin-report-picto tooltip">
          <WarnLevelIcon
            below={b.dangerRatingBelow}
            above={b.dangerRatingAbove}
            elevation={elevation}
            treeline={treeline}
          />
        </li>{" "}
        {problems.map(id => (
          <li key={id}>
            <ProblemIconLink problem={id} />
          </li>
        ))}
      </ul>
    );
  }
}
