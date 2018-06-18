import React from 'react';
import ProblemIconLink from '../icons/problem-icon-link.jsx';
import WarnLevelIcon from '../icons/warn-level-icon.jsx';

export default class BulletinMapDetails extends React.Component {
  constructor(props) {
    super(props);
    this.warnlevelNumbers = { // TODO: refactor into bulletin store
      'low': 1,
      'moderate': 2,
      'considerable': 3,
      'high': 4,
      'very high': 5
    };
  }

  render() {
    // TODO: create common component with bulletin-report
    const b = this.props.bulletin;
    const warnlevels = {
      'above': b.dangerRatingAbove ? this.warnlevelNumbers[b.dangerRatingAbove] : 0,
      'below': b.dangerRatingBelow ? this.warnlevelNumbers[b.dangerRatingBelow] : 0
    };

    const elevation = (b.hasElevationDependency && !b.treeline) ? b.elevation : null;
    const treeline = b.hasElevationDependency && b.treeline;

    return (
      <ul className="list-plain">
        <li>
          <WarnLevelIcon below={warnlevels.below} above={warnlevels.above} elevation={elevation} treeline={treeline} />
        </li>
        <li>
          <ProblemIconLink problem={'wind_drifted_snow'} />
        </li>
        <li>
          <ProblemIconLink problem={'weak_persistent_layer'} />
        </li>
      </ul>
    )
  }
}
