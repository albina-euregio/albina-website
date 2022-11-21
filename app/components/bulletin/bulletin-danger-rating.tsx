import React from "react";
import WarnLevelIcon from "../icons/warn-level-icon.jsx";

/**
 * @typedef {object} Props
 * @prop {Caaml.Bulletin} bulletin
 *
 * @extends {React.Component<Props>}
 */
class BulletinDangerRating extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const dangerRatings = this.props.bulletin.dangerRatings;
    if (!dangerRatings || !dangerRatings.length) return null;

    const dangerRatingBelow = dangerRatings.find(
      r => r?.elevation?.lowerBound === undefined
    )?.mainValue;
    const dangerRatingAbove = dangerRatings.find(
      r => r?.elevation?.upperBound === undefined
    )?.mainValue;
    const dangerRatingBounds = dangerRatings.flatMap(r => [
      r?.elevation?.lowerBound,
      r?.elevation?.upperBound
    ]);
    const elevation = dangerRatingBounds.find(bound => bound !== "treeline");
    const treeline = dangerRatingBounds.some(bound => bound === "treeline");

    return (
      <WarnLevelIcon
        below={dangerRatingBelow}
        above={dangerRatingAbove}
        elevation={elevation}
        treeline={treeline}
      />
    );
  }
}
export default BulletinDangerRating;
