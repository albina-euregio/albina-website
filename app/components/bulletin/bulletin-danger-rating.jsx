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
    const dangerRating = this.props.bulletin.dangerRating;
    if (!dangerRating || !dangerRating.length) return null;

    const dangerRatingBelow = dangerRating.find(
      r => r?.elevation?.lowerBound === undefined
    )?.mainValue;
    const dangerRatingAbove = dangerRating.find(
      r => r?.elevation?.upperBound === undefined
    )?.mainValue;
    const dangerRatingBounds = dangerRating.flatMap(r => [
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
